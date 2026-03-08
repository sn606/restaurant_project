import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, LoginData } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly EDUCATION_API = 'https://api.everrest.educata.dev/auth';

  constructor(private http: HttpClient) {}

  setCookie(name: string, value: string, days: number = 7): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }

  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  removeCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }

  isLoggedIn(): boolean {
    return !!(this.getCookie('restaurant_token') || this.getCookie('education_token'));
  }

  getStoredUser(): User | null {
    const storedUser = localStorage.getItem('restaurant_user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  getEducationToken(): string | null {
    return this.getCookie('education_token');
  }

  loginWithEducationAPI(loginData: LoginData): Observable<any> {
    return this.http.post<any>(`${this.EDUCATION_API}/sign_in`, loginData).pipe(
      tap(data => {
        if (data?.access_token) {
          this.setCookie('education_token', data.access_token);
        }
      }),
      catchError(err => {
        console.warn('Education API login failed:', err);
        return throwError(() => err);
      })
    );
  }

  register(userData: User): void {
    localStorage.setItem('restaurant_user', JSON.stringify(userData));
    this.registerWithEducationAPI(userData).subscribe();
  }

  registerWithEducationAPI(userData: User): Observable<any> {
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.password,
      gender: 'male',
      agreeToTerms: true
    };
    return this.http.post<any>(`${this.EDUCATION_API}/sign_up`, payload).pipe(
      catchError(err => {
        console.warn('Registration failed:', err);
        return throwError(() => err);
      })
    );
  }

  getProfile(): Observable<any> {
    const token = this.getEducationToken();
    return this.http.get<any>(this.EDUCATION_API, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  logout(): void {
    this.removeCookie('restaurant_token');
    this.removeCookie('education_token');
  }
}