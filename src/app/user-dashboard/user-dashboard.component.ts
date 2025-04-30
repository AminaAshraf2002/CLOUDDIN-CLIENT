import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CourseService } from '../services/course.service';
// Import the Course type from your shared models
import { Course } from '../shared/models/course.model';

interface User {
  id: string;
  name: string;
  email: string;
  course: string;
  courseId?: number;
  role: string;
  status: string;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  // Default values in case user data isn't available
  userName: string = 'User';
  selectedCourse: string = 'Not Specified';
  courseId?: number;
  
  // This will hold the user's enrolled course
  userCourses: Course[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  defaultThumbnail: string = 'assets/images/default-course.jpg';

  constructor(
    private router: Router,
    private courseService: CourseService
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    this.loadUserCourses();
  }

  // Load user data from localStorage
  loadUserData(): void {
    try {
      // Get the user data from localStorage
      const userData = localStorage.getItem('user');
      
      if (userData) {
        // Parse the JSON string into an object
        const user = JSON.parse(userData) as User;
        
        // Update component properties with user data
        this.userName = user.name || 'User';
        this.selectedCourse = user.course || 'Not Specified';
        this.courseId = user.courseId;
        
        console.log('Loaded user data:', user);
      } else {
        console.warn('No user data found in localStorage');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  // Load user's course from the API - FIXED: Using the correct method
  loadUserCourses(): void {
    this.isLoading = true;
    this.error = null;
    
    // Instead of trying to access /api/user/course, we use getUserCourse() method
    // which accesses the correct endpoint /api/course/user/course
    this.courseService.getUserCourse().subscribe({
      next: (course) => {
        // Our service now returns a ModelCourse with all required properties
        this.userCourses = course ? [course] : [];
        
        // Update the selectedCourse variable with the actual course title
        if (course) {
          this.selectedCourse = course.title;
        }
        
        this.isLoading = false;
        console.log('Loaded user course:', course);
      },
      error: (err) => {
        console.error('Error loading user course:', err);
        this.error = err.message || 'Failed to load your course';
        this.isLoading = false;
        
        // If there's an error, clear the userCourses array
        this.userCourses = [];
      }
    });
  }

  // Get user's initial for avatar
  getUserInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  // Check if thumbnail exists and return a valid image URL
  getThumbnailUrl(course: Course): string {
    if (course && course.thumbnail) {
      // Check if the thumbnail starts with http:// or https:// (external URL)
      // Or if it starts with assets/ (local asset)
      if (course.thumbnail.startsWith('http://') || 
          course.thumbnail.startsWith('https://') ||
          course.thumbnail.startsWith('assets/')) {
        return course.thumbnail;
      }
    }
    // Return default image if thumbnail is missing or invalid
    return this.defaultThumbnail;
  }

  continueCourse(courseId: number): void {
    this.router.navigate(['/user/course', courseId]);
  }
}