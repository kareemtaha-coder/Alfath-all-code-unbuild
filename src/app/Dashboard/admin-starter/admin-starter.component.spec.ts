import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStarterComponent } from './admin-starter.component';

describe('AdminStarterComponent', () => {
  let component: AdminStarterComponent;
  let fixture: ComponentFixture<AdminStarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminStarterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminStarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
