import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'https://al-fath.runasp.net/api/Blogs';
  
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  addBlog(blogData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, blogData, { headers: this.getHeaders() });
  }

  updateBlog(blogId: string, blogData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${blogId}`, blogData, { headers: this.getHeaders() });
  }

  GetBlogs(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  GetBlog(blogId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${blogId}`);
  }

  deleteBlog(blogId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${blogId}`, { headers: this.getHeaders() });
  }
}