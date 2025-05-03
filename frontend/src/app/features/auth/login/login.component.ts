import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../../core/components/footer/footer.component';
// import { HeaderComponent } from '../../../core/components/header/header.component';
import { AuthService, LoginRequest, LoginResponse } from '../../../core/services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { emailOrUsernameValidator } from '../../../core/validators/email-or-username.validator';
import { CustomSnackbarComponent } from '../../../core/components/custom-snackbar/custom-snackbar.component';
import { NgIf } from '@angular/common';
import {HeaderComponent} from '../../../core/components/header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FooterComponent, CustomSnackbarComponent, NgIf, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, emailOrUsernameValidator()]),
    password: new FormControl('', Validators.required)
  });

  // VARS TO CONTROL THE SNACKBAR
  showSnackbar = false;
  snackbarMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  /*
     THIS LINE IS COMMENTED BECAUSE IF THE USER IS ALREADY AUTHENTICATED, THE can PROHIBIT THE USER TO ACCESS THE LOGIN PAGE

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/index']).then(r => console.log('Navigated:', r));
    }
  }

   */

  openSnackbar(message: string): void {
    this.snackbarMessage = message;
    this.showSnackbar = true;
    setTimeout(() => {
      this.showSnackbar = false;
    }, 5000);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData: LoginRequest = {
        username_or_email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      // CALL LOGIN SERVICE
      this.authService.login(loginData).pipe(
        catchError(error => {
          console.error('Error during login:', error);
          this.openSnackbar("Invalid credentials. Please try again.");
          return of(null);
        })
      ).subscribe((response: LoginResponse | null) => {
        if (response && response.access_token) {
          this.router.navigate(['/index']).then(r => console.log('Navigated:', r));
        } else {
          this.openSnackbar("Invalid credentials. Please try again.");
        }
      });
    }else {
      this.openSnackbar('Please complete all required fields correctly.');
    }
  }
}
