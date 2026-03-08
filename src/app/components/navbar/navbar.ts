import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  ngOnInit(): void {
    this.isLoggedIn = document.cookie.includes('restaurant_token') || 
                      document.cookie.includes('education_token');
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}