import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface HealthResponse {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class RailwayCheckGuard implements CanActivate {

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Checks the health of the API by making a GET request to /healthz.
   * If the status is "OK", it returns true, otherwise it redirects to an error page.
   * @returns Observable<boolean> indicating whether the route can be activated.
   */
  canActivate(): Observable<boolean> {
    const healthUrl = `${environment.apiUrl}/healthz`;

    return this.http.get<HealthResponse>(healthUrl).pipe(
      map(response => response.status === "OK"),
      catchError(error => {
        console.error('Error al validar /healthz:', error);
        this.router.navigate(['/error/internal']).then(r => console.log('Navigated to error page:', r));
        return of(false);
      })
    );
  }
}
