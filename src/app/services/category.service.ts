import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Lesson } from './course.service'; // Import Lesson from CourseService

export interface Category {
  id: number;
  title: string; 
  description: string;
  thumbnail: string; // Changed from optional to required
  courseId: number;
  lessons?: Lesson[]; // Updated to use Lesson type
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'https://clouddin.onrender.com/api/subcategories';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Helper method to get auth headers
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken() || localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all categories (admin access)
  getAllCategories(): Observable<Category[]> {
    return this.http.get<{success: boolean, data: Category[]}>(
      `${this.apiUrl}/all`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => console.log('Get all categories response:', response)),
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching all categories:', error);
        return throwError(() => new Error('Unable to fetch categories'));
      })
    );
  }

  // UPDATED: Get categories by course ID - Now with better error logging
  getCategoriesByCourse(courseId: number): Observable<Category[]> {
    console.log(`Fetching subcategories for course ID: ${courseId} from ${this.apiUrl}/course/${courseId}`);
    return this.http.get<{success: boolean, data: Category[]}>(
      `${this.apiUrl}/course/${courseId}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => console.log(`Get categories for course ${courseId} response:`, response)),
      map(response => response.data),
      catchError(error => {
        console.error(`Error fetching categories for course ${courseId}:`, error);
        console.error('Full error object:', JSON.stringify(error));
        return throwError(() => new Error(`Unable to fetch categories for course ${courseId}`));
      })
    );
  }

  // Get category by ID
  getCategoryById(categoryId: number): Observable<Category> {
    return this.http.get<{success: boolean, data: Category}>(
      `${this.apiUrl}/${categoryId}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => console.log(`Get category ${categoryId} response:`, response)),
      map(response => response.data),
      catchError(error => {
        console.error(`Error fetching category ${categoryId}:`, error);
        return throwError(() => new Error(`Unable to fetch category ${categoryId}`));
      })
    );
  }

  // Create a new category
  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<{success: boolean, data: Category, message: string}>(
      this.apiUrl,
      category,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => console.log('Create category response:', response)),
      map(response => response.data),
      catchError(error => {
        console.error('Error creating category:', error);
        return throwError(() => new Error(error.error?.message || 'Unable to create category'));
      })
    );
  }

  // Update a category
  updateCategory(categoryId: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<{success: boolean, data: Category, message: string}>(
      `${this.apiUrl}/${categoryId}`,
      category,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => console.log(`Update category ${categoryId} response:`, response)),
      map(response => response.data),
      catchError(error => {
        console.error(`Error updating category ${categoryId}:`, error);
        return throwError(() => new Error(error.error?.message || `Unable to update category ${categoryId}`));
      })
    );
  }

  // Delete a category
  deleteCategory(categoryId: number): Observable<{id: number, message: string}> {
    return this.http.delete<{success: boolean, data: {id: number}, message: string}>(
      `${this.apiUrl}/${categoryId}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => console.log(`Delete category ${categoryId} response:`, response)),
      map(response => ({
        id: response.data.id,
        message: response.message
      })),
      catchError(error => {
        console.error(`Error deleting category ${categoryId}:`, error);
        return throwError(() => new Error(error.error?.message || `Unable to delete category ${categoryId}`));
      })
    );
  }
}