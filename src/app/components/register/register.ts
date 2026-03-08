import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Z]{1}[a-z]{1,8}$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Z]{1}[a-z]{2,15}$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^[0-9]{5,10}$/)]]
    });
  }

  isInvalid(name: string): boolean {
    const ctrl = this.registerForm.get(name);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  isValid(name: string): boolean {
    const ctrl = this.registerForm.get(name);
    return !!(ctrl?.valid && ctrl?.touched);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.authService.register(this.registerForm.value);
    alert('Registration Successful! You can now login.');
    this.router.navigate(['/login']);
  }
}
