import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  deleteQuestion(id: number) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'https://al-fath.runasp.net/api';
  private solutionsUrl = 'https://al-fath.runasp.net/api/quizzes/solutions';

  constructor(private http: HttpClient) {}

  // Helper method to get headers with the authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Quiz Operations
  getQuizzes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Quizzes`, { headers: this.getHeaders() });
  }

  getQuizById(quizId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Quizzes/${quizId}`, { headers: this.getHeaders() });
  }

  addQuiz(quiz: { title: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/Quizzes`, quiz, { headers: this.getHeaders() });
  }

  updateQuiz(quizId: number, quiz: { title: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/Quizzes/${quizId}`, quiz, { headers: this.getHeaders() });
  }

  deleteQuiz(quizId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Quizzes/${quizId}`, { headers: this.getHeaders() });
  }

  // Question Operations
  getQuizQuestions(quizId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/quizzes/${quizId}/questions`, { headers: this.getHeaders() });
  }

  getQuestionById(quizId: number, questionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/quizzes/${quizId}/questions/${questionId}`, { headers: this.getHeaders() });
  }

  addQuizQuestion(quizId: number, question: {
    content: string,
    choices: { content: string, isCorrect: boolean }[]
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/quizzes/${quizId}/questions`, question, { headers: this.getHeaders() });
  }

  updateQuizQuestion(quizId: number, questionId: number, question: {
    content: string,
    choices: { content: string, isCorrect: boolean }[]
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/quizzes/${quizId}/questions/${questionId}`, question, { headers: this.getHeaders() });
  }

  toggleQuestionStatus(quizId: number, questionId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/quizzes/${quizId}/questions/${questionId}/toggle-status`, {}, { headers: this.getHeaders() });
  }

  // Solutions Operations
  getQuizSolutions(quizId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/quizzes/${quizId}/solutions`, { headers: this.getHeaders() });
  }



  getQuestionsByQuizIds(quizIds: number[]): Observable<any> {
    return this.http.get(`${this.solutionsUrl}?quizIds=${quizIds.join(',')}`);
  }


  getQuizQuestionsforTeacher(quizIds: number[]): Observable<any> {
    // Construct the query string manually
    let queryString = quizIds.map(id => `quizIds=${id}`).join('&');
  
    // Append the query string to the URL
    const url = `${this.apiUrl}/quizzes/Solutions?${queryString}`;
  
    return this.http.get(url);
  }
}