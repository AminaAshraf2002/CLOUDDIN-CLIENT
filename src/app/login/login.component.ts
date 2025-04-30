import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

// Strongly typed interfaces for better type safety
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Expanded type for login reasons to provide more context
type LoginReason = 'pending' | 'inactive' | 'not_authenticated' | 'session_expired';

// Interface for user response to improve type safety
interface UserResponse {
  user: {
    role: string;
    status: string;
    isApproved?: boolean;
  };
  token?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Strongly typed login data model
  loginData: LoginCredentials = {
    email: '',
    password: '',
    rememberMe: false
  };

  // Typed error and UI state properties
  errorMessage: string = '';
  isLoading: boolean = false;
  
  // Security and UX features
  showPassword: boolean = false;
  loginAttempts: number = 0;
  readonly MAX_LOGIN_ATTEMPTS: number = 3;

  // Predefined login reason messages for type safety
  private readonly REASON_MESSAGES: Record<LoginReason, string> = {
    'pending': 'Your account is pending admin approval. Please wait.',
    'inactive': 'Your account is currently inactive. Please contact support.',
    'not_authenticated': 'Please log in to access this page.',
    'session_expired': 'Your session has expired. Please log in again.'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.restoreRememberedCredentials();
    this.checkLoginRedirectReason();
    // Add debug logs to check current state
    console.log('LoginComponent initialized');
  }

  // Method to generate dynamic aria-label for password visibility toggle
  getPasswordToggleAriaLabel(): string {
    return this.showPassword ? 'Hide password' : 'Show password';
  }

  // Securely restore remembered email
  private restoreRememberedCredentials(): void {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.loginData.email = rememberedEmail;
      this.loginData.rememberMe = true;
      console.log('Restored remembered email:', this.loginData.email);
    }
  }

  // Handle login redirect reasons with type safety
  private checkLoginRedirectReason(): void {
    this.route.queryParams.subscribe(params => {
      const reason = params['reason'] as LoginReason;
      if (reason) {
        console.log('Login redirect reason:', reason);
        this.handleLoginReason(reason);
      }
    });
  }

  // Type-safe login reason handling
  private handleLoginReason(reason: LoginReason): void {
    if (reason && this.REASON_MESSAGES[reason]) {
      this.errorMessage = this.REASON_MESSAGES[reason];
    } else if (reason) {
      console.warn('Unknown login reason:', reason);
      this.errorMessage = 'An unexpected error occurred';
    }
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Comprehensive login method with error handling
  onLogin(): void {
    this.resetLoginState();
    console.log('Login attempt with:', this.loginData.email);

    if (!this.validateInput()) return;
    if (this.hasExceededLoginAttempts()) return;

    this.attemptLogin();
  }

  // Reset login-related state
  private resetLoginState(): void {
    this.errorMessage = '';
    this.isLoading = true;
  }

  // Check login attempt limits
  private hasExceededLoginAttempts(): boolean {
    if (this.loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
      this.errorMessage = 'Too many login attempts. Please try again later.';
      this.isLoading = false;
      return true;
    }
    return false;
  }

  // Attempt user login with comprehensive error handling
  private attemptLogin(): void {
    this.userService.loginUser(this.loginData).subscribe({
      next: (response: UserResponse) => {
        console.log('Login successful, response:', response);
        this.handleSuccessfulLogin(response);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.handleLoginError(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Handle successful login
  private handleSuccessfulLogin(response: UserResponse): void {
    this.loginAttempts = 0;
    this.manageRememberMe();
    
    // Check if we have a valid user object
    if (response && response.user) {
      console.log('Navigating user with role:', response.user.role, 'status:', response.user.status);
      this.navigateUser(response.user);
    } else {
      console.error('Invalid response object:', response);
      this.errorMessage = 'Invalid login response';
      this.isLoading = false;
    }
  }

  // Manage remember me functionality
  private manageRememberMe(): void {
    if (this.loginData.rememberMe) {
      localStorage.setItem('rememberedEmail', this.loginData.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  }

  // Validate login input with detailed checks
  private validateInput(): boolean {
    // Trim and validate email
    this.loginData.email = this.loginData.email.trim();
    if (!this.validateEmail()) return false;

    // Validate password
    this.loginData.password = this.loginData.password.trim();
    if (!this.validatePassword()) return false;

    return true;
  }

  // Email validation with comprehensive regex
  private validateEmail(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!this.loginData.email) {
      this.setValidationError('Please enter your email address');
      return false;
    }

    if (!emailRegex.test(this.loginData.email)) {
      this.setValidationError('Please enter a valid email address');
      return false;
    }

    return true;
  }

  // Password validation with security checks
  private validatePassword(): boolean {
    if (!this.loginData.password) {
      this.setValidationError('Please enter your password');
      return false;
    }

    // Removed length check to match backend validation
    return true;
  }

  // Set validation error message
  private setValidationError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
  }

  // Navigate user based on role and status - Updated to handle both formats
  private navigateUser(user: UserResponse['user']): void {
    if (!user) {
      this.errorMessage = 'Invalid user data';
      this.isLoading = false;
      return;
    }

    try {
      // Check for approval in either format
      const isApproved = user.status === 'approved' || user.isApproved === true;
      const role = user.role || 'user';

      console.log(`Navigating user with role: ${role}, approved: ${isApproved}`);

      if (isApproved) {
        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/user/dashboard']);
        }
      } else {
        // Handle unapproved user
        this.errorMessage = 'Your account is pending approval by an administrator';
        this.isLoading = false;
      }
    } catch (error) {
      console.error('Navigation error:', error);
      this.errorMessage = 'An unexpected error occurred during navigation';
      this.isLoading = false;
    }
  }

  // Comprehensive login error handling - Updated to handle backend errors
  private handleLoginError(error: any): void {
    console.error('Login Error Details:', error);

    // Increment login attempts
    this.loginAttempts++;
    
    // Check if the error is an Error object with a message
    if (error instanceof Error) {
      this.errorMessage = error.message;
    }
    // Handle HTTP response errors
    else if (error.status) {
      const errorMessages: Record<number, string> = {
        400: 'Invalid request. Please check your login details.',
        401: 'Invalid email or password. Please try again.',
        403: error.error?.message || 'Your account requires approval or is inactive.',
        404: 'Login service not found. Please try again later.',
        500: 'Server error. Please try again later.',
        0: 'Network error. Please check your internet connection.'
      };
      
      this.errorMessage = errorMessages[error.status] || 'An unexpected error occurred. Please try again.';
      
      // Special handling for pending approval
      if (error.error?.isPending) {
        this.errorMessage = 'Your account is pending approval by an administrator.';
      }
    } 
    // Fallback error message
    else {
      this.errorMessage = 'Login failed. Please try again.';
    }
    
    this.isLoading = false;
  }

  // Navigate to admin login
  navigateToAdminLogin(): void {
    this.router.navigate(['/admin-login']);
  }
}