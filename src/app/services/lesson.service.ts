import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Lesson {
  _id?: string;  // MongoDB's unique identifier
  id?: number;   // Your custom ID
  day: number;
  title: string;
  description: string;
  videoUrl?: string;
  topics?: string[];
  duration?: string;
  subcategoryId?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = 'https://clouddin.onrender.com/api/lessons';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Validate subcategory ID - ensure it returns a number
  private validateSubcategoryId(subcategoryId: number | string): number {
    const id = typeof subcategoryId === 'string' 
      ? parseInt(subcategoryId, 10) 
      : subcategoryId;
    
    if (isNaN(id) || id <= 0) {
      console.error('Invalid subcategory ID:', subcategoryId);
      throw new Error('Invalid subcategory ID');
    }
    
    return id;
  }

  // Validate lesson ID - returns number for numeric IDs
  private validateLessonId(lessonId: number | string): number | string {
    // If it's a string with length > 10, assume it's a MongoDB _id
    if (typeof lessonId === 'string' && lessonId.length > 10) {
      return lessonId;
    }

    // If it's a numeric ID
    if (typeof lessonId === 'number') {
      if (isNaN(lessonId) || lessonId <= 0) {
        console.error('Invalid lesson ID:', lessonId);
        throw new Error('Invalid lesson ID');
      }
      return lessonId;
    }

    // Try parsing string to number
    const numericId = parseInt(lessonId, 10);
    
    if (!isNaN(numericId) && numericId > 0) {
      return numericId;
    }

    console.error('Invalid lesson ID:', lessonId);
    throw new Error('Invalid lesson ID');
  }

  // Get lessons for a subcategory
  getLessonsByCategory(subcategoryId: number | string): Observable<Lesson[]> {
    const validSubcategoryId = this.validateSubcategoryId(subcategoryId);

    return this.http.get<ApiResponse<Lesson[]>>(
      `${this.apiUrl}/subcategory/${validSubcategoryId}`
    ).pipe(
      tap(response => console.log(`Get lessons for subcategory ${validSubcategoryId} response:`, response)),
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch lessons');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  // Get lesson by ID
  getLessonById(subcategoryId: number | string, lessonId: number | string): Observable<Lesson> {
    const validSubcategoryId = this.validateSubcategoryId(subcategoryId);
    const validLessonId = this.validateLessonId(lessonId);

    console.log('Fetching Lesson:', { 
      subcategoryId: validSubcategoryId, 
      lessonId: validLessonId 
    });

    return this.http.get<ApiResponse<Lesson>>(
      `${this.apiUrl}/subcategory/${validSubcategoryId}/lesson/${validLessonId}`
    ).pipe(
      tap(response => console.log(`Get lesson ${validLessonId} response:`, response)),
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch lesson');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  // Create a new lesson
  createLesson(subcategoryId: number | string, lesson: Partial<Lesson>): Observable<Lesson> {
    // Validate subcategory ID
    const validSubcategoryId = this.validateSubcategoryId(subcategoryId);

    // Validate required fields
    this.validateLessonInput(lesson);

    // Sanitize input
    const sanitizedLesson = this.sanitizeLessonInput(lesson);

    return this.http.post<ApiResponse<Lesson>>(
      `${this.apiUrl}/subcategory/${validSubcategoryId}`,
      sanitizedLesson,
      { headers: this.authService.createAuthHeaders() }
    ).pipe(
      tap(response => console.log('Create lesson response:', response)),
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to create lesson');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  // Update a lesson
  updateLesson(
    subcategoryId: number | string, 
    lessonId: number | string, 
    lesson: Partial<Lesson>
  ): Observable<Lesson> {
    // Validate IDs
    const validSubcategoryId = this.validateSubcategoryId(subcategoryId);
    const validLessonId = this.validateLessonId(lessonId);

    // Validate required fields
    this.validateLessonInput(lesson);

    // Sanitize input
    const sanitizedLesson = this.sanitizeLessonInput(lesson);

    return this.http.put<ApiResponse<Lesson>>(
      `${this.apiUrl}/subcategory/${validSubcategoryId}/lesson/${validLessonId}`,
      sanitizedLesson,
      { headers: this.authService.createAuthHeaders() }
    ).pipe(
      tap(response => console.log(`Update lesson ${validLessonId} response:`, response)),
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to update lesson');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  // Delete a lesson
  deleteLesson(
    subcategoryId: number | string, 
    lessonId: number | string
  ): Observable<{id: number, message: string}> {
    // Validate IDs
    const validSubcategoryId = this.validateSubcategoryId(subcategoryId);
    const validLessonId = this.validateLessonId(lessonId);

    return this.http.delete<ApiResponse<{id: number}>>(
      `${this.apiUrl}/subcategory/${validSubcategoryId}/lesson/${validLessonId}`,
      { headers: this.authService.createAuthHeaders() }
    ).pipe(
      tap(response => console.log(`Delete lesson ${validLessonId} response:`, response)),
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete lesson');
        }
        return {
          id: response.data.id,
          message: 'Lesson deleted successfully'
        };
      }),
      catchError(this.handleError)
    );
  }

  // Validate lesson input
  private validateLessonInput(lesson: Partial<Lesson>): void {
    if (!lesson.day) {
      throw new Error('Day is required');
    }

    if (!lesson.title || lesson.title.trim() === '') {
      throw new Error('Title is required');
    }

    if (!lesson.description || lesson.description.trim() === '') {
      throw new Error('Description is required');
    }
  }

  // Sanitize lesson input
  private sanitizeLessonInput(lesson: Partial<Lesson>): Partial<Lesson> {
    return {
      ...lesson,
      day: parseInt(String(lesson.day), 10),
      title: lesson.title?.trim(),
      description: lesson.description?.trim(),
      topics: Array.isArray(lesson.topics) 
        ? lesson.topics.filter(topic => topic && topic.trim() !== '')
        : [],
      videoUrl: lesson.videoUrl ? lesson.videoUrl.trim() : '',
      duration: lesson.duration ? lesson.duration.trim() : '45 minutes'
    };
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    
    // Check for specific error messages from backend
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return throwError(() => new Error(
        error.error.message || 'Network error. Please try again.'
      ));
    }
    
    // Backend returned an unsuccessful response
    return throwError(() => new Error(
      error.error?.message || 
      'Unable to complete the operation. Please check your input and try again.'
    ));
  }
}