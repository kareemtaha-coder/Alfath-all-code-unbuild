import { Component ,OnDestroy,OnInit } from '@angular/core';
import { BlogService } from '../../Services/blog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-section',
  templateUrl: './blog-section.component.html',
  styleUrl: './blog-section.component.scss'
})
export class BlogSectionComponent implements OnInit , OnDestroy{
  blogs: any[] = [];
  imagUrl:string = 'https://localhost:7107/images/'
  private blogsSubscription: Subscription = new Subscription;



  constructor(private blogService: BlogService) {
  }
  ngOnInit(): void {
    this.getBlogs();

  }
  

  getBlogs(){
    this.blogsSubscription = this.blogService.GetBlogs().subscribe({
        next:(data: any[])=> {
          this.blogs = data.slice(0,3); // The rest of the blogs
          console.log("success"+this.blogs)
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

  ngOnDestroy() {
    if (this.blogsSubscription) {
      this.blogsSubscription.unsubscribe();
    }
  }
}
