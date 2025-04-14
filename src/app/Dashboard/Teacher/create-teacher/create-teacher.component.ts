import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import { TeacherService } from '../../../Services/teacher.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';

@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.component.html',
  styleUrl: './create-teacher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTeacherComponent implements OnInit {
  teacherForm!: FormGroup;
  isSubmitting = false;
  formErrors: { [key: string]: string } = {};
  successMessage = '';
  showSuccessAlert = false;

  // Phone configuration
  readonly CountryISO = CountryISO;
  readonly SearchCountryField = SearchCountryField;
  readonly PhoneNumberFormat = PhoneNumberFormat;
  allowedCountries: CountryISO[] = [];
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  // Quiz options
  availableQuizzes: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.filterCountries();

    // Watch for form changes to provide real-time validation feedback
    this.teacherForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateFormErrors());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.teacherForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]],
      email: ['', [Validators.required, Validators.email]],
      education: ['', Validators.required],
      userType: "Teacher",
      yearsOfExperience: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
      PhoneNumber: ['', [Validators.required]],
      nationalId: ['', [
        Validators.required,
        Validators.pattern(/^\d{14}$/),
        this.nationalIdValidator
      ]],
      dateOfBirth: ['', Validators.required],
    });
  }

  private ageValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;

    const birthDate = new Date(control.value);
    const today = new Date();

    // Check if date is valid
    if (isNaN(birthDate.getTime())) return { invalidDate: true };

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;

    return adjustedAge >= 18 && adjustedAge <= 65
      ? null
      : { invalidAge: { value: adjustedAge, min: 18, max: 65 } };
  }

  // Custom validator for Egyptian National ID
  private nationalIdValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;

    const nationalId = control.value;

    // Basic pattern check (14 digits) is handled by the pattern validator
    // Additional validation: First digit should be 2 or 3 (for 20th or 21st century)
    if (!/^[23]\d{13}$/.test(nationalId)) {
      return { invalidNationalId: true };
    }

    return null;
  }

  filterCountries(): void {
    const allCountries = Object.values(CountryISO);
    const excludedCountries = [CountryISO.Israel];
    this.allowedCountries = allCountries.filter(country => !excludedCountries.includes(country));
  }

  updateFormErrors(): void {
    this.formErrors = {};

    Object.keys(this.teacherForm.controls).forEach(key => {
      const control = this.teacherForm.get(key);
      if (control && control.invalid && (control.dirty || control.touched)) {
        this.formErrors[key] = this.getErrorMessage(key, control.errors);
      }
    });
  }

  getErrorMessage(field: string, errors: any): string {
    if (errors.required) {
      return `${this.translateField(field)} is required`;
    }

    if (errors.email) {
      return `Please enter a valid email address`;
    }

    if (errors.minlength) {
      return `${this.translateField(field)} must be at least ${errors.minlength.requiredLength} characters`;
    }

    if (errors.invalidAge) {
      return `Age must be between 18 and 65 years`;
    }

    if (errors.pattern || errors.invalidNationalId) {
      if (field === 'nationalId') {
        return 'Please enter a valid 14-digit national ID';
      }
      if (field === 'password') {
        return 'Password must be at least 8 characters long and include a lowercase letter, uppercase letter, number, and special character.';
      }
      return `Invalid ${this.translateField(field)}`;
    }

    return `Invalid ${this.translateField(field)}`;
  }

  translateField(field: string): string {
    // Fallback if translation service fails
    const fieldMap: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      education: 'Education',
      yearsOfExperience: 'Years of Experience',
      PhoneNumber: 'Phone Number',
      nationalId: 'National ID',
      dateOfBirth: 'Date of Birth',
      selectedQuizzes: 'Quizzes'
    };

    try {
      return this.translateService.instant(`${field}`) || fieldMap[field] || field;
    } catch {
      return fieldMap[field] || field;
    }
  }

  submitTeacherData(): void {
    if (this.teacherForm.invalid) {
      this.markFormGroupTouched(this.teacherForm);
      this.formErrors['apiError'] = 'Please fix the errors in the form before submitting.';
      this.cdr.detectChanges();
      return;
    }

    // Clear previous messages
    this.formErrors['apiError'] = '';
    this.successMessage = '';
    this.showSuccessAlert = false;
    this.isSubmitting = true;
    this.cdr.detectChanges();

    const teacherData = {
      ...this.teacherForm.value,
      PhoneNumber: this.teacherForm.value.PhoneNumber?.internationalNumber || this.teacherForm.value.PhoneNumber,
    };

    this.teacherService.createTeacher(teacherData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.showSuccessAlert = true;
          this.successMessage = 'Teacher account created successfully!';

          // Reset form after success
          setTimeout(() => {
            this.teacherForm.reset({
              userType: 'Teacher',
              yearsOfExperience: 0,
              dateOfBirth: ''
            });
            this.teacherForm.markAsPristine();
            this.teacherForm.markAsUntouched();
            this.cdr.detectChanges();
          }, 2000);
        },
        error: (error) => {
          this.formErrors['apiError'] = error.error?.errors?.[0]?.description ||
                                       error.error?.message ||
                                       'An unexpected error occurred. Please try again.';
          this.cdr.detectChanges();
        }
      });
  }

  closeSuccessAlert(): void {
    this.showSuccessAlert = false;
    this.cdr.detectChanges();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper to get form control for template access
  get f() {
    return this.teacherForm.controls;
  }
}
