import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../../core/components/footer/footer.component';
import { AuthService, RegisterRequest, RegisterResponse } from '../../../core/services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { NgIf } from '@angular/common';
import { CustomSnackbarComponent } from '../../../core/components/custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FooterComponent, RouterLink, NgIf, CustomSnackbarComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });

  // VARS TO CONTROL THE SNACKBAR
  showSnackbar = false;
  snackbarMessage = '';

  constructor(private router: Router, private authService: AuthService) {}

  openSnackbar(message: string): void {
    this.snackbarMessage = message;
    this.showSnackbar = true;
    setTimeout(() => {
      this.showSnackbar = false;
    }, 3000);
  }

  onSubmit(): void {

    // SHOW SNACKBAR IF FORM IS INVALID
    if (!this.registerForm.valid) {
      this.openSnackbar('Please complete all required fields correctly.');
      return;
    }

    // VALIDATE PASSWORDS MATCH
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.openSnackbar('Passwords do not match.');
      return;
    }

    const registerData: RegisterRequest = {
      username: this.registerForm.value.username!,
      full_name: this.registerForm.value.name!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!
    };

    // CALL REGISTER SERVICE
    this.authService.register(registerData).pipe(
      catchError(error => {
        console.error('Error during registration:', error);
        this.openSnackbar('Registration failed. Please try again.');
        return of(null);
      })
    ).subscribe((response: RegisterResponse | null) => {
      if (response && response.id) {
        this.openSnackbar('Registration successful! Please log in.');
        this.router.navigate(['/index']).then(r => console.log('Navigated:', r));
      } else {
        this.openSnackbar('Registration failed. Please try again.');
      }
    });
  }
}
