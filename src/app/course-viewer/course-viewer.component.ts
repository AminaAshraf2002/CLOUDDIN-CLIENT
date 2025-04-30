import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../services/course.service';
import { CategoryService } from '../services/category.service';
// Import types directly from service - this ensures type compatibility
import { Course, Subcategory } from '../services/course.service';
import { Category } from '../services/category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-course-viewer',
  templateUrl: './course-viewer.component.html',
  styleUrls: ['./course-viewer.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CourseViewerComponent implements OnInit, OnDestroy {
  courseId: number = 0;
  course: Course | null = null;
  subcategories: (Subcategory | Category)[] = []; 
  userName: string = 'User';
  selectedCourse: string = 'Not Specified';
  isLoading: boolean = true;
  error: string | null = null;
  private routeSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // Get course ID from route parameters
    this.routeSubscription = this.route.params.subscribe(params => {
      this.courseId = +params['id']; // Convert to number
      this.loadCourseData();
      this.loadUserData();
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadUserData(): void {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        this.userName = user.name || 'User';
        this.selectedCourse = user.course || 'Not Specified';
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  loadCourseData(): void {
    this.isLoading = true;
    this.error = null;

    // First, load the course
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        // Assign the course directly
        this.course = course;
        console.log('Loaded course:', course);
        
        // Then, load subcategories separately from the API
        this.loadSubcategories();
      },
      error: (err) => {
        console.error('Error loading course:', err);
        this.error = err.message || 'Failed to load course';
        this.isLoading = false;
      }
    });
  }

  loadSubcategories(): void {
    // Try both service methods to see which one works
    this.tryLoadingSubcategoriesWithCourseService();
  }

  tryLoadingSubcategoriesWithCourseService(): void {
    this.courseService.getSubcategoriesForCourse(this.courseId).subscribe({
      next: (subcategories) => {
        this.subcategories = subcategories;
        this.processSubcategories();
        this.isLoading = false;
        console.log('Successfully loaded subcategories with CourseService:', subcategories);
      },
      error: (err) => {
        console.error('Error loading subcategories with CourseService:', err);
        // If CourseService fails, try CategoryService as fallback
        this.tryLoadingSubcategoriesWithCategoryService();
      }
    });
  }

  tryLoadingSubcategoriesWithCategoryService(): void {
    this.categoryService.getCategoriesByCourse(this.courseId).subscribe({
      next: (categories) => {
        this.subcategories = categories;
        this.processSubcategories();
        this.isLoading = false;
        console.log('Successfully loaded subcategories with CategoryService:', categories);
      },
      error: (err) => {
        console.error('Error loading subcategories with CategoryService:', err);
        this.error = 'Failed to load course content. Please try again.';
        this.isLoading = false;
      }
    });
  }

  processSubcategories(): void {
    // Add default thumbnails if not provided
    this.subcategories.forEach(subcategory => {
      // Use type guard to check if thumbnail property exists
      if ('thumbnail' in subcategory) {
        if (!subcategory.thumbnail) {
          subcategory.thumbnail = this.getDefaultThumbnail(subcategory.title);
        }
      } else {
        // Add thumbnail property if it doesn't exist
        (subcategory as any).thumbnail = this.getDefaultThumbnail(subcategory.title);
      }
    });
  }

  // Method to get default thumbnail based on subcategory title
  getDefaultThumbnail(title: string): string {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('logo')) {
      return 'assets/images/default-logo-design.jpg';
    } else if (titleLower.includes('brochure')) {
      return 'assets/images/default-brochure-design.jpg';
    } else if (titleLower.includes('business card')) {
      return 'assets/images/default-business-card-design.jpg';
    } else if (titleLower.includes('website') || titleLower.includes('web')) {
      return 'assets/images/default-web-design.jpg';
    }
    
    // Fallback default thumbnail
    return 'assets/images/default-course-thumbnail.jpg';
  }

  // Method to handle back navigation
  goBack(): void {
    // Navigate to user dashboard or previous page
    this.router.navigate(['/user/dashboard']);
  }

  // Method to retry loading if there's an error
  retryLoading(): void {
    this.loadCourseData();
  }

  startLearning(subcategoryId: number): void {
    this.router.navigate(['/user/lesson', this.courseId, subcategoryId]);
  }

  getUserInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }
}