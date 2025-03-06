import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-sessions-section',
  templateUrl: './sessions-section.component.html',
  styleUrl: './sessions-section.component.scss'
})
export class SessionsSectionComponent {
  videos = [
    { title: 'Video 1 Title', url: 'https://www.youtube.com/embed/aTBWYn3M0P0' },
    { title: 'Video 2 Title', url: 'https://www.youtube.com/embed/py_Xgmv8mtM' },
    { title: 'Video 3 Title', url: 'https://www.youtube.com/embed/ZmQ2TcRbb2w' },
    { title: 'Video 1 Title', url: 'https://www.youtube.com/embed/3Z4At1GEyHA' },
    { title: 'Video 2 Title', url: 'https://www.youtube.com/embed/yfNvpJEZVDI' },
    { title: 'Video 3 Title', url: 'https://www.youtube.com/embed/JeEiHh67fZM' },
    { title: 'Video 1 Title', url: 'https://www.youtube.com/embed/i7hLzM9z1F0' },
    { title: 'Video 2 Title', url: 'https://www.youtube.com/embed/5-nCmfe1Shg' },
    { title: 'Video 3 Title', url: 'https://www.youtube.com/embed/parRADitnRc' },
    { title: 'Video 1 Title', url: 'https://www.youtube.com/embed/r0VSpnnuZDc' },

    // Add more videos as needed
  ];

  currentVideo: string;

  constructor(private sanitizer: DomSanitizer) {
    this.currentVideo = this.videos[0].url;
  }

  changeVideo(url: string) {
    this.currentVideo = url;
  }

  sanitizedVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}