import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RailwayCheckGuard implements CanActivate {

  constructor(private http: HttpClient, private router: Router) { }

  canActivate(): Observable<boolean> {
    const healthUrl = `${environment.apiUrl}/healthz`;
    console.log('Iniciando validación de Railway con URL:', healthUrl);

    return this.http.get<any>(healthUrl).pipe(
      map(response => {
        console.log('Respuesta de /healthz:', response);
        if (response && response.status === "OK") {
          return true;
        } else {
          this.router.navigate(['/error']).then(success => console.log('Redirigiendo a error:', success));
          return false;
        }
      }),
      catchError(error => {
        console.error('Error al validar /healtz:', error);
        this.router.navigate(['/error/permission']).then(success => console.log('Redirigiendo a error:', success));
        return of(false);
      })
    );
  }
}
