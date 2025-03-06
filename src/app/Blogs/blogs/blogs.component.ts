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
  imagUrl:string = 'https://localhost:7107/images/';
  private blogsSubscription:Subscription = new Subscription;

  constructor(private blogService: BlogService) {
  }
  ngOnInit(): void {
    this.getBlogs();
  }

  getBlogs(){
    this.blogsSubscription = this.blogService.GetBlogs().subscribe({
      next:(data: any[]) => {
        // this.featuredBlog = data[0]; // Assuming the latest blog is the first in the array
        this.blogs = data; // The rest of the blogs
        console.log(this.blogs)
      },
      error:(error) => {
        console.error('Error fetching blogs', error);
      }
    }
    );
  }

  getFirstWords(content: string, wordCount: number): string {
    return content.split(' ').slice(0, wordCount).join(' ');
  }
 ngOnDestroy(): void {
  if (this.blogsSubscription) {
    this.blogsSubscription.unsubscribe();
  }
 }
}
