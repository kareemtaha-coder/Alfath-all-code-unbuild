import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguage: string = 'en'; // Default language

  constructor() {
    if (this.isBrowser()) {
      // Initialize language class from localStorage or default to 'en'
      const savedLang = localStorage.getItem('appLanguage') || 'en';
      this.setLanguageClass(savedLang);
    }
  }

  // Check if running in browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined' && typeof document !== 'undefined';
  }

  // Set language and update body class
  setLanguageClass(lang: string) {
    this.currentLanguage = lang;

    if (this.isBrowser()) {
      const body = document.body;

      // Remove existing language classes
      body.classList.remove('lang-en', 'lang-ar');

      // Add the class for the current language
      body.classList.add(`lang-${lang}`);

      // Store the selected language in localStorage
      localStorage.setItem('appLanguage', lang);
    }
  }

  // Get the currently set language class
  getLanguageClass() {
    return this.currentLanguage;
  }
}
