import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlogService } from '../../Services/blog.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit , OnDestroy {
  imageUrl: string = 'https://localhost:7107/images/';
  private blogsSubscription: Subscription = new Subscription;

  blog: any;
  blogs: any[] = [];
  blogId: string | null = null;
  videoUrl: string | null = null;
  safeVideoUrl: SafeHtml | null = null;

  constructor(
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next:(params) => {
      this.blogId = params.get('id');
      if (this.blogId) {
        this.getBlog();
      } else {
        console.error('No blog ID provided in route');
      }
    }});
  }

  getBlog(): void {
    if (!this.blogId) return;

    this.blogsSubscription = this.blogService.GetBlog(this.blogId).subscribe({
      next: (res) => {
        this.blog = res;
        this.videoUrl = res.videoUrl;
        if (this.videoUrl) {
          this.safeVideoUrl = this.sanitizer.bypassSecurityTrustHtml(this.getEmbedUrl(this.videoUrl));
        } else {
          console.error('No video URL provided in the blog data');
        }
        console.log('Blog data:', res);
      },
      error: (err) => {
        console.error('Error fetching blog:', err);
      }
    });
  }

  getEmbedUrl(url: string): string {
    let videoId: string | undefined;

    try {
      // Handle different YouTube URL formats
      if (url.includes('youtube.com/watch?v=')) {
        videoId = new URL(url).searchParams.get('v') || undefined;
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1];
      }

      if (!videoId) {
        throw new Error('Could not extract video ID from URL');
      }

      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return `<iframe src="${embedUrl}" frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100% !important; height: 100% !important; border: 0;"></iframe>`;
    } catch (error) {
      console.error('Error processing video URL:', error);
      return '';
    }
  }
  ngOnDestroy() {
    if (this.blogsSubscription) {
      this.blogsSubscription.unsubscribe();
    }
  }
}