import { CertificateService } from '../../Services/certificate.service';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

interface AutoSaveData {
  timestamp: number;
  data: any;
}

@Component({
  selector: 'app-admin-certificates',
  templateUrl: './admin-certificates.component.html',
  styleUrl: './admin-certificates.component.scss'
})
export class AdminCertificatesComponent implements OnInit, OnDestroy {
  CertificateForm!: FormGroup;
  uploadProgress = 0;
  readonly imageUrl: string = 'https://al-fath.runasp.net/images/';
  Certificates: any[] = [];
  selectedCertificateId: string | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  characterCounts = {
    title: 0,
    content: 0,
  };
  private autoSaveSubscription?: Subscription;

  notification: { message: string; type: string } | null = null;

  constructor(
    private CertificateService: CertificateService,
  ) {}



  ngOnInit(): void {
    this.initializeForm();
    this.setupAutoSave();
    this.loadDraft();
    this.loadCertificates();
  }

  ngOnDestroy(): void {
    this.autoSaveSubscription?.unsubscribe();
  }



  private initializeForm(): void {
    this.CertificateForm = new FormGroup({
      title: new FormControl('', [Validators.maxLength(100)]),
      content: new FormControl(''),
      image: new FormControl(null, Validators.required),
    });

      // Character count updates
      this.CertificateForm.get('title')?.valueChanges.subscribe(value => {
        this.characterCounts.title = value?.length || 0;
      });
  
      this.CertificateForm.get('content')?.valueChanges.subscribe(value => {
        this.characterCounts.content = value?.length || 0;
      });
}



  private setupAutoSave(): void {
    this.autoSaveSubscription = this.CertificateForm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(() => {
      this.saveFormDraft();
    });
  }




  private saveFormDraft(): void {
    const draftData: AutoSaveData = {
      timestamp: Date.now(),
      data: this.CertificateForm.value
    };
    localStorage.setItem('CertificateDraft', JSON.stringify(draftData));
  }

  private loadDraft(): void {
    const savedDraft = localStorage.getItem('CertificateDraft');
    if (savedDraft) {
      const draftData: AutoSaveData = JSON.parse(savedDraft);
      if (Date.now() - draftData.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
        this.CertificateForm.patchValue(draftData.data);
      }
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.CertificateForm.patchValue({ image: file });
      
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
      this.CertificateForm.reset();
      this.imagePreview = null;
      localStorage.removeItem('CertificateDraft');
    }
  }



  loadCertificates(): void {
    this.isLoading = true;
    this.CertificateService.GetCertificates().subscribe({
      next: (Certificate) => {
        this.Certificates = Certificate;
        this.isLoading = false;
        console.log(Certificate)

      },
      error: (error) => {
        this.showNotification('Error loading Certificates', 'error');
        this.isLoading = false;
      }
    });
  }

  editCertificates(CertificateId: string): void {
    this.isLoading = true;
    this.selectedCertificateId = CertificateId;
    
    this.CertificateService.GetCertificate(CertificateId).subscribe({
      next: (Certificate) => {
        this.CertificateForm.patchValue({
          title: Certificate.title,
          content: Certificate.content,
        });
        this.imagePreview = Certificate.imageName;
        this.isLoading = false;
      },
      error: (error) => {
        this.showNotification('Error loading Certificate for editing', 'error');
        this.isLoading = false;
      }
    });
  }

  deleteCertificate(CertificateId: string): void {
    if (confirm('Are you sure you want to delete this CertificateId?')) {
      this.isLoading = true;
      this.CertificateService.deleteCertificate(CertificateId).subscribe({
        next: () => {
          this.loadCertificates();
          this.showNotification('Certificate deleted successfully', 'success');
          this.isLoading = false;
        },
        error: (error) => {
          this.showNotification('Error deleting Certificate', 'error');
          this.isLoading = false;
        }
      });
    }
  }


  onSubmit(): void {
    if (this.CertificateForm.valid) {
      this.isLoading = true;
      const formData = new FormData();
      Object.keys(this.CertificateForm.value).forEach(key => {
        if (key === 'image' && this.CertificateForm.get(key)?.value) {
          formData.append(key, this.CertificateForm.get(key)?.value);
        } else {
          formData.append(key, this.CertificateForm.get(key)?.value);
        }
      });

      const request = this.selectedCertificateId
        ? this.CertificateService.updateCertificate(this.selectedCertificateId, formData)
        : this.CertificateService.addCertificate(formData);

      request.subscribe({
        next: (response) => {
          this.showNotification(
            `Certificate ${this.selectedCertificateId ? 'updated' : 'added'} successfully`,
            'success'
          );
          this.resetForm();
          this.loadCertificates();
          this.isLoading = false;
          console.log(response)
        },
        error: (error) => {
          this.showNotification(`Error ${this.selectedCertificateId ? 'updating' : 'adding'} blog`, 'error');
          this.isLoading = false;
        }
      });
    }
  }

   resetForm(): void {
    
    this.CertificateForm.reset();
    this.selectedCertificateId = null;
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
