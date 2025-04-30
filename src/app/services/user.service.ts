import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

// Comprehensive User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  course: string;
  courseId?: number;
  role: 'user' | 'admin';
  status: 'pending' | 'approved' | 'inactive';
  registrationDate: Date;
  isApproved?: boolean;
}

// Login Response Interface
export interface LoginResponse {
  token: string;
  user: User;
}

// User Statistics Interface
export interface UserStatistics {
  total: number;
  pending: number;
  approved: number;
  inactive: number;
  courseBreakdown: { [course: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Base API endpoint configuration
  private apiUrl = 'https://clouddin.onrender.com/api';
  
  // Predefined Course Mapping
  private courseMap: { [key: string]: { id: number; name: string } } = {
    'ecommerce': { id: 1, name: 'Ecommerce Mastery' },
    'marketing': { id: 2, name: 'Digital Marketing' },
    'design': { id: 3, name: 'Graphic Design' }
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Intelligent Course Name Extraction
  private extractCourseName(user: any): string {
    if (!user) return 'Not Specified';
    
    const courseFields = ['courseName', 'course', 'selectedCourse'];
    
    for (let field of courseFields) {
      if (user[field]) {
        const courseKey = Object.keys(this.courseMap).find(
          key => typeof user[field] === 'string' && user[field].toLowerCase().includes(key)
        );
        
        return courseKey
          ? this.courseMap[courseKey].name
          : (typeof user[field] === 'object'
             ? user[field].name
             : user[field]);
      }
    }
    
    return 'Not Specified';
  }

  // Centralized Error Handling
  private handleError(error: HttpErrorResponse) {
    console.error('API Error Occurred:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      // Backend returned unsuccessful response
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          this.handleUnauthorized();
          break;
        case 403:
          errorMessage = 'Access denied. You do not have permission.';
          break;
        case 404:
          errorMessage = 'Requested resource not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Backend Error: ${error.status} - ${error.error?.message || error.statusText}`;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Handle unauthorized access (token expired or invalid)
  private handleUnauthorized() {
    // Clear tokens and redirect to login
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    // You would typically redirect to login page here
    // This would be handled by a router in a real application
  }

  // Generate Authenticated Headers
  private getAuthHeaders(): HttpHeaders {
    // Try adminToken first (which is what we store in your login method)
    const token = localStorage.getItem('adminToken') || 
                  this.authService.getToken() || 
                  localStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // User Login Method - FINAL FIX for handling backend response
  loginUser(credentials: {
    email: string;
    password: string
  }): Observable<LoginResponse> {
    return this.http.post<any>(`${this.apiUrl}/users/login`, credentials).pipe(
      tap(response => console.log('Raw Login Response:', response)),
      map(response => {
        // Check if we received a successful response
        if (!response || !response.token || !response.user) {
          console.error('Invalid response format:', response);
          throw new Error('Invalid login response format');
        }
        
        // Extract the user from the response
        const userData = response.user;
        
        // Message "Login successful" means user is approved
        const isApprovedLogin = response.message === 'Login successful';
        
        // The backend DOES NOT send a 2xx response with a failed login message
        // If we got here with a 200 OK, the user is approved
        
        // Create a properly formatted user object
        const formattedUser: User = {
          id: userData.id || userData._id || '',
          name: userData.name || 'User',
          email: userData.email || credentials.email,
          course: userData.courseName || userData.course || 'Not Specified',
          courseId: userData.courseId,
          role: userData.role || 'user',
          // Server returns 200 OK only for approved users
          status: 'approved',
          registrationDate: new Date(userData.registrationDate || Date.now()),
          isApproved: true
        };

        // Store authentication data in local storage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(formattedUser));
        
        console.log('Formatted user for successful login:', formattedUser);

        // Return the formatted response
        return {
          token: response.token,
          user: formattedUser
        } as LoginResponse;
      }),
      catchError(error => {
        console.error('Login Error:', error);
        
        // Special handling for approval errors (403)
        if (error.status === 403 && error.error?.isPending) {
          return throwError(() => new Error('Account pending admin approval'));
        }
        
        // General error handler
        return throwError(() => new Error(
          error.error?.message || 'Login failed. Please try again.'
        ));
      })
    );
  }

  // Determine User Status - Enhanced to handle both formats
  private determineUserStatus(user: any): User['status'] {
    if (user.status === 'approved' || user.isApproved === true) return 'approved';
    if (user.status === 'inactive') return 'inactive';
    return 'pending';
  }

  // Retrieve All Users
  getAllUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    
    console.log('Getting all users with headers:', headers);
    
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`, { headers })
      .pipe(
        tap(response => console.log('Raw API Response:', response)),
        map(users => {
          console.log('🔍 Raw Users from Backend:', users);
          
          return users.map(user => ({
            id: user.id || user._id,  // Handle different ID formats
            name: user.name || 'Unknown',
            email: user.email || '',
            status: this.determineUserStatus(user),
            course: this.extractCourseName(user),
            role: user.role || 'user',
            registrationDate: new Date(user.registrationDate || Date.now())
          }));
        }),
        catchError(this.handleError)
      );
  }

  // Approve User Method
  approveUser(userId: string): Observable<User> {
    console.log('UserService: approveUser called with ID:', userId);
    
    if (!userId) {
      console.error('Cannot approve user with undefined ID');
      return throwError(() => new Error('User ID is required for approval'));
    }
    
    const headers = this.getAuthHeaders();
    console.log('Approval request headers:', headers);
    
    // Log the full request details for debugging
    console.log(`Making PUT request to: ${this.apiUrl}/admin/users/${userId}/approve`);
    
    return this.http.put<User>(
      `${this.apiUrl}/admin/users/${userId}/approve`,
      {},  // Empty body
      { headers }
    ).pipe(
      tap(response => console.log('Raw approval response:', response)),
      map((user: any) => {
        console.log('User Approval Response:', user);
        return {
          id: user.id || user._id || userId,  // Use the original ID if response doesn't include one
          name: user.name || 'Unknown',
          email: user.email || '',
          status: 'approved' as 'approved',  // Type assertion to satisfy TypeScript
          isApproved: true,
          course: this.extractCourseName(user),
          role: user.role || 'user',
          registrationDate: new Date(user.registrationDate || Date.now())
        };
      }),
      catchError(error => {
        console.error('Error in approveUser method:', error);
        return this.handleError(error);
      })
    );
  }

  // Delete User Method
  deleteUser(userId: string): Observable<any> {
    console.log('UserService: deleteUser called with ID:', userId);
    
    if (!userId) {
      console.error('Cannot delete user with undefined ID');
      return throwError(() => new Error('User ID is required for deletion'));
    }
    
    const headers = this.getAuthHeaders();
    console.log('Delete request headers:', headers);
    
    // Log the full request details for debugging
    console.log(`Making DELETE request to: ${this.apiUrl}/admin/users/${userId}`);
    
    return this.http.delete(
      `${this.apiUrl}/admin/users/${userId}`,
      { headers }
    ).pipe(
      tap(() => console.log(`User ${userId} deleted successfully`)),
      catchError(error => {
        console.error('Error in deleteUser method:', error);
        return this.handleError(error);
      })
    );
  }

  // Get Pending Users Method
  getPendingUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    
    return this.http.get<any[]>(`${this.apiUrl}/admin/users/pending`, { headers })
      .pipe(
        map(users => {
          return users.map(user => ({
            id: user.id || user._id,
            name: user.name || 'Unknown',
            email: user.email || '',
            course: this.extractCourseName(user),
            status: 'pending' as 'pending',  // Add type assertion here
            role: user.role || 'user',
            registrationDate: new Date(user.registrationDate || Date.now())
          }));
        }),
        catchError(this.handleError)
      );
  }

  // User Count Statistics
  getUserCount(): Observable<UserStatistics> {
    const headers = this.getAuthHeaders();
    
    return this.http.get<any>(`${this.apiUrl}/admin/users/count`, { headers })
      .pipe(
        map(stats => ({
          total: stats.total || 0,
          pending: stats.pending || 0,
          approved: stats.approved || 0,
          inactive: stats.inactive || 0,
          courseBreakdown: stats.courseBreakdown || {}
        })),
        catchError(this.handleError)
      );
  }
}