import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../login.component.scss','./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  email: string = '';
  code: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Extract query parameters from URL
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.code = params['Code'] || '';

      if (!this.email || !this.code) {
        this.errorMessage = 'Invalid reset link. Please request a new password reset.';
      }
    });

    // Initialize the form
    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.errorMessage = 'Please correct the errors in the form.';
      return;
    }

    const { newPassword, confirmPassword } = this.resetPasswordForm.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Create payload for API
    const resetData = {
      email: this.email,
      code: this.code,
      newPassword: newPassword
    };

    // Call the API
    this.authService.resetPassword(resetData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Password reset successfully! Redirecting to login...';

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/admin-log']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to reset password. Please try again.';
      }
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  // Password validation helper methods
  hasMinLength(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    return password && password.length >= 8;
  }

  hasUpperCase(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    return password && /[A-Z]/.test(password);
  }

  hasLowerCase(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    return password && /[a-z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    return password && /\d/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    return password && /[@$!%*?&]/.test(password);
  }
}
