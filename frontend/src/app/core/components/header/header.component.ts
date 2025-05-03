import { Component, OnInit } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {Router, RouterLink} from '@angular/router';
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

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  toggleDropdown(evt: MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  goToProfile(evt: MouseEvent) {
    evt.preventDefault();
    this.isDropdownOpen = false;
    const uid = this.authService.getUserId();
    this.router.navigate(['/user', uid]);
  }

  logoutAndReload(): void {
    this.authService.logout();
    setTimeout(() => window.location.href = '/login', 100);
  }
}
