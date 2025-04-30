import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

// Course Type Definition
export type CourseType = 'Digital Marketing' | 'Graphic Design' | 'Ecommerce Mastery';

// Category Interface
export interface Category {
  id?: number;
  name: string;
  description: string;
  course: CourseType;
  instructor: string;
  duration: string;
  lessons: number;
  thumbnail: string;
  courseId?: number;
}

// Course Interface
export interface Course {
  id: number;
  title: string;
}

// API Response Interface
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  // Categories Data
  categories: Category[] = [];
  courses: Course[] = [];
  
  // UI state properties
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isAuthError: boolean = false;
  authChecking: boolean = true;

  // Search and Filter Properties
  searchTerm: string = '';
  selectedCourse: CourseType | '' = '';

  // Pagination Properties
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // Modal Control Properties
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  currentCategory: Category | null = null;

  private apiUrl = 'https://clouddin.onrender.com/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check for valid token before loading data
    setTimeout(() => {
      this.authChecking = false;
      
      if (!this.isAuthenticated()) {
        this.errorMessage = 'Token is invalid. Please login again.';
        this.isAuthError = true;
        return;
      }
      
      this.loadCourses();
      this.loadCategories();
    }, 500);
  }

  // Check if user is authenticated
  private isAuthenticated(): boolean {
    const token = localStorage.getItem('adminToken');
    // Basic validation - check if token exists and is not empty
    return !!token && token.length > 10;
  }

  // Navigate to login page
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Logout handler
  logout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  // Get auth headers with error handling
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      this.errorMessage = 'Authentication token not found. Please login again.';
      this.isAuthError = true;
      throw new Error('No authentication token');
    }
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Handle token refresh or retry on auth errors
  private handleAuthError(): void {
    // Clear the invalid token
    localStorage.removeItem('adminToken');
    this.errorMessage = 'Your session has expired. Please login again.';
    this.isAuthError = true;
    
    // Redirect to login
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  // Load courses from API
  loadCourses(): void {
    this.loading = true;
    
    try {
      const headers = this.getHeaders();
      
      this.http.get<ApiResponse<Course[]>>(`${this.apiUrl}/course/courses`, { headers })
        .subscribe({
          next: (response) => {
            if (response && response.success) {
              this.courses = response.data || [];
              this.loading = false;
            } else {
              this.errorMessage = response?.message || 'Failed to load courses';
              this.loading = false;
            }
          },
          error: (error) => {
            console.error('Error loading courses:', error);
            
            if (error.status === 401 || error.status === 403) {
              this.handleAuthError();
            } else {
              this.errorMessage = 'Failed to load courses';
            }
            
            this.loading = false;
          }
        });
    } catch (e) {
      this.loading = false;
      // Error message already set in getHeaders
    }
  }

  // Load categories from API
  loadCategories(): void {
    this.loading = true;
    let url = `${this.apiUrl}/subcategories/all`;
    
    if (this.selectedCourse) {
      url = `${this.apiUrl}/subcategories/course/${this.selectedCourse}`;
    }

    try {
      const headers = this.getHeaders();
      
      this.http.get<ApiResponse<any[]>>(url, { headers })
        .subscribe({
          next: (response) => {
            if (response && response.success) {
              if (!response.data || !Array.isArray(response.data)) {
                this.categories = [];
                this.loading = false;
                return;
              }
              
              this.categories = response.data.map(item => ({
                id: item.id,
                name: item.name || item.title || 'Unnamed Category',
                description: item.description || '',
                course: this.determineCourseName(item.courseId),
                courseId: item.courseId,
                instructor: item.instructor || '',
                duration: item.duration || '',
                lessons: item.lessonsCount !== undefined 
                  ? item.lessonsCount 
                  : (Array.isArray(item.lessons) 
                    ? item.lessons.length 
                    : 0),
                thumbnail: item.thumbnail || item.image || 'https://via.placeholder.com/150'
              }));
              
              this.loading = false;
            } else {
              this.errorMessage = response?.message || 'Failed to load categories';
              this.loading = false;
            }
          },
          error: (error) => {
            console.error('Error loading categories:', error);
            
            if (error.status === 401 || error.status === 403) {
              this.handleAuthError();
            } else {
              this.errorMessage = 'Failed to load categories';
            }
            
            this.loading = false;
          }
        });
    } catch (e) {
      this.loading = false;
      // Error message already set in getHeaders
    }
  }

  // Refresh token method - implement if your API supports token refresh
  refreshToken(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      this.handleAuthError();
      return;
    }
    
    this.http.post<any>(`${this.apiUrl}/auth/refresh`, { refreshToken })
      .subscribe({
        next: (response) => {
          if (response && response.token) {
            localStorage.setItem('adminToken', response.token);
            // Reload the current page data
            this.loadCourses();
            this.loadCategories();
          } else {
            this.handleAuthError();
          }
        },
        error: () => {
          this.handleAuthError();
        }
      });
  }

  // Clear error message method
  clearErrorMessage(): void {
    this.errorMessage = '';
    this.isAuthError = false;
  }

  // Determine Course Name
  private determineCourseName(courseId: number): CourseType {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      const title = course.title.toLowerCase();
      if (title.includes('marketing')) return 'Digital Marketing';
      if (title.includes('design')) return 'Graphic Design';
      if (title.includes('ecommerce') || title.includes('commerce')) return 'Ecommerce Mastery';
    }
    return 'Digital Marketing';
  }

  // Get Course ID by Name
  getCourseIdByName(courseName: CourseType): number {
    const course = this.courses.find(c => {
      const title = c.title.toLowerCase();
      switch (courseName) {
        case 'Digital Marketing':
          return title.includes('marketing');
        case 'Graphic Design':
          return title.includes('design');
        case 'Ecommerce Mastery':
          return title.includes('ecommerce') || title.includes('commerce');
        default:
          return false;
      }
    });
    
    return course ? course.id : this.courses[0]?.id || 1;
  }

  // Filtered Categories Getter
  get filteredCategories(): Category[] {
    if (!this.categories || !Array.isArray(this.categories)) {
      return [];
    }
    
    return this.categories.filter(category => 
      (this.searchTerm === '' || 
       (category.name && category.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
       (category.description && category.description.toLowerCase().includes(this.searchTerm.toLowerCase()))) &&
      (this.selectedCourse === '' || category.course === this.selectedCourse)
    );
  }

  // Paginated Categories Getter
  get paginatedCategories(): Category[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCategories.slice(startIndex, endIndex);
  }

  // Total Pages Getter
  get totalPages(): number {
    return Math.ceil(this.filteredCategories.length / this.itemsPerPage);
  }

  // Pagination Methods
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Modal Management Methods
  openAddCategoryModal(): void {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.currentCategory = {
      name: '',
      description: '',
      course: 'Digital Marketing',
      instructor: '',
      duration: '',
      lessons: 0,
      thumbnail: 'https://via.placeholder.com/150'
    };
  }

  openEditCategoryModal(category: Category): void {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.currentCategory = { 
      ...category,
      instructor: category.instructor || '',
      duration: category.duration || '',
      lessons: category.lessons || 0
    };
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.currentCategory = null;
    this.errorMessage = ''; // Clear any error messages when closing the modal
    this.isAuthError = false;
  }

  // Thumbnail Preview Method
  updateThumbnailPreview(): void {
    if (!this.currentCategory?.thumbnail) {
      this.currentCategory!.thumbnail = 'https://via.placeholder.com/150';
    }
  }

  // Category Management Methods
  saveCategory(): void {
    if (!this.currentCategory) return;
    
    // Validate required fields
    if (!this.currentCategory.name || !this.currentCategory.description) {
      this.errorMessage = 'Category name and description are required';
      return;
    }
    
    this.loading = true;
    this.errorMessage = ''; // Clear previous errors
    
    // Find the correct course ID based on the selected course name
    const courseId = this.getCourseIdByName(this.currentCategory.course);

    // Map category to API format
    const apiCategory = {
      title: this.currentCategory.name,
      description: this.currentCategory.description,
      courseId: courseId,
      thumbnail: this.currentCategory.thumbnail,
      instructor: this.currentCategory.instructor,
      duration: this.currentCategory.duration,
      lessonsCount: this.currentCategory.lessons
    };
    
    try {
      const headers = this.getHeaders();
      
      if (this.isEditMode && this.currentCategory.id) {
        // Update existing category
        this.http.put<ApiResponse<any>>(
          `${this.apiUrl}/subcategories/${this.currentCategory.id}`,
          apiCategory,
          { headers }
        ).subscribe({
          next: (response) => {
            if (response && response.success) {
              this.successMessage = `Category "${this.currentCategory?.name}" updated successfully!`;
              this.loadCategories();
              this.closeModal();
            } else {
              this.errorMessage = response?.message || 'Failed to update category';
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating category:', error);
            
            if (error.status === 401 || error.status === 403) {
              this.handleAuthError();
            } else {
              this.errorMessage = error.error?.message || 'Failed to update category';
            }
            
            this.loading = false;
          }
        });
      } else {
        // Create new category
        this.http.post<ApiResponse<any>>(
          `${this.apiUrl}/subcategories`,
          apiCategory,
          { headers }
        ).subscribe({
          next: (response) => {
            if (response && response.success) {
              this.successMessage = `Category "${this.currentCategory?.name}" created successfully!`;
              this.loadCategories();
              this.closeModal();
            } else {
              this.errorMessage = response?.message || 'Failed to create category';
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error creating category:', error);
            
            if (error.status === 401 || error.status === 403) {
              this.handleAuthError();
            } else {
              this.errorMessage = error.error?.message || 'Failed to create category';
            }
            
            this.loading = false;
          }
        });
      }
    } catch (e) {
      this.loading = false;
      // Error message already set in getHeaders
    }
  }

  // Delete Category
  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.loading = true;
      
      try {
        const headers = this.getHeaders();
        
        this.http.delete<ApiResponse<any>>(
          `${this.apiUrl}/subcategories/${id}`,
          { headers }
        ).subscribe({
          next: (response) => {
            if (response && response.success) {
              this.successMessage = 'Category deleted successfully!';
              this.loadCategories();
            } else {
              this.errorMessage = response?.message || 'Failed to delete category';
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error deleting category:', error);
            
            if (error.status === 401 || error.status === 403) {
              this.handleAuthError();
            } else {
              this.errorMessage = error.error?.message || 'Failed to delete category';
            }
            
            this.loading = false;
          }
        });
      } catch (e) {
        this.loading = false;
        // Error message already set in getHeaders
      }
    }
  }

  // View Category Details (Navigate to lessons)
  viewCategoryDetails(category: Category): void {
    window.location.href = `/admin/lessons?category=${category.id}`;
  }
}