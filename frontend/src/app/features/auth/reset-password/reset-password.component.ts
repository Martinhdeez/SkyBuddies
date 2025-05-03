import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {HeaderComponent} from '../../../core/components/header/header.component';
import {CustomSnackbarComponent} from '../../../core/components/custom-snackbar/custom-snackbar.component';
import {FooterComponent} from '../../../core/components/footer/footer.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    CustomSnackbarComponent,
    FooterComponent,
    NgIf
  ],
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  resetPasswordForm: FormGroup;
  token: string | null = null;
  showSnackbar = false;
  snackbarMessage = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
    });
  }

  openSnackbar(message: string): void {
    this.snackbarMessage = message;
    this.showSnackbar = true;
    setTimeout(() => {
      this.showSnackbar = false;
    }, 5000);
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.token) {
      const newPassword = this.resetPasswordForm.value.newPassword;
      const confirmPassword = this.resetPasswordForm.value.confirmPassword;

      if (newPassword !== confirmPassword) {
        this.openSnackbar('Passwords do not match.');
        return;
      }

      // Enviar la nueva contraseña al backend con el token de recuperación
      this.authService.resetPassword({
        token: this.token,
        new_password: newPassword
      }).pipe(
        catchError(error => {
          console.error('Error during password reset:', error);
          this.openSnackbar('Error resetting password. Please try again.');
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          this.openSnackbar('Password reset successfully.');
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.openSnackbar('Please enter a valid password.');
    }
  }
}
