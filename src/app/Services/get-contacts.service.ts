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
    return this._HtttpClient.get('https://al-fath.runasp.net/api/Contacts',{ headers })
  }


  toggleContactStatus(id: number): Observable<any> {
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this._HtttpClient.put(`https://al-fath.runasp.net/api/Contacts/toggle-contact-status/${id}`,{}, { headers });
  }
 
}
