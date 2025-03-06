import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

    private apiUrl = 'https://localhost:7107/api/Teachers';
  
    constructor(private http: HttpClient) {}
  
    submitTeacherData(teacherData: any): Observable<any> {
      const token = localStorage.getItem('adminToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
      return this.http.post(this.apiUrl, teacherData);
    }
  }

