import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, style, animate, state, query, stagger } from '@angular/animations';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, debounceTime, throttleTime } from 'rxjs/operators';

// Enhanced Interfaces
interface GalleryImage {
  src: string;
  alt: string;
  active: boolean;
  loaded?: boolean;
  description?: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
  expanded?: boolean;
  highlighted?: boolean;
  benefits?: string[];
}

interface ArabicLetter {
  char: string;
  delay: string;
  left: string;
  top: string;
  transform?: string;
}

interface TextReference {
  title: string;
  url: string;
}

interface DescriptiveText {
  key: string;
  references?: TextReference[];
}

// Animation Constants
const ANIMATION_DURATION = 600;
const SCROLL_THRESHOLD = 200;

@Component({
  selector: 'app-why-choose-alfath',
  templateUrl: './why-choose-alfath.component.html',
  styleUrls: ['./why-choose-alfath.component.scss'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(`${ANIMATION_DURATION}ms cubic-bezier(0.35, 0, 0.25, 1)`,
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ]),
    trigger('imageTransition', [
      state('active', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state('inactive', style({
        opacity: 0,
        transform: 'scale(0.95)'
      })),
      transition('inactive => active', [
        animate(`${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`)
      ]),
      transition('active => inactive', [
        animate(`${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`)
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('expandContent', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ height: 0, opacity: 0 }))
      ])
    ]),
    trigger('overlayAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('titleAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('600ms cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('ctaAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class WhyChooseAlfathComponent implements OnInit, OnDestroy {
  // Component State
  currentLang: string;
  isAnimating: boolean = false;
  currentImageIndex: number = 0;
  loading: boolean = true;
  showBackToTop: boolean = false;
  scrollProgress: number = 0;
  activeTextIndex: number = -1;
  parallaxStyle: any = {};

  // New Properties
  private destroy$ = new Subject<void>();
  private readonly PARTICLE_COLORS = ['#2563eb', '#0284c7', '#0891b2', '#fbbf24'];

  @ViewChildren('featureCard') featureCards!: QueryList<ElementRef>;
  private autoPlayInterval?: number;

  readonly galleryImages: GalleryImage[] = [
    {
      src: '../../../assets/images/5-pillars-hero.jpg',
      alt: 'Modern Islamic Learning Environment',
      active: true
    },
    {
      src: '../../../assets/images/gallery.jpg',
      alt: 'Interactive Learning Sessions',
      active: false
    },
    {
      src: '../../../assets/images/Prophet-Mohammed-Mosque_resized.jpg',
      alt: 'Islamic Studies Classes',
      active: false
    }
  ];

  readonly descriptiveTexts: string[] = [
    'INSTITUTE.DESCRIPTION_1',
    'INSTITUTE.DESCRIPTION_2',
    'INSTITUTE.DESCRIPTION_3'
  ];

  readonly features: Feature[] = [
    {
      icon: 'fas fa-graduation-cap',
      title: 'FEATURES.EXPERT_TEACHERS',
      description: 'FEATURES.EXPERT_TEACHERS_DESC'
    },
    {
      icon: 'fas fa-book-reader',
      title: 'FEATURES.INTERACTIVE_LEARNING',
      description: 'FEATURES.INTERACTIVE_LEARNING_DESC'
    },
    {
      icon: 'fas fa-users',
      title: 'FEATURES.PERSONALIZED',
      description: 'FEATURES.PERSONALIZED_DESC'
    },
    {
      icon: 'fas fa-mosque',
      title: 'FEATURES.ISLAMIC_STUDIES',
      description: 'FEATURES.ISLAMIC_STUDIES_DESC'
    }
  ];

  readonly arabicLetters: ArabicLetter[] = Array.from('ابتثجحخدذرزسشصضطظعغفقكلمنهويابتثجحخدذرزسشصضطظعغفقكلمنهويابتثجحخدذرزسشصضطظعغفقكلمنهوي')
    .map((char, index) => ({
      char,
      delay: `${(index * 0.3)}s`,
      left: `${Math.floor(Math.random() * 90)}%`,
      top: `${Math.floor(Math.random() * 90)}%`
    }));

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang || 'en';
  }

  ngOnInit(): void {
    this.startAutoPlay();
    this.subscribeToLanguageChanges();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  private subscribeToLanguageChanges(): void {
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
  }

  private startAutoPlay(): void {
    this.stopAutoPlay();
    this.autoPlayInterval = window.setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      window.clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = undefined;
    }
  }

  nextImage(): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.galleryImages[this.currentImageIndex].active = false;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryImages.length;
    this.galleryImages[this.currentImageIndex].active = true;

    setTimeout(() => {
      this.isAnimating = false;
    }, ANIMATION_DURATION);
  }

  prevImage(): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.galleryImages[this.currentImageIndex].active = false;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
    this.galleryImages[this.currentImageIndex].active = true;

    setTimeout(() => {
      this.isAnimating = false;
    }, ANIMATION_DURATION);
  }

  setCurrentImage(index: number): void {
    if (this.isAnimating || index === this.currentImageIndex) return;
    
    this.isAnimating = true;
    this.galleryImages[this.currentImageIndex].active = false;
    this.currentImageIndex = index;
    this.galleryImages[this.currentImageIndex].active = true;

    setTimeout(() => {
      this.isAnimating = false;
    }, ANIMATION_DURATION);
  }

  onMouseEnter(): void {
    this.stopAutoPlay();
  }

  onMouseLeave(): void {
    this.startAutoPlay();
  }
}