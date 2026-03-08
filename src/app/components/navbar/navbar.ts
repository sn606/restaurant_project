import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isLoggedIn = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isLoggedIn = document.cookie.includes('restaurant_token') ||
                        document.cookie.includes('education_token');
    });

    this.isLoggedIn = document.cookie.includes('restaurant_token') ||
                      document.cookie.includes('education_token');
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}