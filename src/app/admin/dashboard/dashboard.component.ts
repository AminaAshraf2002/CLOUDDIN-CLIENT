import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  adminName: string = 'Admin'; // Default fallback value
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    // Get the admin name when component initializes
    const storedAdmin = this.authService.getStoredAdmin();
    if (storedAdmin && storedAdmin.name) {
      this.adminName = storedAdmin.name;
    }
    
    // Stay updated with any changes to admin information
    this.authService.currentAdmin$.subscribe(admin => {
      if (admin && admin.name) {
        this.adminName = admin.name;
      }
    });
  }
  
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Successful logout handling is managed in the service
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Still navigate to login page even if API call fails
        window.location.href = '/admin-login';
      }
    });
  }
}