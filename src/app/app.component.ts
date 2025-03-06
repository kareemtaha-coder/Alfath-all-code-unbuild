import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './Services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
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
  }

  // Method to change language dynamically
  changeLanguage(lang: string) {
    // Change the language for ngx-translate
    this.translate.use(lang);
    
    // Update the language class on the body element
    this.languageService.setLanguageClass(lang);
  }
}
