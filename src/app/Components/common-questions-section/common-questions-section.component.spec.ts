import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonQuestionsSectionComponent } from './common-questions-section.component';

describe('CommonQuestionsSectionComponent', () => {
  let component: CommonQuestionsSectionComponent;
  let fixture: ComponentFixture<CommonQuestionsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonQuestionsSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommonQuestionsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
