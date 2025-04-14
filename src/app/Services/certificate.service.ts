import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
 private apiUrl = 'https://al-fath.runasp.net/api/Certificates';
  
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  addCertificate(CertificateData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, CertificateData, { headers: this.getHeaders() });
  }

  updateCertificate(CertificateId: string, CertificateData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${CertificateId}`, CertificateData, { headers: this.getHeaders() });
  }
  GetCertificate(CertificateId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${CertificateId}`);
  }


  GetCertificates(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  deleteCertificate(CertificateId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${CertificateId}`, { headers: this.getHeaders() });
  }
}
