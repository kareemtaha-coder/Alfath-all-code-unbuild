import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  currentInfo: string | null = null;

  showMoreInfo(info: string) {
    this.currentInfo = info;
  }
  funFacts = [
    { title: 'Amazing Fact 1', description: 'Description for fact 1.', image: 'assets/images/hero.png' },
    { title: 'Amazing Fact 2', description: 'Description for fact 2.', image: 'assets/images/hero.png' },
    { title: 'Amazing Fact 3', description: 'Description for fact 3.', image: 'assets/images/hero.png' },
    { title: 'Amazing Fact 4', description: 'Description for fact 4.', image: 'assets/images/hero.png' },
    { title: 'Amazing Fact 5', description: 'Description for fact 5.', image: 'assets/images/hero.png' }
  ];

  selectedFact: any = null;
  currentIndex = 0;

  showPopup(fact: any) {
    this.selectedFact = fact;
    this.currentIndex = this.funFacts.indexOf(fact);
  }

  closePopup() {
    this.selectedFact = null;
  }

  nextFact() {
    if (this.currentIndex < this.funFacts.length - 1) {
      this.currentIndex++;
      this.selectedFact = this.funFacts[this.currentIndex];
    }
  }

  prevFact() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.selectedFact = this.funFacts[this.currentIndex];
    }
}}