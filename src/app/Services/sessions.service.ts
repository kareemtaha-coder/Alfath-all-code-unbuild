import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

export interface Session {
  id: number;
  title: string;
  link: string;
  description: string;
  safeUrl?: SafeResourceUrl;
}

export interface VideoCategory {
  videos: Session[];
}

@Injectable({
  providedIn: 'root'
})
export class SessionsService {


  private apiUrl = 'https://al-fath.runasp.net/api/Sessions';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getSession(id: number): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  addSession(session: Session): Observable<Session> {
    return this.http.post<Session>(this.apiUrl, session, { headers: this.getHeaders() });
  }

  updateSession(id: number, session: Session): Observable<Session> {
    return this.http.put<Session>(`${this.apiUrl}/${id}`, session, { headers: this.getHeaders() });
  }

  deleteSession(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }


  
  getSessionsPage(): Observable<Session[]> {
    return this.http.get<Session[]>(this.apiUrl).pipe(
      map(sessions => sessions.map(session => ({
        ...session,
        safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(this.getEmbedUrl(session.link))
      })))
    );
  }

  getSessionPage(id: number): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/${id}`).pipe(
      map(session => ({
        ...session,
        safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(this.getEmbedUrl(session.link))
      }))
    );
  }

  private getEmbedUrl(youtubeUrl: string): string {
    const videoId = this.getYoutubeVideoId(youtubeUrl);
    return `https://www.youtube.com/embed/${videoId}`;
  }

  private getYoutubeVideoId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }
}
