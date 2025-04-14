import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';


interface Testimonial {
  imageUrl: string;
  studentName: string;
  groupName: string;
  altText: string;
  quote: string;
}


@Component({
  selector: 'app-testimonial-section',
  templateUrl: './testimonial-section.component.html',
  styleUrl: './testimonial-section.component.scss'
})
export class TestimonialSectionComponent  {
  @ViewChild('modalContent') modalContent!: ElementRef;

  testimonials: Testimonial[] = [
    { 
      imageUrl: '../../../assets/images/testimonials/1.jpg', 
      studentName: 'Alice Johnson', 
      groupName: 'Web Development Group',
      altText: 'Testimonial screenshot from Alice Johnson in Web Development Group',
      quote: 'This course transformed my career. I now have the skills to build amazing websites!'
    },
    { 
      imageUrl: '../../../assets/images/testimonials/2.jpg', 
      studentName: 'Alice Johnson', 
      groupName: 'Web Development Group',
      altText: 'Testimonial screenshot from Alice Johnson in Web Development Group',
      quote: 'This course transformed my career. I now have the skills to build amazing websites!'
    },
    { 
      imageUrl: '../../../assets/images/testimonials/3.jpg', 
      studentName: 'Alice Johnson', 
      groupName: 'Web Development Group',
      altText: 'Testimonial screenshot from Alice Johnson in Web Development Group',
      quote: 'This course transformed my career. I now have the skills to build amazing websites!'
    },
    { 
      imageUrl: '../../../assets/images/testimonials/4.jpg', 
      studentName: 'Alice Johnson', 
      groupName: 'Web Development Group',
      altText: 'Testimonial screenshot from Alice Johnson in Web Development Group',
      quote: 'This course transformed my career. I now have the skills to build amazing websites!'
    },
    { 
      imageUrl: '../../../assets/images/testimonials/5.jpg', 
      studentName: 'Alice Johnson', 
      groupName: 'Web Development Group',
      altText: 'Testimonial screenshot from Alice Johnson in Web Development Group',
      quote: 'This course transformed my career. I now have the skills to build amazing websites!'
    },
    { 
      imageUrl: '../../../assets/images/testimonials/6.jpg', 
      studentName: 'Alice Johnson', 
      groupName: 'Web Development Group',
      altText: 'Testimonial screenshot from Alice Johnson in Web Development Group',
      quote: 'This course transformed my career. I now have the skills to build amazing websites!'
    },
    { 
      imageUrl: '../../../assets/images/testimonials/7.jpg', 
      studentName: 'Alice Johnson', 
      groupName: 'Web Development Group',
      altText: 'Testimonial screenshot from Alice Johnson in Web Development Group',
      quote: 'This course transformed my career. I now have the skills to build amazing websites!'
    },
    { 
      imageUrl: '../../../assets/images/testimonials/8.jpg', 
      studentName: 'Alice Johnson', 
      groupName: 'Web Development Group',
      altText: 'Testimonial screenshot from Alice Johnson in Web Development Group',
      quote: 'This course transformed my career. I now have the skills to build amazing websites!'
    },
    { 
      imageUrl: '../../../assets/images/testimonials/9.jpg', 
      studentName: 'Alice Johnson', 
      groupName: 'Web Development Group',
      altText: 'Testimonial screenshot from Alice Johnson in Web Development Group',
      quote: 'This course transformed my career. I now have the skills to build amazing websites!'
    },
    
  ];

  currentIndex = 0;
  modalOpen = false;
  modalIndex = 0;
  zoom = 1;
  panX = 0;
  panY = 0;
  isPanning = false;
  lastX = 0;
  lastY = 0;
  touchStartX = 0;



  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prevSlide() {
    this.currentIndex = this.currentIndex === 0 ? this.testimonials.length - 1 : this.currentIndex - 1;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  openModal(index: number) {
    this.modalIndex = index;
    this.modalOpen = true;
    this.resetZoom();
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modalOpen = false;
    document.body.style.overflow = 'auto';
  }

  nextModalSlide() {
    this.modalIndex = (this.modalIndex + 1) % this.testimonials.length;
    this.resetZoom();
  }

  prevModalSlide() {
    this.modalIndex = this.modalIndex === 0 ? this.testimonials.length - 1 : this.modalIndex - 1;
    this.resetZoom();
  }

  adjustZoom(delta: number) {
    this.zoom = Math.max(1, Math.min(3, this.zoom + delta));
  }

  resetZoom() {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
  }

  startPan(event: MouseEvent) {
    this.isPanning = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  pan(event: MouseEvent) {
    if (!this.isPanning) return;
    
    const deltaX = event.clientX - this.lastX;
    const deltaY = event.clientY - this.lastY;
    
    this.panX += deltaX;
    this.panY += deltaY;
    
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  endPan() {
    this.isPanning = false;
  }

  // Touch events for swipe functionality
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent) {
    event.preventDefault();
  }

  onTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchEndX - this.touchStartX;
    
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        this.prevSlide();
      } else {
        this.nextSlide();
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.modalOpen) {
      switch(event.key) {
        case 'Escape':
          this.closeModal();
          break;
        case 'ArrowLeft':
          this.prevModalSlide();
          break;
        case 'ArrowRight':
          this.nextModalSlide();
          break;
      }
    }
  }

  // New method for handling touch events in the modal
  onModalTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  onModalTouchMove(event: TouchEvent) {
    event.preventDefault();
  }

  onModalTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchEndX - this.touchStartX;
    
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        this.prevModalSlide();
      } else {
        this.nextModalSlide();
      }
    }
  }

  // Method to handle wheel events for zooming
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.modalOpen) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      this.adjustZoom(delta);
    }
  }

  // Method to update current slide index when modal is closed
  updateCurrentIndexOnModalClose() {
    this.currentIndex = this.modalIndex;
  }

  // Method to handle double click for quick zoom reset
  onDoubleClick() {
    if (this.modalOpen) {
      this.resetZoom();
    }
  }

  // Method to check if it's the first slide
  isFirstSlide(): boolean {
    return this.currentIndex === 0;
  }

  // Method to check if it's the last slide
  isLastSlide(): boolean {
    return this.currentIndex === this.testimonials.length - 1;
  }

  // Method to get the total number of slides
  getTotalSlides(): number {
    return this.testimonials.length;
  }

  // Method to get current slide number (1-based index)
  getCurrentSlideNumber(): number {
    return this.currentIndex + 1;
  }
}
