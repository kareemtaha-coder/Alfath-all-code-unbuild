import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactFormService {

  constructor(private _HtttpClient:HttpClient) { 
    // this.initRealTimeUpdates();
  }
  // private contactsSubject = new BehaviorSubject<any[]>([]);
  // public contacts$ = this.contactsSubject.asObservable();



  contact(contactData:object):Observable<any>{
   
    return this._HtttpClient.post('https://al-fath.runasp.net/api/Contacts',contactData)

  }
 
  // getContacts():Observable<any>{
  //   const token = localStorage!.getItem('adminToken');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
  //   return this._HtttpClient.get('https://tamken.runasp.net/api/Contacts',{ headers })
  // }


  // private initRealTimeUpdates() {
  //   timer(0, 5000).pipe(  // Polls every 5 seconds
  //     switchMap(() => this.getContacts()),
  //     retry(1),  // Retry once if there's an error
  //     share()  // Share the subscription among multiple subscribers
  //   ).subscribe({
  //     next: (contacts) => this.contactsSubject.next(contacts),
  //     error: (error) => console.error('Error fetching contacts:', error)
  //   });
  // }

}
