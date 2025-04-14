import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private apiUrl = 'https://al-fath.runasp.net/api/Teachers';
  private baseUrl = 'https://al-fath.runasp.net/api';
  public teachersSubject = new BehaviorSubject<any[]>([]);
  public teachers$ = this.teachersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getTeachers(): Observable<any> {
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl, { headers });
  }

  deleteTeacher(id: number): Observable<any> {
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  updateTeacher(teacher: any): Observable<any> {
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${teacher.id}`, teacher, { headers });
  }

    submitTeacherData(teacherData: any): Observable<any> {
      return this.http.post(this.apiUrl, teacherData);
    }


    createTeacher(teacherData: any): Observable<any> {
      const token = localStorage.getItem('adminToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.apiUrl}/Auth/register-teacher`, teacherData,{ headers });
    }

    submitQuizSolutions(solutions: any): Observable<any> {
      return this.http.post(`${this.baseUrl}/quizzes/solutions`, solutions);
    }
  }

