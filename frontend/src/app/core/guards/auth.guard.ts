import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Check if the user is authenticated.
   * @param next The activated route snapshot.
   * @returns True if the user is authenticated, false otherwise.
   */
  canActivate(next: ActivatedRouteSnapshot): boolean {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']).then(() =>
        console.log('[AuthGuard] No token found, redirecting to login.')
      );
      return false;
    }
    return true;
  }
}
