/*import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot): boolean {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']).then(() => console.log('[RoleGuard] No token found, redirecting to login.'));
      return false;
    }

    // RECOVER THE ALLOWED ROLES FROM THE ROUTE (IF DEFINED)
    const allowedRoles = next.data['roles'] as string[];
    if (!allowedRoles || allowedRoles.length === 0) {
      // IF NO ROLES ARE SPECIFIED, ALLOW ACCESS
      return true;
    }

    // OBTAIN THE USER ROLES AND CONVERT THEM TO LOWERCASE FOR CASE-INSENSITIVE COMPARISON
    const userRoles = this.authService.getUserRoles().map(role => role.toLowerCase());

    // CHECK IF THE USER HAS ANY OF THE ALLOWED ROLES
    const hasAllowedRole = allowedRoles.some(allowed =>
      userRoles.includes(allowed.toLowerCase())
    );

    if (hasAllowedRole) {
      console.log('[RoleGuard] User has allowed role. Access granted.');
      return true;
    }

    // IF THE PATH HAS AN "id" PARAMETER, ALLOW ACCESS ONLY IF THE ID MATCHES THE USER id
    const requestedId = next.paramMap.get('id');
    const userId = this.authService.getUserId();
    if (requestedId && userId && requestedId === userId) {
      console.log('[RoleGuard] User does not have allowed role, but the requested id matches the token id. Access granted.');
      return true;
    }

    console.warn('[RoleGuard] Access denied. User roles:', userRoles, 'Allowed roles:', allowedRoles);
    this.router.navigate(['/error/permission']).then(() => console.log('[RoleGuard] Navigated to permission error page.'));
    return false;
  }
}
*/
