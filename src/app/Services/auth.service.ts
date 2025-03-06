import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _HtttpClient:HttpClient) { }

  isAdminLoggedIn:BehaviorSubject<boolean> = new BehaviorSubject(false)


  logOut(){
    localStorage.removeItem("adminToken");
    this.isAdminLoggedIn.next(false);
  }


  login(loginData: object): Observable<any> {
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this._HtttpClient.post('https://localhost:7107/api/Auth', loginData, { headers });
  }

}
