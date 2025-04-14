import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IslamicCourseComponent } from './islamic-course.component';

describe('IslamicCourseComponent', () => {
  let component: IslamicCourseComponent;
  let fixture: ComponentFixture<IslamicCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IslamicCourseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IslamicCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
