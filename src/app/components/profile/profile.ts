import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  profileData: any = null;
  loading = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Please login first');
      this.router.navigate(['/login']);
      return;
    }

    const storedUser = this.authService.getStoredUser();
    if (storedUser) {
      this.profileData = {
        firstName: storedUser.firstName,
        lastName: storedUser.lastName,
        email: storedUser.email,
        accountType: 'Restaurant User'
      };
      this.loading = false;
    } else if (this.authService.getEducationToken()) {
      this.authService.getProfile().subscribe({
        next: (data) => {
          this.profileData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            accountType: 'Education Platform User'
          };
          this.loading = false;
        },
        error: () => {
          this.profileData = { firstName: 'Welcome', lastName: '', email: '', accountType: 'Logged in' };
          this.loading = false;
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    alert('Logged out successfully');
    this.router.navigate(['/']);
  }
}