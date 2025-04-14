import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../../Services/book.service';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

interface Book {
  id: number;
  title: string;
  description: string;
  author: string;
  reviewer: string;
  part: string;
  coverName: string;
  rating?: number;
}

@Component({
  selector: 'app-available-books',
  templateUrl: './available-books.component.html',
  styleUrls: ['./available-books.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AvailableBooksComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  private destroy$ = new Subject<void>();
  errorMessage: string = '';
  loading: boolean = true;
  searchTerm: string = '';
  categoryFilter: string = 'all';
  imagUrl: string = 'https://al-fath.runasp.net/images/';

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService
      .getBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Book[]) => {
          this.books = data;
          this.filteredBooks = [...data];
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load books:', err);
          this.errorMessage = 'Oops! Failed to load books. Please try again later.';
          this.loading = false;
        },
      });
  }

  deleteBook(id: number, event: Event): void {
    event.stopPropagation();

    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService
        .deleteBook(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.books = this.books.filter((book) => book.id !== id);
            this.filteredBooks = this.filteredBooks.filter((book) => book.id !== id);
            this.showNotification('Book deleted successfully!', 'success');
          },
          error: (err) => {
            console.error('Failed to delete book:', err);
            this.showNotification('Error deleting book. Please try again.', 'error');
          },
        });
    }
  }

  // Navigate to the details page
  goToDetails(bookId: number): void {
    this.router.navigate([`/admin-dashboard/book-details/${bookId}`]);
  }

  searchBooks(): void {
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (this.categoryFilter !== 'all') {
      this.filteredBooks = this.filteredBooks.filter(book =>
        book.part.toLowerCase() === this.categoryFilter.toLowerCase()
      );
    }
  }

  filterByCategory(category: string): void {
    this.categoryFilter = category;
    this.searchBooks();
  }

  refreshBooks(): void {
    this.loadBooks();
    this.searchTerm = '';
    this.categoryFilter = 'all';
    this.showNotification('Books refreshed!', 'info');
  }

  showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.errorMessage = message;
    // In a real implementation, you'd use a notification service
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
