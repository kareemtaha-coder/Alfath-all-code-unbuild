// sessions.component.ts
import { modalAnimation,fadeInOut, slideInOut } from './sessions.animations';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SessionsService } from '../../../Services/sessions.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Session {
  id: number;
  title: string;
  link: string;
  description: string;
}

@Component({
  selector: 'app-sessions',
  templateUrl: './admin-sessions.component.html',
  styleUrls: ['./admin-sessions.component.scss'],
  animations: [fadeInOut, slideInOut, modalAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminSessionsComponent  implements OnInit {
  private sessionsSubject = new BehaviorSubject<Session[]>([]);
  sessions$ = this.sessionsSubject.asObservable();

  private searchSubject = new BehaviorSubject<string>('');

  isGridView = true;
  isLoading = false;
  selectedSession: Session | null = null;
  isNewSessionFormVisible = false;

  // Pagination
  itemsPerPage = new BehaviorSubject<number>(12);
  currentPage = new BehaviorSubject<number>(1);

  newSession: Session = this.getEmptySession();

  filteredSessions$: Observable<Session[]> = combineLatest([
    this.sessions$,
    this.searchSubject.asObservable().pipe(startWith(''))
  ]).pipe(
    map(([sessions, searchTerm]) =>
      sessions.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );

  displayedSessions$: Observable<Session[]> = combineLatest([
    this.filteredSessions$,
    this.currentPage,
    this.itemsPerPage
  ]).pipe(
    map(([sessions, page, perPage]) => {
      const start = (page - 1) * perPage;
      return sessions.slice(start, start + perPage);
    })
  );

  totalPages$: Observable<number> = combineLatest([
    this.filteredSessions$,
    this.itemsPerPage
  ]).pipe(
    map(([sessions, perPage]) => Math.ceil(sessions.length / perPage))
  );

  constructor(
    private sessionsService: SessionsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.isLoading = true;
    this.sessionsService.getSessions().subscribe({
      next: (sessions) => {
        this.sessionsSubject.next(sessions.reverse());
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching sessions:', error);
        this.isLoading = false;
      }
    });
  }

  addSession(): void {
    this.isLoading = true;
    this.sessionsService.addSession(this.newSession).subscribe({
      next: () => {
        this.loadSessions();
        this.toggleNewSessionForm();
        this.resetForm();
        this.isLoading = false;

      },
      error: (error) => {
        console.error('Error adding session:', error);
        this.isLoading = false;
      }
    });
  }

  deleteSession(id: number): void {
    if (confirm('Are you sure you want to delete this session?')) {
      this.isLoading = true;
      this.sessionsService.deleteSession(id).subscribe({
        next: () => {
          const currentSessions = this.sessionsSubject.getValue();
          this.sessionsSubject.next(currentSessions.filter(s => s.id !== id));
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting session:', error);
          this.isLoading = false;
        }
      });
    }
  }

  // UI Helpers
  toggleNewSessionForm(): void {
    this.isNewSessionFormVisible = !this.isNewSessionFormVisible;
    if (!this.isNewSessionFormVisible) {
      this.resetForm();
    }
  }

  toggleView(isGrid: boolean): void {
    this.isGridView = isGrid;
  }

  onSearch(term: string): void {
    this.searchSubject.next(term);
    this.currentPage.next(1);
  }

  onItemsPerPageChange(value: number): void {
    this.itemsPerPage.next(value);
    this.currentPage.next(1);
  }

  nextPage(): void {
    this.currentPage.next(this.currentPage.getValue() + 1);
  }

  prevPage(): void {
    this.currentPage.next(this.currentPage.getValue() - 1);
  }

  openModal(session: Session): void {
    this.selectedSession = session;
  }

  closeModal(): void {
    this.selectedSession = null;
  }

  getSafeYouTubeUrl(link: string): SafeResourceUrl {
    const videoId = this.extractVideoId(link);
    const url = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private extractVideoId(link: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = link.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  private resetForm(): void {
    this.newSession = this.getEmptySession();
  }

  private getEmptySession(): Session {
    return {
      id: 0,
      title: '',
      link: '',
      description: ''
    };
  }
}
