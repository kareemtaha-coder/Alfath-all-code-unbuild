import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

// Add interface for login response
interface LoginResponse {
  email: string;
  expiresin: number;
  firstName: string;
  id: string;
  isConfirmed: boolean;
  lastName: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://al-fath.runasp.net/api';
  private readonly SECURITY_CODE = 'g5$wK!9fD#r2T&4';

  isAdminLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isEmailConfirmed: BehaviorSubject<boolean> = new BehaviorSubject(false);
  userEmail: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private httpClient: HttpClient) {
    // Check localStorage on service initialization
    const token = localStorage.getItem('adminToken');
    if (token) {
      this.isAdminLoggedIn.next(true);
    }

    const confirmedStatus = localStorage.getItem('emailConfirmed');
    if (confirmedStatus) {
      this.isEmailConfirmed.next(confirmedStatus === 'true');
    }

    const email = localStorage.getItem('userEmail');
    if (email) {
      this.userEmail.next(email);
    }
  }

  logOut() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("emailConfirmed");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("emailBannerDismissed");
    this.isAdminLoggedIn.next(false);
    this.isEmailConfirmed.next(false);
    // this.userEmail.next('');
  }

  login(loginData: object): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.API_URL}/Auth`, loginData)
      .pipe(
        tap((response: LoginResponse) => {
          // Store the isConfirmed value in localStorage and update BehaviorSubject
          localStorage.setItem("emailConfirmed", response.isConfirmed.toString());
          localStorage.setItem("userEmail", response.email);
          this.isEmailConfirmed.next(response.isConfirmed);
          this.userEmail.next(response.email);
        })
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const payload = {
      currentPassword,
      newPassword
    };
    return this.httpClient.put(`${this.API_URL}/Auth/change-password`, payload, { headers });
  }

  forgotPassword(email: string): Observable<any> {
    const payload = {
      email: email
    };
    return this.httpClient.post(`${this.API_URL}/Auth/forget-password`, payload);
  }

  // Add new method for reset password
  resetPassword(resetData: { email: string, code: string, newPassword: string }): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/Auth/reset-password`, resetData);
  }

  // Add method to resend confirmation email
  resendConfirmationEmail(payload: { email: any }): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/Auth/resend-confirmation-email`, payload);
  }

  getSecurityCode(): string {
    return this.SECURITY_CODE;
  }

  // Method to check if email is confirmed
  isUserEmailConfirmed(): boolean {
    return this.isEmailConfirmed.getValue();
  }

  // Method to get user email
  getUserEmail(): string {
    return this.userEmail.getValue();
  }
}
