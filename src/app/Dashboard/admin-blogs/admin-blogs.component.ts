import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BlogService } from '../../Services/blog.service';
import Quill from 'quill';
@Component({
  selector: 'app-admin-blogs',
  templateUrl: './admin-blogs.component.html',
  styleUrl: './admin-blogs.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AdminBlogsComponent implements OnInit {
  blogForm!: FormGroup;
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
      ['link'],
    ]
  };


  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.blogForm = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      image: new FormControl(null, Validators.required),
      videoUrl: new FormControl(''),
      language: new FormControl('Arabic'),
      category: new FormControl('', Validators.required),
      brandName: new FormControl('Al-Fath')
    });
  }
  onSubmit(): void {
    if (this.blogForm.valid) {
      const formData = new FormData();
      formData.append('title', this.blogForm.get('title')?.value);
      formData.append('content', this.blogForm.get('content')?.value); // This will contain HTML
      formData.append('image', this.blogForm.get('image')?.value);
      formData.append('videoUrl', this.blogForm.get('videoUrl')?.value);
      formData.append('language', this.blogForm.get('language')?.value);
      formData.append('category', this.blogForm.get('category')?.value);
      formData.append('brandName', this.blogForm.get('brandName')?.value);

      this.blogService.addBlog(formData).subscribe(
        response => {
          console.log('Blog added successfully', response);
        },
        error => {
          console.error('Error adding blog', error);
        }
      );
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.blogForm.patchValue({
        image: file
      });
    }
  }



}