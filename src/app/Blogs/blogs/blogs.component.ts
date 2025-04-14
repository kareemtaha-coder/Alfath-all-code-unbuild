import { Component,OnDestroy,OnInit } from '@angular/core';
import { BlogService } from '../../Services/blog.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent implements OnInit , OnDestroy {
  blogs: any[] = [];
  featuredBlog: any;
  imagUrl:string = 'https://al-fath.runasp.net/images/';
  private blogsSubscription:Subscription = new Subscription;

  constructor(private blogService: BlogService) {
  }
  ngOnInit(): void {
    this.getBlogs();
  }

  loading: boolean = true;


getBlogs() {
  this.loading = true;
  this.blogsSubscription = this.blogService.GetBlogs().subscribe({
    next: (data: any[]) => {
      this.blogs = data.reverse();
      this.loading = false;
    },
    error: (error) => {
      console.error('Error fetching blogs', error);
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
  if (this.blogsSubscription) {
    this.blogsSubscription.unsubscribe();
  }
 }
 
}
