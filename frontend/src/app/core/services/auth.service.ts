import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import { jwtDecode } from "jwt-decode";


// INTERFACE THAT DEFINES THE REGISTER DATA
export interface RegisterRequest {
  username: string;
  email: string;
  full_name: string;
  password: string;
}

// INTERFACE THAT DEFINES THE REGISTER RESPONSE
export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  full_name: string;
  password: string;
  updated_at: string;
  created_at: string;
}

// INTERFACE THAT DEFINES THE LOGIN DATA
export interface LoginRequest {
  username_or_email: string;
  password: string;
}

// INTERFACE THAT DEFINES THE LOGIN RESPONSE
export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// INTERFACE THAT DEFINES THE FORGOT PASSWORD DATA
export interface ForgotPasswordRequest {
  email: string;
}

// INTERFACE THAT DEFINES THE FORGOT PASSWORD RESPONSE
export interface ForgotPasswordResponse {
  message: string;
}

// INTERFACE THAT DEFINES THE RESET PASSWORD DATA
export interface ResetPasswordRequest {
  new_password: string;
  token: string;
}

// INTERFACE THAT DEFINES THE RESET PASSWORD RESPONSE
export interface ResetPasswordResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // API URL
  private apiUrl = `${environment.apiUrl}/auth`;

  /**
   * Constructor.
   * @param http The HttpClient service.
   *           Used to make HTTP requests.
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Register a new user.
   * @param data The registration data.
   * @returns An Observable with the registration response.
   *        If successful, stores the token in localStorage.
   */
  register(data: RegisterRequest): Observable<RegisterResponse> {
    const url = `${this.apiUrl}/register`;
    return this.http.post<RegisterResponse>(url, data);
  }

  /**
   * Initiate a session with a user.
   * @param data The login data (username or email, and password).
   * @returns An Observable with the login response.
   *         If successful, stores the token in localStorage.
   */
  login(data: LoginRequest): Observable<LoginResponse> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<LoginResponse>(url, data).pipe(
      map(response => {
        // Almacena el token en localStorage para usarlo en futuras peticiones
        localStorage.setItem('access_token', response.access_token);
        return response;
      })
    );
  }

  /**
   * Forgot password.
   * @param data The email data.
   */
  forgotPassword(data: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    const url = `${this.apiUrl}/forgot-password`;
    return this.http.post<ForgotPasswordResponse>(url, data);
  }

  /**
   * Reset the password of a user.
   * @param data The reset password data (new password and token).
   */
  resetPassword(data: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    const url = `${this.apiUrl}/reset-password`;
    return this.http.post<ResetPasswordResponse>(url, data);
  }

  /**
   * Close the session.
   */
  logout(): void {
    localStorage.removeItem('access_token');
  }

  /**
   * Gets the stored token or null if it doesn't exist.
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Indicates if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Gets the user ID from the token.
   * If the token is not found, returns null.
   */
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.id || null;
    } catch (error) {
      console.error('Error al decodificar el token', error);
      return null;
    }
  }

  /**
   * Gets the username from the token.
   * If the token is not found, returns null.
   */
  getUsername(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.username || null;
    } catch (error) {
      console.error('Error al decodificar el token', error);
      return null;
    }
  }
}
