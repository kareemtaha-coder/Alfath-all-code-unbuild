import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, AfterViewInit {
  constructor(public translate: TranslateService ){
    console.log(translate.currentLang);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    // Select all elements with the 'counter-value' class
    const counters = document.querySelectorAll('.counter-value');

    // Create an IntersectionObserver to observe when elements are in the viewport
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // If the element is in view, start counting
        if (entry.isIntersecting) {
          const counter = entry.target;
          const targetValue = +(counter?.getAttribute('data-target') || 0);          
          // Start the counter animation
          this.animateCounter(counter, targetValue, 2000);
          
          // Stop observing this counter once the animation has started
          observer.unobserve(counter);
        }
      });
    }, {
      threshold: 0.5 // Trigger when 50% of the element is visible
    });

    // Observe each counter element
    counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  // Function to animate the counter from 0 to target value
  animateCounter(counter: any, targetValue: number, duration: number) {
    const startValue = 0;
    const startTime = Date.now();

    const updateCounter = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = elapsedTime / duration;
      const currentValue = Math.floor(progress * (targetValue - startValue) + startValue);

      counter.textContent = currentValue.toString();

      if (elapsedTime < duration) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = targetValue.toString(); // Ensure it ends at the target value
      }
    };

    requestAnimationFrame(updateCounter);
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
