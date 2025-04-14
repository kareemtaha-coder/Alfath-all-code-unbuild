import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-starter',
  templateUrl: './admin-starter.component.html',
  styleUrls: ['./admin-starter.component.scss']
})
export class AdminStarterComponent implements OnInit {
  isCollapsed = false;
  admenRole: string | null = '';
  showDropdown = false;
  isEmailConfirmed = true;
  showBanner = true;
  userEmail = localStorage.getItem('userEmail');
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Get admin role from localStorage
    this.admenRole = localStorage.getItem("adminRole");

    // Check email confirmation status
    this.authService.isEmailConfirmed.subscribe(status => {
      this.isEmailConfirmed = status;
    });

    // Get saved banner dismissal state
    const bannerDismissed = localStorage.getItem('emailBannerDismissed');
    if (bannerDismissed === 'true') {
      this.showBanner = false;
    }

    // Check if sidebar state is saved in localStorage
    const savedState = localStorage.getItem('sidebarState');
    if (savedState) {
      this.isCollapsed = savedState === 'collapsed';
    }

    // Handle click outside dropdown
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        this.showDropdown = false;
      }
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    // Save sidebar state to localStorage
    localStorage.setItem('sidebarState', this.isCollapsed ? 'collapsed' : 'expanded');
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to log out?')) {
      this.authService.logOut();
      this.router.navigate(['/admin-log']);
    }
  }

  dismissBanner() {
    this.showBanner = false;
    localStorage.setItem('emailBannerDismissed', 'true');
  }

  resendConfirmationEmail() {
    if (this.isLoading) return;

    this.isLoading = true;
    const payload = { email: this.userEmail };

    this.authService.resendConfirmationEmail(payload).subscribe({
      next: () => {
        this.toastr.success('Confirmation email sent successfully!', 'Success');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to resend confirmation email', error);
        this.toastr.error('Failed to resend confirmation email. Please try again.', 'Error');
        this.isLoading = false;
      }
    });
  }
}
