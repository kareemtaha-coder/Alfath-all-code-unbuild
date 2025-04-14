import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { takeUntil, takeWhile, startWith } from 'rxjs/operators';

interface LoadingState {
  progress: number;
  message: string;
}

@Component({
  selector: 'app-loader',
  template: `
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
    </div>

    <div class="loader-container">
      <div class="particles" #particlesContainer></div>

      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>

      <div class="logo-container">
        <img src="../../assets/images/1.png" alt="" style="max-width: 100%;">
      </div>

      <div class="loading-text">{{ (loadingState$ | async)?.message }}</div>

      <div class="progress-container">
        <div class="progress-bar">
          <div 
            class="progress" 
            [style.width.%]="(loadingState$ | async)?.progress"
          ></div>
        </div>
        <div class="progress-text">{{ (loadingState$ | async)?.progress | number:'1.0-0' }}%</div>
      </div>
    </div>
  `,
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  @Output() loadingComplete = new EventEmitter<void>();

  private readonly destroy$ = new Subject<void>();
  private readonly loadingMessages = [
    'Loading your application',
    'Preparing resources',
    'Initializing components',
    'Almost there',
    'Ready!'
  ];
  
  private readonly loadingState = new BehaviorSubject<LoadingState>({
    progress: 0,
    message: this.loadingMessages[0]
  });
  
  loadingState$ = this.loadingState.asObservable();
  private readonly minLoadingTime = 1000; // Minimum loading time in ms

  ngOnInit(): void {
    this.createParticles();
    this.startProgressSimulation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createParticles(count: number = 15): void {
    const container = document.querySelector('.particles');
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 4 + 4;
      Object.assign(particle.style, {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${Math.random() * 2}s`
      });

      container.appendChild(particle);
    }
  }

  private startProgressSimulation(): void {
    const startTime = Date.now();
    let progress = 0;
    
    timer(0, 50)  // Update every 50ms
      .pipe(
        takeUntil(this.destroy$),
        takeWhile(() => progress < 100)
      )
      .subscribe(() => {
        const elapsedTime = Date.now() - startTime;
        progress = Math.min(100, (elapsedTime / this.minLoadingTime) * 100);
        
        const messageIndex = Math.min(
          Math.floor((progress / 100) * (this.loadingMessages.length - 1)),
          this.loadingMessages.length - 1
        );

        this.loadingState.next({
          progress,
          message: this.loadingMessages[messageIndex]
        });

        if (progress === 100) {
          setTimeout(() => {
            this.loadingComplete.emit();
          }, 500); // Small delay for visual polish
        }
      });
  }
}