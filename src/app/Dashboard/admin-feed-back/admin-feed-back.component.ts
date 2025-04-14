import { FeedBackService } from './../../Services/feed-back.service';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

interface AutoSaveData {
  timestamp: number;
  data: any;
}
@Component({
  selector: 'app-admin-feed-back',
  templateUrl: './admin-feed-back.component.html',
  styleUrls: ['./admin-feed-back.component.scss']
})
export class AdminFeedBackComponent implements OnInit, OnDestroy {
  FeedBackForm!: FormGroup;
  uploadProgress = 0;
  feedBacks: any[] = [];
  selectedFeedBackId: string | null = null;
  imagePreview: string | null = null;
  readonly imageUrl: string = 'https://al-fath.runasp.net/images/';

  isLoading = false;
  characterCounts = {
    title: 0,
    content: 0,
  };
  private autoSaveSubscription?: Subscription;

  notification: { message: string; type: string } | null = null;

  constructor(
    private feedBackService: FeedBackService,
  ) {}



  ngOnInit(): void {
    this.initializeForm();
    this.setupAutoSave();
    this.loadDraft();
    this.loadFeedBacks();
  }

  ngOnDestroy(): void {
    this.autoSaveSubscription?.unsubscribe();
  }



  private initializeForm(): void {
    this.FeedBackForm = new FormGroup({
      title: new FormControl('', [Validators.maxLength(100)]),
      content: new FormControl(''),
      image: new FormControl(null, Validators.required),
    });

      // Character count updates
      this.FeedBackForm.get('title')?.valueChanges.subscribe(value => {
        this.characterCounts.title = value?.length || 0;
      });

      this.FeedBackForm.get('content')?.valueChanges.subscribe(value => {
        this.characterCounts.content = value?.length || 0;
      });
}



  private setupAutoSave(): void {
    this.autoSaveSubscription = this.FeedBackForm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(() => {
      this.saveFormDraft();
    });
  }




  private saveFormDraft(): void {
    const draftData: AutoSaveData = {
      timestamp: Date.now(),
      data: this.FeedBackForm.value
    };
    localStorage.setItem('FeedBackDraft', JSON.stringify(draftData));
  }

  private loadDraft(): void {
    const savedDraft = localStorage.getItem('FeedBackDraft');
    if (savedDraft) {
      const draftData: AutoSaveData = JSON.parse(savedDraft);
      if (Date.now() - draftData.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
        this.FeedBackForm.patchValue(draftData.data);
      }
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.FeedBackForm.patchValue({ image: file });

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


  clearForm(): void {
    if (confirm('Are you sure you want to clear all fields?')) {
      this.FeedBackForm.reset();
      this.imagePreview = null;
      localStorage.removeItem('FeedBackDraft');
    }
  }



  loadFeedBacks(): void {
    this.isLoading = true;
    this.feedBackService.GetFeedBacks().subscribe({
      next: (feedBack) => {
        this.feedBacks = feedBack;
        this.isLoading = false;
        console.log(feedBack);
      },
      error: (error) => {
        this.showNotification('Error loading Feedbacks', 'error');
        this.isLoading = false;
      }
    });
  }

  editFeedBacks(feedBackId: string): void {
    this.isLoading = true;
    this.selectedFeedBackId = feedBackId;

    this.feedBackService.GetFeedBack(feedBackId).subscribe({
      next: (feedBack) => {
        this.FeedBackForm.patchValue({
          title: feedBack.title,
          content: feedBack.content,
        });
        this.imagePreview = feedBack.imageName;
        this.isLoading = false;
      },
      error: (error) => {
        this.showNotification('Error loading FeedBack for editing', 'error');
        this.isLoading = false;
      }
    });
  }

  deleteFeedBack(FeedBackId: string): void {
    if (confirm('Are you sure you want to delete this FeedBackId?')) {
      this.isLoading = true;
      this.feedBackService.deleteFeedBack(FeedBackId).subscribe({
        next: () => {
          this.loadFeedBacks();
          this.showNotification('FeedBack deleted successfully', 'success');
          this.isLoading = false;
        },
        error: (error) => {
          this.showNotification('Error deleting FeedBack', 'error');
          this.isLoading = false;
        }
      });
    }
  }


  onSubmit(): void {
    if (this.FeedBackForm.valid) {
      this.isLoading = true;
      const formData = new FormData();
      Object.keys(this.FeedBackForm.value).forEach(key => {
        if (key === 'image' && this.FeedBackForm.get(key)?.value) {
          formData.append(key, this.FeedBackForm.get(key)?.value);
        } else {
          formData.append(key, this.FeedBackForm.get(key)?.value);
        }
      });

      const request = this.selectedFeedBackId
        ? this.feedBackService.updateFeedBack(this.selectedFeedBackId, formData)
        : this.feedBackService.addFeedBack(formData);

      request.subscribe({
        next: (response) => {
          this.showNotification(
            `FeedBack ${this.selectedFeedBackId ? 'updated' : 'added'} successfully`,
            'success'
          );
          this.resetForm();
          this.loadFeedBacks();
          this.isLoading = false;
          console.log(response)
        },
        error: (error) => {
          this.showNotification(`Error ${this.selectedFeedBackId ? 'updating' : 'adding'} blog`, 'error');
          this.isLoading = false;
        }
      });
    }
  }

   resetForm(): void {

    this.FeedBackForm.reset();
    this.selectedFeedBackId = null;
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
