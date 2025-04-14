import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { BehaviorSubject, Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { CertificateService } from '../../Services/certificate.service';

export interface Certificate {
  id: number;
  title: string;
  description: string;
  imageName: string;
}

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly autoPlayDelay = 5000;
  private readonly touchThreshold = 50;
  private touchStartX = 0;
  readonly imageUrl: string = 'https://al-fath.runasp.net/images/';

  certificates$ = new BehaviorSubject<Certificate[]>([]);
  selectedCertificate$ = new BehaviorSubject<Certificate | null>(null);
  currentIndex$ = new BehaviorSubject<number>(0);
  isPlaying$ = new BehaviorSubject<boolean>(true);
  loading = false;
  error: string | null = null;

  private autoPlayInterval: number | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private certificateService: CertificateService
  ) {}

  get transformValue(): string {
    const index = this.currentIndex$.value;
    const itemWidth = this.isMobile ? 100 : 50; // 100% for mobile, 50% for desktop
    return `translateX(-${index * itemWidth}%)`;
  }

  get isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  isLastSlide(): boolean {
    const certificates = this.certificates$.value;
    if (!certificates?.length) return true;
    
    const currentIndex = this.currentIndex$.value;
    const maxIndex = certificates.length - (this.isMobile ? 1 : 2);
    return currentIndex >= maxIndex;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    switch(event.key) {
      case 'ArrowLeft':
        this.prevSlide();
        break;
      case 'ArrowRight':
        this.nextSlide();
        break;
      case 'Escape':
        this.closePreview();
        break;
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchEndX - this.touchStartX;

    if (Math.abs(deltaX) > this.touchThreshold) {
      if (deltaX > 0) {
        this.prevSlide();
      } else {
        this.nextSlide();
      }
    }
  }

  ngOnInit(): void {
    this.loadCertificates();
    this.initializeAutoPlay();
    this.handleResize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopAutoPlay();
  }

  private loadCertificates(): void {
    this.loading = true;
    this.error = null;

    this.certificateService.GetCertificates()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (certificates) => {
          if (certificates && certificates.length > 0) {
            this.certificates$.next(certificates);
          } else {
            this.error = 'No certificates available.';
          }
        },
        error: (error) => {
          console.error('Error loading certificates:', error);
          this.error = 'Failed to load certificates. Please try again later.';
        }
      });
  }

  private initializeAutoPlay(): void {
    if (this.isPlaying$.value) {
      this.startAutoPlay();
    }
  }

  private handleResize(): void {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.adjustLayoutForScreenSize();
      });
  }

  private adjustLayoutForScreenSize(): void {
    const certificates = this.certificates$.value;
    if (!certificates?.length) return;

    const currentIndex = this.currentIndex$.value;
    const maxIndex = certificates.length - (this.isMobile ? 1 : 2);
    if (currentIndex > maxIndex) {
      this.currentIndex$.next(maxIndex);
    }
    this.cdr.detectChanges();
  }

  toggleAutoPlay(): void {
    if (this.isPlaying$.value) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
    this.isPlaying$.next(!this.isPlaying$.value);
  }

  private startAutoPlay(): void {
    this.stopAutoPlay();
    this.autoPlayInterval = window.setInterval(() => {
      if (!this.isLastSlide()) {
        this.nextSlide();
      } else {
        this.currentIndex$.next(0);
      }
      this.cdr.detectChanges();
    }, this.autoPlayDelay);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      window.clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  nextSlide(): void {
    const certificates = this.certificates$.value;
    if (!certificates?.length) return;

    const currentIndex = this.currentIndex$.value;
    const maxIndex = certificates.length - (this.isMobile ? 1 : 2);
    const nextIndex = currentIndex >= maxIndex ? maxIndex : currentIndex + 1;
    this.currentIndex$.next(nextIndex);
  }

  prevSlide(): void {
    const currentIndex = this.currentIndex$.value;
    const prevIndex = currentIndex <= 0 ? 0 : currentIndex - 1;
    this.currentIndex$.next(prevIndex);
  }

  openPreview(certificate: Certificate): void {
    this.stopAutoPlay();
    this.selectedCertificate$.next(certificate);
  }

  closePreview(): void {
    this.selectedCertificate$.next(null);
    if (this.isPlaying$.value) {
      this.startAutoPlay();
    }
  }

  trackByCertificate(_: number, certificate: Certificate): number {
    return certificate.id;
  }
}