import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot): boolean {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']).then(() =>
        console.log('[AuthGuard] No token found, redirecting to login.')
      );
      return false;
    }
    return true; // ✅ necesario para cubrir ambos casos
  }
}
