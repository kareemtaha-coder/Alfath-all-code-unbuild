import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyChooseAlfathComponent } from './why-choose-alfath.component';

describe('WhyChooseAlfathComponent', () => {
  let component: WhyChooseAlfathComponent;
  let fixture: ComponentFixture<WhyChooseAlfathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WhyChooseAlfathComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhyChooseAlfathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
