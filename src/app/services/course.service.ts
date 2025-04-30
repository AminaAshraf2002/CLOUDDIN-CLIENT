import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

// Import the model Course interface for consistency
import { Course as ModelCourse } from '../shared/models/course.model';

// API response interfaces - what comes back from your backend
export interface Course {
  id: number;
  title: string;
  description?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  instructor?: string;
  thumbnail?: string;
  progress?: number;
  subcategories?: any[]; // Added to match backend response
  totalLessons?: number; // Added to match backend response
}

export interface Subcategory {
  id: number;
  title: string;
  courseId: number;
  description?: string;
  thumbnail?: string; // Added thumbnail property to match the shared model
  lessonCount?: number; // Added to match backend response
}

export interface Lesson {
  id: number;
  day: number;
  title: string;
  description: string;
  videoUrl?: string;
  topics?: string[];
  categoryId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'https://clouddin.onrender.com/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Helper method to get auth headers
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
  }

  // Private error handler method
  private handleError(error: any) {
    console.error('An error occurred:', error);

    // Check for unauthorized access
    if (error.status === 401) {
      // Clear authentication data
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('token');
      
      // Redirect to login page
      this.router.navigate(['/login']);
    }

    // Return a user-friendly error message
    return throwError(() => new Error(
      error.error?.message || 
      'Unable to complete the operation. Please try again.'
    ));
  }

  // Retrieve all courses
  getCourses(): Observable<Course[]> {
    return this.http.get<{success: boolean, data: Course[]}>(`${this.apiUrl}/course/courses`).pipe(
      tap(response => console.log('Courses response:', response)),
      map(response => response.data),
      catchError(this.handleError.bind(this))
    );
  }

  // Get a specific course by its ID
  getCourseById(courseId: number): Observable<Course> {
    return this.http.get<{success: boolean, data: Course}>(`${this.apiUrl}/course/courses/${courseId}`).pipe(
      tap(response => console.log(`Course ${courseId} response:`, response)),
      map(response => response.data),
      catchError(this.handleError.bind(this))
    );
  }

  // Get subcategories for a specific course
  getSubcategoriesForCourse(courseId: number): Observable<Subcategory[]> {
    return this.http.get<{success: boolean, data: Subcategory[]}>(`${this.apiUrl}/subcategories/course/${courseId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log(`Subcategories for course ${courseId} response:`, response)),
      map(response => response.data),
      catchError(this.handleError.bind(this))
    );
  }

  // Get a specific subcategory by ID
  getSubcategoryById(subcategoryId: number): Observable<Subcategory> {
    return this.http.get<{success: boolean, data: Subcategory}>(`${this.apiUrl}/subcategories/${subcategoryId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log(`Subcategory ${subcategoryId} response:`, response)),
      map(response => response.data),
      catchError(this.handleError.bind(this))
    );
  }

  // Get lessons for a specific subcategory
  getLessonsForSubcategory(subcategoryId: number): Observable<Lesson[]> {
    return this.http.get<{success: boolean, data: Lesson[]}>(`${this.apiUrl}/lessons/subcategory/${subcategoryId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log(`Lessons for subcategory ${subcategoryId} response:`, response)),
      map(response => response.data.map(lesson => ({
        ...lesson,
        videoUrl: lesson.videoUrl || '' // Ensure videoUrl is always a string
      }))),
      catchError(this.handleError.bind(this))
    );
  }

  // Get user's enrolled course - FIXED: Updated with the correct API endpoint
  getUserCourse(): Observable<ModelCourse> {
    // Get user token from localStorage
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });

    // Debug log to verify the URL being requested
    console.log('About to request user course from:', `${this.apiUrl}/course/user/course`);
    
    // FIXED: Changed endpoint to match the backend route structure
    return this.http.get<{success: boolean, data: Course}>(`${this.apiUrl}/course/user/course`, {
      headers: headers
    }).pipe(
      tap(response => console.log('User course response:', response)),
      map(response => {
        // Transform the API Course to match the ModelCourse interface
        const apiCourse = response.data;
        
        // Create a compatible ModelCourse object with all required properties
        const modelCourse: ModelCourse = {
          id: apiCourse.id,
          title: apiCourse.title,
          lessons: apiCourse.totalLessons || 0, // Use totalLessons from the API response
          thumbnail: apiCourse.thumbnail || 'assets/images/default-course.jpg',
          subcategories: apiCourse.subcategories?.map(sub => ({
            id: sub.id,
            title: sub.title,
            description: sub.description,
            lessons: [], // Initialize with empty array, will be populated later if needed
            thumbnail: sub.thumbnail || 'assets/images/default-thumbnail.jpg'
          })) || [], 
          description: apiCourse.description || '',
          instructor: apiCourse.instructor || '',
          progress: apiCourse.progress || 0,
          level: apiCourse.level
        };
        
        return modelCourse;
      }),
      catchError(error => {
        console.error('Error fetching user course:', error);
        return this.handleError(error);
      })
    );
  }
}