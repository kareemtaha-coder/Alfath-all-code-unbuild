import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-islamic-course',
  templateUrl: './islamic-course.component.html',
  styleUrl: './islamic-course.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideInText', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('objectiveAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-50px)', opacity: 0 }),
        animate('{{delay}}ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class IslamicCourseComponent  implements OnInit {
  isLoading = true;
  progress = 0;

  constructor(
    private meta: Meta,
    private titleService: Title,
    public translate: TranslateService  ) {}

  ngOnInit() {
    this.setupSEO();
    this.initializeComponent();
  }

  private setupSEO() {
    this.titleService.setTitle('Learn Arabic - Comprehensive Course');
    this.meta.addTags([
      { name: 'description', content: 'Master Arabic language with our comprehensive course. Interactive lessons, native speakers, and practical exercises.' },
      { name: 'keywords', content: 'Arabic course, learn Arabic, Arabic language, Arabic lessons' }
    ]);
  }

  private initializeComponent() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    this.progress = (window.scrollY / documentHeight) * 100;
  }

  getBootstrapIconByIndex(index: number): string {
    const icons = [
      'bi-alarm',         // Example icons, replace these with the actual icons you want to use
      'bi-bag-check',
      'bi-chat',
      'bi-star',
      'bi-bell',
      'bi-camera'
    ];
    return icons[index % icons.length];  // Cycle through icons if you have more points than icons
  }


  transform: string = '';

  onMouseMove(event: MouseEvent): void {
    const container = (event.target as HTMLElement).closest('.hero-img') as HTMLElement;
    const rect = container.getBoundingClientRect();

    // Get mouse position relative to the container
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate rotation and skew values based on mouse position
    const rotateY = ((x / rect.width) - 0.5) * 10;  // -10 to 10 degrees
    const rotateX = ((y / rect.height) - 0.5) * 10; // -10 to 10 degrees (inverted for natural feel)
    const skewX = ((x / rect.width) - 0.5) * -10;     // -5 to 5 degrees
    const skewY = ((y / rect.height) - 0.5) * -10;     // -5 to 5 degrees

    // Update the transform property
    this.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) skewX(${skewX}deg) skewY(${skewY}deg)`;
  }

  onMouseLeave(): void {
    // Reset the transform on mouse leave
    this.transform = 'rotateY(0deg) rotateX(0deg) skewX(0deg) skewY(0deg)';
  }



}
