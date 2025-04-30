// src/app/admin-login/admin-login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  adminLoginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onAdminLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    // Check basic form validation
    if (!this.adminLoginData.email || !this.adminLoginData.password) {
      this.errorMessage = 'Please enter both email and password';
      this.isLoading = false;
      return;
    }

    this.authService.login({
      email: this.adminLoginData.email,
      password: this.adminLoginData.password
    }).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        
        // If remember me is checked, we could implement additional logic here
        // such as using a more persistent storage method
        
        // Navigate to admin dashboard
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        console.error('Login error', error);
        this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}