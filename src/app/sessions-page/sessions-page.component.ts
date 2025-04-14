// sessions-page.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionsService, Session } from './../Services/sessions.service';
import { Meta, Title } from '@angular/platform-browser';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-sessions-page',
  templateUrl: './sessions-page.component.html',
  styleUrl: './sessions-page.component.scss'
})
export class SessionsPageComponent implements OnInit, OnDestroy {
  currentSession!: Session;
  sessionList: Session[] = [];
  isDescriptionExpanded: boolean = false;
  isLoading = new BehaviorSubject<boolean>(false);
  error = new BehaviorSubject<string | null>(null);
  private destroy$ = new Subject<void>();
  
  // Pagination
  currentPage = 1;
  pageSize = 12;
  hasMoreSessions = true;

  constructor(
    private sessionsService: SessionsService,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit() {
    this.loadSessions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSessions(loadMore = false) {
    if (loadMore && !this.hasMoreSessions) return;

    this.isLoading.next(true);
    this.error.next(null);

    const page = loadMore ? this.currentPage + 1 : 1;

    this.sessionsService.getSessionsPage()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.next(false))
      )
      .subscribe(
        (sessions) => {
          if (loadMore) {
            this.sessionList = [...this.sessionList, ...sessions];
            this.currentPage++;
          } else {
            this.sessionList = sessions;
            if (sessions.length > 0) {
              this.selectSession(sessions[0]);
            }
          }
          this.hasMoreSessions = sessions.length === this.pageSize;
        },
        (error) => {
          this.error.next('Failed to load sessions. Please try again later.');
          console.error('Error fetching sessions:', error);
        }
      );
  }

  selectSession(session: Session, isKeyboardEvent = false) {
    if (isKeyboardEvent && this.currentSession?.id === session.id) return;

    this.isLoading.next(true);
    this.error.next(null);

    this.sessionsService.getSessionPage(session.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.next(false))
      )
      .subscribe(
        (fullSession) => {
          this.currentSession = fullSession;
          this.isDescriptionExpanded = false;
          this.updateMetadata(fullSession);
        },
        (error) => {
          this.error.next('Failed to load session details. Please try again later.');
          console.error('Error fetching session details:', error);
        }
      );
  }

  private updateMetadata(session: Session) {
    this.title.setTitle(`${session.title} - Sessions`);
    this.meta.updateTag({ name: 'description', content: session.description });
  }

  toggleDescription() {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  truncateDescription(description: string, maxLength: number = 60): string {
    if (description.length <= maxLength) return description;
    return `${description.substr(0, maxLength)}...`;
  }

  handleKeyDown(event: KeyboardEvent, session: Session) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectSession(session, true);
    }
  }

  // Infinite scroll handler
  onScroll() {
    if (!this.isLoading.value && this.hasMoreSessions) {
      this.loadSessions(true);
    }
  }
}