import {  Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../Services/language.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent  {

  constructor(public translate: TranslateService,private languageService: LanguageService) {}

  // Change the language and save the selected language to local storage


    changeLanguage(event: Event) {
      const selectElement = event.target as HTMLSelectElement;
      const lang = selectElement.value;
      this.translate.use(lang);
      this.languageService.setLanguageClass(lang); // Use the service to update styles
  
      // Save the chosen language
      if (typeof window !== 'undefined') {
        localStorage.setItem('appLanguage', lang);
      }
    }

  
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }


}
