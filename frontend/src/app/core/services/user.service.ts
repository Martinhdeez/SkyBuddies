import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// INTERFACE THAT DEFINES THE USER DATA
export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  password: string;
  updated_at: string;
  created_at: string;
}

// DATA REQUIRED TO CREATE A USER
export interface CreateUserRequest {
  username: string;
  email: string;
  full_name: string;
  password: string;
}

// DATA REQUIRED TO UPDATE A USER
export interface UpdateUserRequest {
  username: string;
  email: string;
  full_name: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Gets the list of users.
   * @returns Observable<User[]> that emits the array of users.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  /**
   * Creates a new user.
   * @param data The data to create the user.
   * @returns Observable<User> with the created user.
   */
  createUser(data: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.baseUrl, data);
  }

  /**
   * Gets a user by its ID.
   * @param userId The user ID.
   * @returns Observable<User> with the found user.
   */
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${userId}`);
  }

  /**
   * Updates the user data.
   * @param userId The user ID.
   * @param data The new user data.
   * @returns Observable<User> with the updated user.
   */
  updateUser(userId: string, data: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${userId}`, data);
  }

  /**
   * Deletes a user.
   * @param userId The user ID.
   * @returns Observable<string> with a success or error message.
   */
  deleteUser(userId: string): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${userId}`);
  }
}
