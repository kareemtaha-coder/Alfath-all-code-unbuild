import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private _HtttpClient:HttpClient) { }
  
  public contactsSubject = new BehaviorSubject<any[]>([]);
  public contacts$ = this.contactsSubject.asObservable();



 
  getUsers():Observable<any>{
    const token = localStorage!.getItem('adminToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this._HtttpClient.get('https://localhost:7107/api/Users/get-all-users',{ headers })
  }
  
  Register(RegisterData: object): Observable<any> {
    return this._HtttpClient.post('https://localhost:7107/api/Auth/register', RegisterData);
  }


}
