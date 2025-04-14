import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher-starter',
  templateUrl: './teacher-starter.component.html',
  styleUrl: './teacher-starter.component.scss'
})
export class TeacherStarterComponent {
  activeTab: 'hiring' | 'create' | 'manage' = 'create';

  setActiveTab(tab: 'hiring' | 'create' | 'manage'): void {
    this.activeTab = tab;
  }
}
