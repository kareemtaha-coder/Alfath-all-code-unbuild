import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherStarterComponent } from './teacher-starter.component';

describe('TeacherStarterComponent', () => {
  let component: TeacherStarterComponent;
  let fixture: ComponentFixture<TeacherStarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherStarterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherStarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
