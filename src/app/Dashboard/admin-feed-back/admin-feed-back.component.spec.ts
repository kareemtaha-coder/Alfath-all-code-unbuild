import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFeedBackComponent } from './admin-feed-back.component';

describe('AdminFeedBackComponent', () => {
  let component: AdminFeedBackComponent;
  let fixture: ComponentFixture<AdminFeedBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFeedBackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminFeedBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
