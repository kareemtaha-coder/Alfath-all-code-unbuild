import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { SessionsService } from '../../Services/sessions.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Video {
  id: number;
  title: string;
  link: string;
  description: string;
  duration?: string;
}

@Component({
  selector: 'app-sessions-section',
  templateUrl: './sessions-section.component.html',
  styleUrl:'./sessions-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsSectionComponent implements OnInit, OnDestroy {
  videos: Video[] = [];
  displayedVideos: Video[] = [];
  activeTab = 0;
  isLoading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private sessionService: SessionsService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchVideos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.videos = []
  }

  fetchVideos() {
    this.isLoading = true;
    this.error = null;
    this.cdr.markForCheck();

    this.sessionService.getSessionsPage().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data: Video[]) => {
        this.videos = data;
        const firstVideo = this.videos.shift();
        if (firstVideo) {
          // Reverse the remaining videos and take the first three
          const reversedVideos = this.videos.slice().reverse().slice(0, 3);
        
          // Initialize displayedVideos with the first video and add the three from the reversed array
          this.displayedVideos = [firstVideo, ...reversedVideos];
        } else {
          // Handle the case where there are no videos in the array
          this.displayedVideos = this.videos.slice().reverse().slice(0, 3);
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching videos:', error);
        this.error = 'Unable to load videos. Please try again later.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  changeTab(index: number) {
    if (index >= 0 && index < this.displayedVideos.length) {
      this.activeTab = index;
      this.cdr.markForCheck();
    }
  }

  getActiveVideo(): Video | undefined {
    return this.displayedVideos[this.activeTab];
  }

  getSafeYouTubeUrl(link: string): SafeResourceUrl {
    try {
      const videoId = this.extractVideoId(link);
      if (!videoId) throw new Error('Invalid YouTube URL');
      const url = `https://www.youtube.com/embed/${videoId}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } catch (error) {
      console.error('Error processing YouTube URL:', error);
      return this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
    }
  }

  private extractVideoId(link: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = link.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  getFirstWords(str: string = '', num: number): string {
    const words = str.split(' ');
    const firstWords = words.slice(0, num).join(' ');
    return words.length > num ? `${firstWords}...` : firstWords;
  }
}