import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'https://localhost:7107/api/Blogs'; 
  constructor(private http: HttpClient) { }

  addBlog(blogData: FormData): Observable<any> {
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this.http.post<any>(this.apiUrl, blogData,{ headers });
  }


  GetBlogs(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  GetBlog(blogId:string): Observable<any> {
    return this.http.get<any>(this.apiUrl+'/'+blogId);
  }
}
