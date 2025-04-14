import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  changePasswordForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  isAdminLoggedIn: boolean = false;
  isEmailConfirmed: boolean = false;
  errorMessage: string = '';
  showChangePassword: boolean = false;
  showForgotPassword: boolean = false;
  showEmailSentPopup: boolean = false;
  forgotPasswordEmail: string = '';
  changePasswordErrorMessage: string = '';
  changePasswordSuccessMessage: string = '';
  forgotPasswordMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.authService.isAdminLoggedIn.subscribe((res) => {
      this.isAdminLoggedIn = res;
    });

    this.authService.isEmailConfirmed.subscribe((res) => {
      this.isEmailConfirmed = res;
    });
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    this.changePasswordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmNewPassword: new FormControl('', [Validators.required]),
      securityCode: new FormControl('', [Validators.required])
    });

    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log("Login successful");
          console.log(res);
          console.log(res.firstName);
          console.log("Email confirmed:", res.isConfirmed);

          // Store token and role in localStorage
          localStorage.setItem("adminToken", res.token);
          localStorage.setItem("adminRole", res.firstName);

          // Update the login status
          this.authService.isAdminLoggedIn.next(true);

          // Navigate to dashboard
          this.router.navigate(['/admin-dashboard']);

          // If email is not confirmed, you could show a warning notification here
          if (!res.isConfirmed) {
            // You can handle unconfirmed email here
            // For example, show a warning banner on the dashboard
            console.warn("User email is not confirmed");
          }
        },
        error: (err) => {
          console.error("Login error", err);
          this.errorMessage = 'Invalid email or password. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
    this.showForgotPassword = false;
    this.changePasswordErrorMessage = '';
    this.changePasswordSuccessMessage = '';
  }

  toggleForgotPassword(): void {
    this.showForgotPassword = !this.showForgotPassword;
    this.showChangePassword = false;
    this.forgotPasswordMessage = '';

    // Pre-fill the email from login form if available
    if (this.loginForm.get('email')?.valid) {
      this.forgotPasswordForm.get('email')?.setValue(this.loginForm.get('email')?.value);
    }
  }

  onChangePassword(): void {
    if (this.changePasswordForm.valid) {
      const { currentPassword, newPassword, confirmNewPassword, securityCode } = this.changePasswordForm.value;

      if (newPassword !== confirmNewPassword) {
        this.changePasswordErrorMessage = 'New passwords do not match.';
        return;
      }
      // Assuming the security code is stored in the AuthService
      if (securityCode !== this.authService.getSecurityCode()) {
        this.changePasswordErrorMessage = 'Invalid security code.';
        return;
      }
      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.changePasswordSuccessMessage = 'Password changed successfully.';
          this.changePasswordForm.reset();

          // Automatically return to login after 3 seconds
          setTimeout(() => {
            this.toggleChangePassword();
          }, 3000);
        },
        error: (err) => {
          console.error("Change password error", err);
          this.changePasswordErrorMessage = 'Failed to change password. Please try again.';
        }
      });
    } else {
      this.changePasswordErrorMessage = 'Please fill in all required fields correctly.';
    }
  }

  onForgotPassword(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;
      this.forgotPasswordEmail = email;

      this.authService.forgotPassword(email).subscribe({
        next: () => {
          // Show popup instead of simple message
          this.showEmailSentPopup = true;
        },
        error: (err) => {
          console.error("Forgot password error", err);
          this.forgotPasswordMessage = 'Failed to process your request. Please try again.';
        }
      });
    } else {
      this.forgotPasswordMessage = 'Please enter a valid email address.';
    }
  }

  closeEmailSentPopup(): void {
    this.showEmailSentPopup = false;
    this.toggleForgotPassword(); // Return to login form
  }
}
