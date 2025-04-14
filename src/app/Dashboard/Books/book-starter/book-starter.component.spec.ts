import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookStarterComponent } from './book-starter.component';

describe('BookStarterComponent', () => {
  let component: BookStarterComponent;
  let fixture: ComponentFixture<BookStarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookStarterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookStarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
