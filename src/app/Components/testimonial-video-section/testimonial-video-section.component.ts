import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonial-video-section',
  templateUrl: './testimonial-video-section.component.html',
  styleUrls: ['../courses-section/courses-section.component.scss','./testimonial-video-section.component.scss']
})
export class TestimonialVideoSectionComponent {
  stopCurrentVideo() {
    const iframe = document.querySelector('.carousel-item.active iframe') as HTMLIFrameElement;
    const iframeSrc = iframe.src;
    if (iframe) {
      iframe.src = iframeSrc; // Temporarily clear src to stop the video
      setTimeout(() => iframe.src = iframeSrc, 0); // Restore src to keep iframe in DOM
    }
  }

}
