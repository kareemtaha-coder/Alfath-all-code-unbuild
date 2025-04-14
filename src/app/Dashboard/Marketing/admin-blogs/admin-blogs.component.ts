import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BlogService } from '../../../Services/blog.service';
import { DomSanitizer } from '@angular/platform-browser';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { urlValidator } from './validators';

interface AutoSaveData {
  timestamp: number;
  data: any;
}

@Component({
  selector: 'app-admin-blogs',
  templateUrl: './admin-blogs.component.html',
  styleUrls: ['./admin-blogs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminBlogsComponent implements OnInit, OnDestroy {
  blogForm!: FormGroup;
  previewMode = false;
  imagePreview: string | null = null;
  uploadProgress = 0;
  blogs: any[] = [];
  selectedBlogId: string | null = null;
  isLoading = false;
  characterCounts = {
    title: 0,
    content: 0,
    writtenBy: 0
  };
  private autoSaveSubscription?: Subscription;
  categories = ['Islamic', 'Quran', 'Arabic', 'Al-Fath', 'Other'];
  notification: { message: string; type: string } | null = null;
  readonly imageUrl: string = 'https://al-fath.runasp.net/images/';


  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link']
    ]
  };

  constructor(
    private blogService: BlogService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupAutoSave();
    this.loadDraft();
    this.loadBlogs();
  }

  ngOnDestroy(): void {
    this.autoSaveSubscription?.unsubscribe();
  }

  private initializeForm(): void {
    this.blogForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(100)
      ]),
      content: new FormControl('', [
        Validators.required,
        Validators.minLength(100)
      ]),
      image: new FormControl(null, Validators.required),
      videoUrl: new FormControl('', [urlValidator]),
      language: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      tags: new FormControl([]),
      brandName: new FormControl('Al-Fath'),
      writtenBy: new FormControl('', [
        Validators.maxLength(50)
      ])

    });

    // Character count updates
    this.blogForm.get('title')?.valueChanges.subscribe(value => {
      this.characterCounts.title = value?.length || 0;
    });

    this.blogForm.get('content')?.valueChanges.subscribe(value => {
      this.characterCounts.content = value?.length || 0;
    });
    this.blogForm.get('writtenBy')?.valueChanges.subscribe(value => {
      this.characterCounts.writtenBy = value?.length || 0;
    });
  }

  private setupAutoSave(): void {
    this.autoSaveSubscription = this.blogForm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(() => {
      this.saveFormDraft();
    });
  }

  private saveFormDraft(): void {
    const draftData: AutoSaveData = {
      timestamp: Date.now(),
      data: this.blogForm.value
    };
    localStorage.setItem('blogDraft', JSON.stringify(draftData));
  }

  private loadDraft(): void {
    const savedDraft = localStorage.getItem('blogDraft');
    if (savedDraft) {
      const draftData: AutoSaveData = JSON.parse(savedDraft);
      if (Date.now() - draftData.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
        this.blogForm.patchValue(draftData.data);
      }
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.blogForm.patchValue({ image: file });

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Simulate upload progress
      this.simulateUploadProgress();
    }
  }

  private simulateUploadProgress(): void {
    this.uploadProgress = 0;
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  }

  togglePreview(): void {
    this.previewMode = !this.previewMode;
  }

  clearForm(): void {
    if (confirm('Are you sure you want to clear all fields?')) {
      this.blogForm.reset();
      this.imagePreview = null;
      localStorage.removeItem('blogDraft');
    }
  }

  loadBlogs(): void {
    this.isLoading = true;
    this.blogService.GetBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.isLoading = false;
      },
      error: (error) => {
        this.showNotification('Error loading blogs', 'error');
        this.isLoading = false;
      }
    });
  }

  editBlog(blogId: string): void {
    this.isLoading = true;
    this.selectedBlogId = blogId;

    this.blogService.GetBlog(blogId).subscribe({
      next: (blog) => {
        this.blogForm.patchValue({
          title: blog.title,
          content: blog.content,
          videoUrl: blog.videoUrl,
          language: blog.language,
          category: blog.category,
          tags: blog.tags,
          brandName: blog.brandName
        });
        this.imagePreview = blog.imageName;
        this.isLoading = false;
      },
      error: (error) => {
        this.showNotification('Error loading blog for editing', 'error');
        this.isLoading = false;
      }
    });
  }

  deleteBlog(blogId: string): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.isLoading = true;
      this.blogService.deleteBlog(blogId).subscribe({
        next: () => {
          this.loadBlogs();
          this.showNotification('Blog deleted successfully', 'success');
          this.isLoading = false;
        },
        error: (error) => {
          this.showNotification('Error deleting blog', 'error');
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.blogForm.valid) {
      this.isLoading = true;
      const formData = new FormData();
      Object.keys(this.blogForm.value).forEach(key => {
        if (key === 'image' && this.blogForm.get(key)?.value) {
          formData.append(key, this.blogForm.get(key)?.value);
        } else {
          formData.append(key, this.blogForm.get(key)?.value);
        }
      });

      const request = this.selectedBlogId
        ? this.blogService.updateBlog(this.selectedBlogId, formData)
        : this.blogService.addBlog(formData);

      request.subscribe({
        next: (response) => {
          this.showNotification(
            `Blog ${this.selectedBlogId ? 'updated' : 'added'} successfully`,
            'success'
          );
          this.resetForm();
          this.loadBlogs();
          this.isLoading = false;
          console.log(response)
        },
        error: (error) => {
          this.showNotification(`Error ${this.selectedBlogId ? 'updating' : 'adding'} blog`, 'error');
          this.isLoading = false;
        }
      });
    }
  }

   resetForm(): void {

    this.blogForm.reset();
    this.selectedBlogId = null;
    this.imagePreview = null;
  }

   showNotification(message: string, type: 'success' | 'error'): void {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }


   markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
