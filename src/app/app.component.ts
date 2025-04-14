import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './Services/language.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AppComponent {
  title = 'Al-Fath';

  constructor(
    public translate: TranslateService,
    private languageService: LanguageService
  ) {
    // Set the default language
    this.translate.setDefaultLang('en');

    // Attempt to detect the stored language or fall back to browser language
    let savedLang: string | null = null;

    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      savedLang = localStorage.getItem('appLanguage');
    }

    const browserLang: string = savedLang || this.translate.getBrowserLang() || 'en';

    // Use the saved or detected language, ensuring it matches available options
    const selectedLang = browserLang.match(/en|ar/) ? browserLang : 'en';

    // Set the language in ngx-translate and the body class for the current language
    this.translate.use(selectedLang);
    this.languageService.setLanguageClass(selectedLang);


      // Start listening to page load
      window.addEventListener('load', () => {
        this.pageLoaded = true;
        this.checkLoadingComplete();
      });
  }

  // Method to change language dynamically
  changeLanguage(lang: string) {
    // Change the language for ngx-translate
    this.translate.use(lang);
    
    // Update the language class on the body element
    this.languageService.setLanguageClass(lang);
  }


  loading = true;
  private pageLoaded = false;

  ngOnInit() {
     // If page is already loaded, mark as loaded
     if (document.readyState === 'complete') {
      this.pageLoaded = true;
      this.checkLoadingComplete();
    }
  }

  onLoadingComplete() {
    this.checkLoadingComplete();
  }

  private checkLoadingComplete() {
    // Only hide loader when both conditions are met:
    // 1. Page is fully loaded
    // 2. Minimum loading animation has completed
    if (this.pageLoaded) {
      this.loading = false;
    }
  }
}
