// blog-section.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlogService } from '../../Services/blog.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-blog-section',
  templateUrl: './blog-section.component.html',
  styleUrls: ['./blog-section.component.scss']
})
export class BlogSectionComponent implements OnInit, OnDestroy {
  blogs: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  readonly imageUrl: string = 'https://al-fath.runasp.net/images/';
  private destroy$ = new Subject<void>();

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.getBlogs();
  }

  getBlogs(): void {
    this.loading = true;
    this.blogService.GetBlogs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any[]) => {
          this.blogs = data.reverse().slice(0, 3);
          this.loading = false;
          console.log(data)
        },
        error: (error) => {
          console.error('Error fetching blogs', error);
          this.error = 'Failed to load blog posts. Please try again later.';
          this.loading = false;
        }
      });
  }

  getFirstTwoStrongOrWords(content: string): string {
    // Regular expression to match <strong> tags
    const strongRegex = /<strong>(.*?)<\/strong>/g;
    const matches = content.match(strongRegex);
  
    if (matches && matches.length > 0) {
      // If strong tags are found, return content of first two (or one if only one exists)
      const firstTwo = matches.slice(0, 2);
      return firstTwo.map(match => match.replace(/<\/?strong>/g, '')).join(' ');
    } else {
      // If no strong tags, get first 10 words
      return content.replace(/<[^>]*>/g, '') // Remove all HTML tags
                    .split(/\s+/)            // Split into words
                    .slice(0, 10)            // Take first 10 words
                    .join(' ');              // Join back into a string
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

