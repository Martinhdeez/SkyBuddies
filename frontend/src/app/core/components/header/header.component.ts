import { Component, OnInit } from '@angular/core';
import { RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {NgClass, NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    NgClass,
    RouterLink,
    NgIf,
    NgOptimizedImage
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isDropdownOpen = false;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logoutAndReload(): void {
    this.authService.logout();
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  }
}
