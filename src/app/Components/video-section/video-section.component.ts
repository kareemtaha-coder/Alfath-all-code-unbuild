import { Component, OnInit } from '@angular/core';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterService } from '../../Services/register.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-video-section',
  templateUrl: './video-section.component.html',
  styleUrls: ['./video-section.component.scss'], // Fixed styleUrls spelling
})
export class VideoSectionComponent implements OnInit {
  RegisterForm!: FormGroup;
  isSubmitting = false;
  isLoading: boolean = false;
  
  constructor(
    private _RegisterService: RegisterService,
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    this.filterCountries();
    this.initVideoModal();
  }

  initForm() {
    this.RegisterForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      phoneNumber: new FormControl('', [Validators.required]),
      password: new FormControl('P@ssword123', [Validators.required, Validators.minLength(8)]),
    });
  }

  onSubmit(): void {
    if (this.RegisterForm.invalid) {
      this.showNotification('Please fill in all required fields correctly.', 'error');
      return;
    }

    this.isLoading = true;
    const dataToSend = {
      firstName: this.RegisterForm.value.firstName,
      lastName: this.RegisterForm.value.lastName,
      phoneNumber: this.RegisterForm.value.phoneNumber.internationalNumber,
      password: 'P@ssword123',
    };

    this._RegisterService.Register(dataToSend).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showNotification('Registration successful!', 'success');        
        this.RegisterForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification('Registration failed. Please try again.', 'error');
        console.error('Error:', err);
      },
    });
  }


  CountryISO = CountryISO;
  allowedCountries: CountryISO[] = [];
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Egypt, CountryISO.Palestine];

  filterCountries() {
    const allCountries = Object.values(CountryISO);
    const excludedCountries = [CountryISO.Israel];
    this.allowedCountries = allCountries.filter(
      (country) => !excludedCountries.includes(country)
    );
  }


  initVideoModal() {
    const videoUrl = 'https://www.youtube.com/embed/wDcb7O8hk-g?si=56c55-u6UIdIBCYE';
    const videoModal = document.getElementById('videoModal');
    const videoIframe = document.getElementById('videoIframe') as HTMLIFrameElement | null;
    if (videoModal && videoIframe) {
      videoModal.addEventListener('show.bs.modal', () => {
        videoIframe.src = videoUrl;
      });

      videoModal.addEventListener('hide.bs.modal', () => {
        videoIframe.src = '';
      });
    }
  }


  notification: { message: string; type: string } | null = null; // State for notifications
   // Function to display notifications
   showNotification(message: string, type: string) {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification = null; // Hide the notification after 3 seconds
    }, 3000);
  }

}