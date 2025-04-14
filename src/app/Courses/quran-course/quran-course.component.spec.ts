import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuranCourseComponent } from './quran-course.component';

describe('QuranCourseComponent', () => {
  let component: QuranCourseComponent;
  let fixture: ComponentFixture<QuranCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuranCourseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuranCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
