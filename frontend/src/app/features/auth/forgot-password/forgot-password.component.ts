import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CustomSnackbarComponent } from '../../../core/components/custom-snackbar/custom-snackbar.component';
import {FooterComponent} from '../../../core/components/footer/footer.component';
import {HeaderComponent} from '../../../core/components/header/header.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  imports: [
    ReactiveFormsModule,
    CustomSnackbarComponent,
    RouterLink,
    FooterComponent,
    HeaderComponent,
    NgIf
  ],
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  showSnackbar = false;
  snackbarMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  openSnackbar(message: string): void {
    this.snackbarMessage = message;
    this.showSnackbar = true;
    setTimeout(() => {
      this.showSnackbar = false;
    }, 5000);
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;

      // Si el formulario es válido, ejecuta el servicio de forgotPassword
      if (email) {
        this.authService.forgotPassword({ email }).pipe(
          catchError(error => {
            console.error('Error during password recovery:', error);
            this.openSnackbar('An error occurred. Please try again.');
            return of(null);
          })
        ).subscribe(response => {
          if (response) {
            this.openSnackbar('If this email is registered, you\'ll receive a link to reset your password.');
          }
        });
      }
    } else {
      this.openSnackbar('Please enter a valid email.');
    }
  }
}
