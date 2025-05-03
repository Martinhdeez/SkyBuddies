import { Component, OnInit } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ NgIf, NgOptimizedImage, RouterLink, OverlayModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isDropdownOpen = false;

  positions: ConnectedPosition[] = [
    {
      originX: 'end', originY: 'bottom',
      overlayX: 'end', overlayY: 'top'
    },
    {
      originX: 'start', originY: 'bottom',
      overlayX: 'start', overlayY: 'top'
    }
  ];

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  toggleDropdown(evt: MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logoutAndReload(): void {
    this.authService.logout();
    setTimeout(() => window.location.href = '/login', 100);
  }
}
