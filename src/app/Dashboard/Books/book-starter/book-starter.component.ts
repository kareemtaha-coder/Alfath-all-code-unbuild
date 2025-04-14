import { Component } from '@angular/core';

@Component({
  selector: 'app-book-starter',
  templateUrl: './book-starter.component.html',
  styleUrls: ['../../Teacher/teacher-starter/teacher-starter.component.scss','./book-starter.component.scss']
})
export class BookStarterComponent {
  activeTab: 'create' | 'get' | 'manage' = 'get';

  setActiveTab(tab: 'create' | 'get' | 'manage'): void {
    this.activeTab = tab;
  }
}
