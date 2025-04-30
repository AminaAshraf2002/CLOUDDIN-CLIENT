import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AdminUser {
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  admin: {
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://clouddin.onrender.com/api';
  private tokenKey = 'adminToken';
  private adminUserKey = 'adminUser';
  
  // BehaviorSubject to track the current admin user
  private currentAdminSubject = new BehaviorSubject<AdminUser | null>(this.getStoredAdmin());
  currentAdmin$ = this.currentAdminSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}
  
  // Login method
  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/admin/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            // Store the token
            this.storeToken(response.token);
            
            // Store admin user information
            this.storeAdminUser(response.admin);
          }
        }),
        catchError(this.handleError)
      );
  }
  
  // Logout method
  logout(): Observable<any> {
    const headers = this.createAuthHeaders();
    
    return this.http.post(`${this.apiUrl}/admin/logout`, {}, { headers })
      .pipe(
        tap(() => this.clearStoredData()),
        catchError(this.handleError)
      );
  }

  // Token refresh method
  refreshToken(): Observable<string> {
    const headers = this.createAuthHeaders();

    return this.http.post<{token: string}>(`${this.apiUrl}/admin/refresh-token`, {}, { headers })
      .pipe(
        tap(response => {
          if (response.token) {
            this.storeToken(response.token);
          }
        }),
        map(response => response.token),
        catchError(error => {
          this.clearStoredData();
          this.router.navigate(['/admin/login']);
          return throwError(() => new Error('Failed to refresh token'));
        })
      );
  }
  
  // Token retrieval methods
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  
  hasToken(): boolean {
    return !!this.getToken();
  }

  // Create authentication headers
  createAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
  }
  
  // Store token method
  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  
  // Store admin user method
  private storeAdminUser(admin: { name: string; email: string }): void {
    localStorage.setItem(this.adminUserKey, JSON.stringify(admin));
    this.currentAdminSubject.next(admin);
  }
  
  // Clear stored data method
  private clearStoredData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.adminUserKey);
    this.currentAdminSubject.next(null);
  }
  
  // Get stored admin method
  getStoredAdmin(): AdminUser | null {
    const adminJson = localStorage.getItem(this.adminUserKey);
    return adminJson ? JSON.parse(adminJson) : null;
  }
  
  // Get admin name method
  getAdminName(): string {
    const admin = this.getStoredAdmin();
    return admin ? admin.name : 'Admin';
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Unauthorized: Invalid credentials';
          break;
        case 403:
          errorMessage = 'Forbidden: You do not have permission';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Check if token is valid (can be expanded with more checks)
  isTokenValid(): boolean {
    const token = this.getToken();
    return !!token; // Add more robust token validation if needed
  }
}