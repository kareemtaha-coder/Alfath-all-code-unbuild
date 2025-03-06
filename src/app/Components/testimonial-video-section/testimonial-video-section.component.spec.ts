import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialVideoSectionComponent } from './testimonial-video-section.component';

describe('TestimonialVideoSectionComponent', () => {
  let component: TestimonialVideoSectionComponent;
  let fixture: ComponentFixture<TestimonialVideoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestimonialVideoSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestimonialVideoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
