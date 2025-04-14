import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArabicCourseComponent } from './arabic-course.component';

describe('ArabicCourseComponent', () => {
  let component: ArabicCourseComponent;
  let fixture: ComponentFixture<ArabicCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArabicCourseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArabicCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
