import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, takeUntil, finalize } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { BookService } from '../../../Services/book.service';

export interface Book {
  id: number;
  title: string;
  description: string;
  author: string;
  reviewer: string;
  part: string;
  coverName: string;
  pdfId?: number;
  categories?: string[];
  rating?: number;
  publishDate?: Date;
}

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  book: Book | null = null;

  errorMessage = '';
  isLoading = true;
  readonly imageUrl = 'https://al-fath.runasp.net/images/';
  imageLoaded = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location,
    private router: Router
  ) {}

  /**
   * Initializes the component by loading book details
   */
  ngOnInit(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('id'));

    if (bookId) {
      this.loadBookDetails(bookId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'Invalid book ID';
    }
  }

  /**
   * Loads book details from the API
   * @param id The ID of the book to load
   */
   loadBookDetails(id: number): void {
    this.isLoading = true;
    this.bookService
      .getBookById(id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data) => {
          this.book = data;
          // Pre-load the image
          if (data?.coverName) {
            const img = new Image();
            img.onload = () => {
              this.imageLoaded = true;
            };
            img.src = this.imageUrl + data.coverName;
          }
        },
        error: (err) => {
          console.error('Failed to load book details:', err);
          this.errorMessage = 'Oops! Could not fetch book details. Please try again.';
        },
      });
  }

  /**
   * Navigates to the PDF viewer for this book
   */
  viewPdf(): void {
    if (this.book?.pdfId) {
      this.router.navigate(['/admin-dashboard/book-pdf', this.book.pdfId]);
    } else {
      alert('No PDF available for this book.');
    }
  }

  /**
   * Navigates back to the previous page
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Handler for image load completion
   */
  onImageLoad(): void {
    this.imageLoaded = true;
  }

  /**
   * Handler for window resize events
   */
  @HostListener('window:resize')
  onResize(): void {
    // Handler for responsive adjustments if needed
  }

  /**
   * Cleanup when component is destroyed
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
