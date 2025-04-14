import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface Video {
  id: number;
  youtubeId: string;
  titleKey: string;
  descriptionKey: string;
  safeUrl?: SafeResourceUrl;
}

interface Feature {
  id: number;
  titleKey: string;
  descriptionKey: string;
  iconUrl: string;
  isExpanded: boolean;
  isHovered: boolean;
}

@Component({
  selector: 'app-features-section',
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '72px',
        backgroundColor: '#ffffff'
      })),
      state('expanded', style({
        backgroundColor: '#f8f9fa'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ]),
    trigger('contentExpand', [
      state('collapsed', style({
        height: '0',
        opacity: '0'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ]),
    trigger('cardHover', [
      state('normal', style({
        transform: 'translateY(0)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      })),
      state('hovered', style({
        transform: 'translateY(-10px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      })),
      transition('normal <=> hovered', [
        animate('200ms ease-out')
      ])
    ])
  ]
})
export class FeaturesSectionComponent implements OnInit {
  currentVideoIndex = 0;
  isLoading = true;
  mainFeatureHover = 'normal';

  videos: Video[] = [
    {
      id: 1,
      youtubeId: 'xapMoJdBAXo',
      titleKey: 'feature.videos.titles.video1',
      descriptionKey: 'feature.videos.descriptions.video1'
    },
    {
      id: 2,
      youtubeId: 'qzLvRfgAxNc',
      titleKey: 'feature.videos.titles.video2',
      descriptionKey: 'feature.videos.descriptions.video2'
    },
    {
      id: 3,
      youtubeId: '5eVJBK7azs8',
      titleKey: 'feature.videos.titles.video3',
      descriptionKey: 'feature.videos.descriptions.video3'
    }
  ];

  mainFeature = {
    descriptionKey: 'feature.mainFeature.description',
    iconUrl: '../../../assets/images/icon.png',
  };

  features: Feature[] = [
    {
      id: 0,
      titleKey: 'feature.featuresList.feature0.title',
      descriptionKey: 'feature.featuresList.feature0.description',
      iconUrl: '../../../assets/images/icon.png',
      isExpanded: false,
      isHovered: false
    },
    {
      id: 1,
      titleKey: 'feature.featuresList.feature1.title',
      descriptionKey: 'feature.featuresList.feature1.description',
      iconUrl: '../../../assets/images/icon.png',
      isExpanded: false,
      isHovered: false
    },
    {
      id: 2,
      titleKey: 'feature.featuresList.feature2.title',
      descriptionKey: 'feature.featuresList.feature2.description',
      iconUrl: '../../../assets/images/icon.png',
      isExpanded: false,
      isHovered: false
    },
    {
      id: 3,
      titleKey: 'feature.featuresList.feature3.title',
      descriptionKey: 'feature.featuresList.feature3.description',
      iconUrl: '../../../assets/images/icon.png',
      isExpanded: false,
      isHovered: false
    }
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.initializeVideos();
  }

  private initializeVideos() {
    this.videos = this.videos.map(video => ({
      ...video,
      safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${video.youtubeId}?controls=1&rel=0`
      )
    }));
  }

  onVideoLoad() {
    this.isLoading = false;
  }

  setVideo(index: number) {
    if (this.currentVideoIndex !== index) {
      this.isLoading = true;
      this.currentVideoIndex = index;
    }
  }

  nextVideo() {
    this.setVideo((this.currentVideoIndex + 1) % this.videos.length);
  }

  previousVideo() {
    this.setVideo((this.currentVideoIndex - 1 + this.videos.length) % this.videos.length);
  }

  toggleFeature(feature: Feature) {
    this.features.forEach(f => {
      if (f.id !== feature.id) {
        f.isExpanded = false;
      }
    });
    feature.isExpanded = !feature.isExpanded;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.mainFeatureHover = 'hovered';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.mainFeatureHover = 'normal';
  }

  // Helper method to change language
  switchLanguage(lang: string) {
    this.translateService.use(lang);
  }
}