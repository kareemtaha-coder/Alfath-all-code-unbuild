import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookPdfComponent } from './book-pdf.component';

describe('BookPdfComponent', () => {
  let component: BookPdfComponent;
  let fixture: ComponentFixture<BookPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookPdfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
