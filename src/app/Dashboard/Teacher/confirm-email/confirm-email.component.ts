import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
  userId: string | null = null;
  code: string | null = null;
  isLoading = true;
  confirmationSuccess = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Get parameters from query string
    this.route.queryParams.subscribe(params => {
      this.userId = params['UserId'];
      this.code = params['Code'];

      if (this.userId && this.code) {
        this.confirmEmail();
      } else {
        this.isLoading = false;
        this.errorMessage = 'Invalid confirmation link. Missing required parameters.';
      }
    });
  }

  confirmEmail(): void {
    const apiUrl = 'https://localhost:7107/api/Auth/confirm-email'; // Replace with your actual API endpoint

    const payload = {
      userId: this.userId,
      code: this.code
    };

    this.http.post(apiUrl, payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.confirmationSuccess = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to confirm email. Please try again later.';
        console.error('Email confirmation error:', error);
      }
    });
  }
}
