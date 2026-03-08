import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    const restaurantToken = this.getCookie('restaurant_token');
    const educationToken = this.getCookie('education_token');

    if (!restaurantToken && !educationToken) {
      alert('Please login first');
      this.router.navigate(['/login']);
      return;
    }

    const storedUser = localStorage.getItem('restaurant_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.profileData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: 'Restaurant User'
      };
      this.loading = false;
    } else if (educationToken) {
      fetch('https://api.everrest.educata.dev/auth', {
        headers: { Authorization: `Bearer ${educationToken}` }
      })
      .then(res => res.json())
      .then(data => {
        this.profileData = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          accountType: 'Education Platform User'
        };
        this.loading = false;
      })
      .catch(() => {
        this.profileData = { firstName: 'Welcome', lastName: '', email: '', accountType: 'Logged in' };
        this.loading = false;
      });
    } else {
      this.profileData = { firstName: 'Welcome', lastName: '', email: '', accountType: 'Logged in' };
      this.loading = false;
    }
  }

  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  removeCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }

  logout(): void {
    this.removeCookie('restaurant_token');
    this.removeCookie('education_token');
    alert('Logged out successfully');
    this.router.navigate(['/']);
  }
}