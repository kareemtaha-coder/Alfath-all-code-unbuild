import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../Services/language.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isScrolled = false;
  dropdownOpen = false;
  dropdownTimeout: any;
 
  menuItems = [
    { fragment: 'hero', icon: 'fas fa-home', label: 'navbar.hero' },
    { fragment: 'video-section', icon: 'fas fa-play-circle', label: 'navbar.videoSection' },
    { fragment: 'courses-section', icon: 'fas fa-graduation-cap', label: 'navbar.coursesSection' },
    { fragment: 'adventures', icon: 'fas fa-hiking', label: 'navbar.adventures' },
    { fragment: 'sessions-section', icon: 'far fa-calendar-alt', label: 'navbar.sessionsSection' },
    { fragment: 'features-section', icon: 'fas fa-award', label: 'navbar.featuresSection' },
    { fragment: 'testimonial-video-section', icon: 'fas fa-comment-dots', label: 'navbar.testimonialVideoSection' },
    { fragment: 'blog-section', icon: 'fas fa-feather-alt', label: 'navbar.blogSection' },
    { fragment: 'testimonial-section', icon: 'fas fa-quote-right', label: 'navbar.testimonialSection' },
    { fragment: 'common-questions-section', icon: 'fas fa-question-circle', label: 'navbar.commonQuestionsSection' }
  ];

  constructor(
    public translate: TranslateService,
    private languageService: LanguageService,
    public router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.scrollToFragment();
    });
  }

  ngOnInit() {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  showDropdown() {
    clearTimeout(this.dropdownTimeout);
    this.dropdownOpen = true;
  }

  hideDropdown() {
    this.dropdownTimeout = setTimeout(() => {
      this.dropdownOpen = false;
    }, 150);
  }

  keepDropdownOpen() {
    clearTimeout(this.dropdownTimeout);
  }

  navigateToFragment(fragment: string) {
    this.router.navigate(['/'], { fragment });
    this.dropdownOpen = false;
  }

  changeLanguage(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement.value;
    this.translate.use(lang);
    this.languageService.setLanguageClass(lang);
   
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLanguage', lang);
    }
  }

  private scrollToFragment() {
    const tree = this.router.parseUrl(this.router.url);
    if (tree.fragment) {
      const element = document.querySelector('#' + tree.fragment);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }
  }
}