import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timer, BehaviorSubject } from 'rxjs';
import {  switchMap, share, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetContactsService {

  constructor(private _HtttpClient:HttpClient) { 
  }
  public contactsSubject = new BehaviorSubject<any[]>([]);
  public contacts$ = this.contactsSubject.asObservable();



 
  getContacts():Observable<any>{
    const token = localStorage!.getItem('adminToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this._HtttpClient.get('https://localhost:7107/api/Contacts',{ headers })
  }


  toggleContactStatus(id: number): Observable<any> {
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this._HtttpClient.put(`https://localhost:7107/api/Contacts/toggle-contact-status/${id}`,{}, { headers });
  }
  // toggleContactStatus(id: number): Observable<any> {
  //   return this._HtttpClien.put(
  //     `https://localhost:7107/api/Contacts/toggle-contact-status/${id}`, 
  //     {},
  //     { headers: this.getHeaders() }
  //   );
  // }
}
