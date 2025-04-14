// blog.component.ts
import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { BlogService } from '../../Services/blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml, Meta, Title } from '@angular/platform-browser';
import { Subscription, fromEvent, throttleTime, distinctUntilChanged, share } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

interface ShareConfig {
  url: string;
  title: string;
  description: string;
  image: string;
  hashtags?: string[];
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageName: string;
  videoUrl?: string;
  language: string;
  uploadedOn: Date;
  writtenBy: string;
  tags: string[];
  estimatedReadTime?: number;
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class BlogComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly imageUrl: string = 'https://al-fath.runasp.net/images/';
  private subscriptions: Subscription = new Subscription();
  
  blog: BlogPost | null = null;
  blogId: string | null = null;
  safeVideoUrl?: SafeHtml;
  tableOfContents: TableOfContentsItem[] = [];
  currentSection: string = '';
  isLoading: boolean = true;
  error: string | null = null;
  showBackToTop: boolean = false;
  readingProgress: number = 0;
  readingTime: number = 0;
  shareUrls = {
    facebook: '',
    twitter: '',
    linkedin: '',
    whatsapp: '',
    telegram: ''
  };
  private shareConfig: ShareConfig | null = null;
  private readonly isWebShareSupported = 'share' in navigator;
  isLinkCopied: boolean = false;
  
  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private meta: Meta,
    private title: Title,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscribeToRouteChanges();
  }

  ngAfterViewInit(): void {
    this.initIntersectionObserver();
  }

  private subscribeToRouteChanges(): void {
    const routeSub = this.route.paramMap.subscribe(params => {
      this.blogId = params.get('id');
      if (this.blogId) {
        this.getBlog();
        this.initScrollListener();
      } else {
        this.handleError('No blog ID provided');
      }
    });
    this.subscriptions.add(routeSub);
  }

  private initScrollListener(): void {
    const scroll$ = fromEvent(window, 'scroll').pipe(
      throttleTime(50),
      distinctUntilChanged(),
      share()
    );

    const scrollSub = scroll$.subscribe(() => {
      this.updateScrollIndicators();
      this.updateCurrentSection();
    });
    
    this.subscriptions.add(scrollSub);
  }

  private initIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);

    document.querySelectorAll('.blog-content > *').forEach(element => {
      observer.observe(element);
    });
  }

  private updateScrollIndicators(): void {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    this.showBackToTop = scrollTop > 300;
    this.readingProgress = (scrollTop / (documentHeight - windowHeight)) * 100;
    this.cdr.detectChanges();
  }

  private updateCurrentSection(): void {
    const sections = this.tableOfContents
      .map(item => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= 150) {
        this.currentSection = section.id;
        this.cdr.detectChanges();
        break;
      }
    }
  }

  

  private processContent(): void {
    if (!this.blog?.content) return;
    
    this.tableOfContents = this.generateTableOfContents();
    this.sanitizeAndEnhanceContent();
  }

  private sanitizeAndEnhanceContent(): void {
    if (!this.blog) return;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.blog.content, 'text/html');
    
    // Add syntax highlighting to code blocks
    doc.querySelectorAll('pre code').forEach(block => {
      block.classList.add('hljs');
    });
    
    // Add lazy loading to images
    doc.querySelectorAll('img').forEach(img => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });
    
    this.blog.content = doc.body.innerHTML;
  }

  private generateTableOfContents(): TableOfContentsItem[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.blog!.content, 'text/html');
    const headings = doc.querySelectorAll('h2, h3, h4');
    
    return Array.from(headings).map((heading, index) => {
      const id = `section-${index}`;
      heading.id = id;
      return {
        id,
        title: heading.textContent || '',
        level: parseInt(heading.tagName[1])
      };
    });
  }

  private calculateReadingTime(): number {
    if (!this.blog?.content) return 0;
    
    const wordsPerMinute = 200;
    const wordCount = this.blog.content
      .replace(/<[^>]*>/g, '')
      .trim()
      .split(/\s+/).length;
    
    return Math.ceil(wordCount / wordsPerMinute);
  }

 
  private generateShareConfig(): void {
    if (!this.blog) return;
  
    const baseUrl = window.location.origin;
    const articleUrl = `${baseUrl}/#/blog/${this.blogId}`;
    const imageUrl = `${this.imageUrl}${this.blog.imageName}`;
    
    // Get a clean description without HTML tags
    const description = this.blog.content
      .replace(/<[^>]*>/g, '')
      .slice(0, 160)
      .trim() + '...';
  
    this.shareConfig = {
      url: articleUrl,
      title: this.blog.title,
      description,
      image: imageUrl,
    };

    // Update meta tags for proper URL unfurling
    this.updateMetaTags();
  }

  
  private updateMetaTags(): void {
    if (!this.blog || !this.shareConfig) return;
    
    // Basic meta tags
    this.title.setTitle(this.blog.title);
    this.meta.updateTag({ name: 'description', content: this.shareConfig.description });
    
    // Open Graph tags for proper URL unfurling
    this.meta.updateTag({ property: 'og:title', content: this.shareConfig.title });
    this.meta.updateTag({ property: 'og:description', content: this.shareConfig.description });
    this.meta.updateTag({ property: 'og:image', content: this.shareConfig.image });
    this.meta.updateTag({ property: 'og:url', content: this.shareConfig.url });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    
    // WhatsApp specific meta tags
    this.meta.updateTag({ property: 'og:site_name', content: 'Your Site Name' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    
    // Telegram specific meta tags
    this.meta.updateTag({ name: 'telegram:channel', content: '@YourTelegramChannel' }); // If you have one
  }

  async share(platform: 'whatsapp' | 'telegram'): Promise<void> {
    if (!this.shareConfig) return;

    const { url, title, description, image } = this.shareConfig;
    
    // Create a formatted message with image preview
    let message = '';
    let shareUrl = '';

    try {
      // Try native sharing first on mobile devices
      if ('share' in navigator && /mobile/i.test(navigator.userAgent)) {
        await navigator.share({
          title,
          text: description,
          url
        });
        return;
      }
    } catch (error) {
      console.error('Native sharing failed:', error);
    }

    switch (platform) {
      case 'whatsapp':
        // Format message for WhatsApp
        message = `*${title}*\n\n${description}\n\n${url}`;
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        break;
        
      case 'telegram':
        // Format message for Telegram with HTML support
        message = `<b>${title}</b>\n\n${description}`;
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;
        break;
    }

    // Open share dialog in a centered popup window
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      shareUrl,
      `share_${platform}`,
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,resizable=yes,scrollbars=yes`
    );
  }

  copyLinkToClipboard(): void {
    if (!this.shareConfig) return;
    
    navigator.clipboard.writeText(this.shareConfig.url).then(() => {
      this.isLinkCopied = true;
      setTimeout(() => {
        this.isLinkCopied = false;
        this.cdr.detectChanges();
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });
  }

  // Update getBlog method to generate share config
  public getBlog(): void {
    if (!this.blogId) return;
    
    this.isLoading = true;
    this.error = null;

    const blogSub = this.blogService.GetBlog(this.blogId).subscribe({
      next: (response) => {
        this.blog = response;
        this.processContent();
        this.updateMetaTags();
        this.generateShareConfig(); // Generate share config after getting blog data
        this.readingTime = this.calculateReadingTime();
        
        if (this.blog?.videoUrl?.trim()) {
          this.safeVideoUrl = this.sanitizer.bypassSecurityTrustHtml(
            this.getEmbedUrl(this.blog.videoUrl)
          );
        }
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => this.handleError(error)
    });
    
    this.subscriptions.add(blogSub);
  }

 


  private getEmbedUrl(url: string): string {
    try {
      let videoId: string | undefined;
      
      if (url.includes('youtube.com/watch?v=')) {
        videoId = new URL(url).searchParams.get('v') || undefined;
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1];
      }
      
      if (!videoId) {
        throw new Error('Invalid video URL');
      }
      
      return `<iframe 
        src="https://www.youtube.com/embed/${videoId}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;">
      </iframe>`;
    } catch (error) {
      console.error('Error processing video URL:', error);
      return '';
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private handleError(error: any): void {
    console.error('Blog error:', error);
    this.error = 'Failed to load blog post. Please try again later.';
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}