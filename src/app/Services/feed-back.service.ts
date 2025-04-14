import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedBackService {
  private apiUrl = 'https://al-fath.runasp.net/api/Feedbacks';
  
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  addFeedBack(FeedBackData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, FeedBackData, { headers: this.getHeaders() });
  }

  updateFeedBack(FeedBackId: string, FeedBackData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${FeedBackId}`, FeedBackData, { headers: this.getHeaders() });
  }
  GetFeedBack(FeedBackId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${FeedBackId}`);
  }


  GetFeedBacks(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  deleteFeedBack(FeedBackId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${FeedBackId}`, { headers: this.getHeaders() });
  }
}
