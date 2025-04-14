import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContactFormService } from '../../../Services/contact-form.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrl: './contact-modal.component.scss'
})
export class ContactModalComponent implements OnInit {
  contactForm!: FormGroup;
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  allowedCountries: CountryISO[] = [];
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  notification: { message: string; type: string } | null = null;

  constructor(private _ContactFormService: ContactFormService) {}

  ngOnInit(): void {
    this.initForm();
    this.filterCountries();
  }

  initForm(): void {
    this.contactForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      country: new FormControl('', [Validators.required, Validators.minLength(2)]),
      phone: new FormControl('', [Validators.required]),
      numberOfChildren: new FormControl(null, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]),
      planChoice: new FormControl('Not-Now'),
      course: new FormControl('', Validators.required),
      city: new FormControl('', [Validators.required, Validators.minLength(2)]),
      brandName: new FormControl('Al-Fath')
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const dataToSend = {
        name: this.contactForm.value.name,
        country: this.contactForm.value.country,
        phone: this.contactForm.value.phone.internationalNumber,
        numberOfChildren: this.contactForm.value.numberOfChildren,
        planChoice: "Not-Now",
        course: this.contactForm.value.course,
        city: this.contactForm.value.city,
        brandName: "Al-Fath"
      };
      
      this._ContactFormService.contact(dataToSend).subscribe({
        next: (res) => {
          console.log(res);
          this.showNotification('Contact successful!', 'success');
          this.contactForm.reset();
        },
        error: (err) => {
          this.showNotification('Contact failed. Please try again.', 'error');
          if (err.error && err.error.errors && err.error.errors[0]) {
            this.showNotification(err.error.errors[0].description, 'error');
          }
        }
      });
    } else {
      this.markFormGroupTouched(this.contactForm);
      this.showNotification('Please fill in all required fields correctly.', 'error');
    }
  }

  filterCountries() {
    const allCountries = Object.values(CountryISO);
    const excludedCountries = [CountryISO.Israel];
    this.allowedCountries = allCountries.filter(
      country => !excludedCountries.includes(country)
    );
  }

  showNotification(message: string, type: string) {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.contactForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) return `${controlName} is required.`;
      if (control.errors['minlength']) return `${controlName} must be at least ${control.errors['minlength'].requiredLength} characters long.`;
      if (control.errors['min']) return `${controlName} must be at least ${control.errors['min'].min}.`;
      if (control.errors['pattern']) return `${controlName} must be a valid number.`;
    }
    return '';
  }
}