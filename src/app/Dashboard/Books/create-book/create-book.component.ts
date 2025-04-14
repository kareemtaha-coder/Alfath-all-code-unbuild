import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../../../Services/book.service';

interface BookForm {
  Title: string;
  Description: string;
  Part?: string;
  Author: string;
  Reviewer: string;
  CoverImage: File | null;
  Pdf: File | null;
}

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrl: './create-book.component.scss'
})
export class CreateBookComponent implements OnInit {
  bookForm!: FormGroup;
  imageError: string = '';
  pdfError: string = '';
  coverImagePreview: string | null = null;

  // New properties for success/error messages
  isSubmitting: boolean = false;
  submissionSuccess: boolean = false;
  submissionError: string = '';
  activeTab: string = 'infoTab';

  constructor(private fb: FormBuilder, private _bookService: BookService) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.bookForm = this.fb.group({
      Title: new FormControl('', Validators.required),
      Description: new FormControl('', Validators.required),
      Part: new FormControl(''),
      Author: new FormControl('', Validators.required),
      Reviewer: new FormControl('', Validators.required),
      CoverImage: new FormControl(null, Validators.required),
      Pdf: new FormControl(null, Validators.required),
    });
  }

  onFileSelect(event: Event, controlName: string) {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    if (!file) return;
    this.validateFile(file, controlName);
  }

  validateFile(file: File, controlName: string) {
    if (controlName === 'CoverImage') {
      if (!file.type.startsWith('image/')) {
        this.imageError = 'Only image files (JPG, PNG, etc.) are allowed!';
        this.bookForm.get('CoverImage')?.setValue(null);
        return;
      }
      this.imageError = '';
      this.coverImagePreview = URL.createObjectURL(file);
    }
    if (controlName === 'Pdf') {
      if (file.type !== 'application/pdf') {
        this.pdfError = 'Only PDF files are allowed!';
        this.bookForm.get('Pdf')?.setValue(null);
        return;
      }
      this.pdfError = '';
    }
    this.bookForm.get(controlName)?.setValue(file);
  }

  onDrop(event: DragEvent, controlName: string) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0] || null;
    if (!file) return;
    this.validateFile(file, controlName);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      event.target.classList.add('drag-active');
    }
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      event.target.classList.remove('drag-active');
    }
  }

  switchTab(tabId: string) {
    this.activeTab = tabId;
  }

  resetForm() {
    this.initForm();
    this.coverImagePreview = null;
    this.imageError = '';
    this.pdfError = '';
    this.submissionSuccess = false;
    this.submissionError = '';
  }

  onSubmit() {
    if (this.bookForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookForm.controls).forEach(key => {
        this.bookForm.get(key)?.markAsTouched();
      });

      this.submissionError = 'Please fill all required fields correctly.';
      return;
    }

    this.isSubmitting = true;
    this.submissionError = '';

    const formData = new FormData();
    formData.append('Title', this.bookForm.value.Title);
    formData.append('Description', this.bookForm.value.Description);
    formData.append('Author', this.bookForm.value.Author);
    formData.append('Reviewer', this.bookForm.value.Reviewer);

    if (this.bookForm.value.Part) {
      formData.append('Part', this.bookForm.value.Part);
    }

    const coverImage = this.bookForm.value.CoverImage;
    const pdfFile = this.bookForm.value.Pdf;

    if (coverImage) {
      formData.append('CoverImage', coverImage);
    }

    if (pdfFile) {
      formData.append('Pdf', pdfFile);
    }

    this._bookService.addBook(formData).subscribe({
      next: (response) => {
        console.log(response);
        this.isSubmitting = false;
        this.submissionSuccess = true;

        // Auto-reset after 5 seconds of showing success message
        setTimeout(() => {
          if (this.submissionSuccess) {
            this.resetForm();
          }
        }, 5000);
      },
      error: (error) => {
        console.log(error);
        this.isSubmitting = false;
        this.submissionError = error.error?.errors?.[0] || 'An unexpected error occurred. Please try again.';
      }
    });
  }
}
