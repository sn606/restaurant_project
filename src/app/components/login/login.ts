import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    const storedUser = this.authService.getStoredUser();

    if (
      storedUser &&
      storedUser.email === this.email &&
      storedUser.password === this.password
    ) {
      this.authService.setCookie('restaurant_token', 'simulated_token_' + Date.now());
      alert('Login Successful! Redirecting...');
      setTimeout(() => this.router.navigate(['/']), 1500);
      return;
    }

    this.authService.loginWithEducationAPI({ email: this.email, password: this.password }).subscribe({
      next: () => {
        alert('Login Successful! Redirecting...');
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: () => {
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    });
  }
}