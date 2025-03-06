import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsSectionComponent } from './sessions-section.component';

describe('SessionsSectionComponent', () => {
  let component: SessionsSectionComponent;
  let fixture: ComponentFixture<SessionsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionsSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessionsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
