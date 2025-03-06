import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegisterService } from '../../Services/register.service';
import { Subscription, timer } from 'rxjs';
import { switchMap, retry, share } from 'rxjs/operators';

interface User {
  firstName: string;
  lastName:string;
  phoneNumber:string;
}


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss' ,'../admin-contact/admin-contact.component.scss']
})
export class UsersComponent  implements OnInit, OnDestroy {
  users: User[] = [];
  private UserssSubscription: Subscription = new Subscription();
  isGridView = true;

  constructor(private _RegisterService: RegisterService) {
    this.initRealTimeUpdates();
  }

  ngOnInit() {
    this.GetUsers();
  }

  GetUsers() {
    this.UserssSubscription = this._RegisterService.contacts$.subscribe({
      next: (res) => {
        this.users = res;
        console.log(this.users);
      },
      error: (error) => console.error('Error fetching contacts:', error)
    });
  }

  initRealTimeUpdates() {
    timer(0, 20000)
      .pipe(
        switchMap(() => this._RegisterService.getUsers()),
        retry(1),
        share()
      )
      .subscribe({
        next: (users) => this._RegisterService.contactsSubject.next(users),
        error: (error) => console.error('Error fetching users:', error)
      });
  }

  toggleView(isGrid: boolean) {
    this.isGridView = isGrid;
  }


  ngOnDestroy() {
    if (this.UserssSubscription) {
      this.UserssSubscription.unsubscribe();
    }
  }
}