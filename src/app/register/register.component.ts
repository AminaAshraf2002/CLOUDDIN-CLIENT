import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Registration data model with enhanced typing
  registerData: {
    name: string;
    email: string;
    password: string;
    courseName: string;
    rememberMe: boolean;
  } = {
    name: '',
    email: '',
    password: '',
    courseName: '',
    rememberMe: false
  };

  // Enhanced error handling
  errorMessages: {
    name?: string;
    email?: string;
    password?: string;
    courseName?: string;
    general?: string;
  } = {};

  // Course mapping with more detailed type
  courseMap: { 
    [key: string]: { 
      id: number; 
      name: string; 
      description?: string 
    } 
  } = {
    'ecommerce': { 
      id: 1, 
      name: 'eCommerce Mystery',
      description: 'Master online selling strategies'
    },
    'marketing': { 
      id: 2, 
      name: 'Digital Marketing',
      description: 'Learn modern marketing techniques'
    },
    'design': { 
      id: 3, 
      name: 'Graphic Designing',
      description: 'Create stunning visual content'
    }
  };

  isLoading = false;
  successMessage = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Optional: Reset any stored data on component initialization
    localStorage.removeItem('pendingRegistration');
  }

  // Enhanced validation method
  validateForm(): boolean {
    // Reset previous error messages
    this.errorMessages = {};

    // Comprehensive validation
    if (!this.registerData.name || this.registerData.name.length < 3) {
      this.errorMessages.name = 'Name must be at least 3 characters long';
    }

    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.registerData.email || !emailRegex.test(this.registerData.email)) {
      this.errorMessages.email = 'Please enter a valid email address';
    }

    // Password strength validation
    if (!this.registerData.password || this.registerData.password.length < 8) {
      this.errorMessages.password = 'Password must be at least 8 characters long';
    }

    if (!this.registerData.courseName) {
      this.errorMessages.courseName = 'Please select a course';
    }

    if (!this.registerData.rememberMe) {
      this.errorMessages.general = 'You must agree to the Terms & Conditions';
    }

    // Return true if no errors
    return Object.keys(this.errorMessages).length === 0;
  }

  // Refined registration method
  onRegister(): void {
    // Reset previous messages
    this.successMessage = '';
    
    // Validate form first
    if (!this.validateForm()) {
      return;
    }

    // Set loading state
    this.isLoading = true;

    // Prepare course data
    const selectedCourse = this.courseMap[this.registerData.courseName] || 
      { id: 1, name: this.registerData.courseName };

    // Prepare user data for API
    const userData = {
      name: this.registerData.name,
      email: this.registerData.email,
      password: this.registerData.password,
      courseName: selectedCourse.name,
      courseId: selectedCourse.id
    };

    // API call with comprehensive error handling
    this.http.post('https://clouddin.onrender.com/api/users/register', userData)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Registration successful! Redirecting to payment...';
          
          // Store registration info temporarily
          localStorage.setItem('pendingRegistration', JSON.stringify({
            name: this.registerData.name,
            email: this.registerData.email,
            course: userData.courseName
          }));

          // Delayed WhatsApp redirection
          setTimeout(() => {
            this.redirectToWhatsApp(userData.courseName);
          }, 2000);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          
          // Detailed error handling
          if (error.error instanceof ErrorEvent) {
            // Client-side errors
            this.errorMessages.general = 'Network error. Please check your connection.';
          } else {
            // Server-side errors
            this.errorMessages.general = error.error?.message || 
              'Registration failed. Please try again later.';
          }
          console.error('Registration error:', error);
        }
      });
  }

  // WhatsApp redirection method
  redirectToWhatsApp(courseName: string): void {
    const message = `Hello! I've registered for the ${courseName} course. My name is ${this.registerData.name}. I'd like to proceed with payment.`;
    
    const whatsappUrl = `https://wa.me/916238413745?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    this.router.navigate(['/login']);
  }

  // Course selection handler
  onCourseSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.registerData.courseName = selectElement.value;
  }

  // Navigation to login
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}