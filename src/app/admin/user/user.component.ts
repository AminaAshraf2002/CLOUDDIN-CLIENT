import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  // Core data management arrays
  users: User[] = [];           // Complete list of users
  filteredUsers: User[] = [];   // Users after applying filters

  // Filter and search properties
  statusFilter: string = 'all';
  courseFilter: string = 'all';
  searchTerm: string = '';

  // State management properties
  isLoading: boolean = false;
  errorMessage: string = '';

  // Predefined filter options
  statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'inactive', label: 'Inactive' }
  ];

  courseOptions = [
    { value: 'all', label: 'All Courses' },
    { value: 'Digital Marketing', label: 'Digital Marketing' },
    { value: 'Graphic Design', label: 'Graphic Design' },
    { value: 'Ecommerce Mastery', label: 'Ecommerce Mastery' }
  ];

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.group('User Component Initialization');
    console.log('Initializing User Management Component');
    this.loadUsers();
    console.groupEnd();
  }

  // Comprehensive user loading method
  loadUsers(): void {
    // Reset component state
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        console.group('User Loading Process');
        console.log('Total Users Fetched:', users.length);
        
        // Enhanced logging that checks if each user has an ID
        users.forEach((user, index) => {
          // Check if user has an id property
          if (!user.id) {
            console.warn(`User at index ${index} is missing an ID property!`, user);
          }
          
          console.log(`User ${index + 1} Details:
            - ID: ${user.id || 'MISSING'}
            - Name: ${user.name}
            - Email: ${user.email}
            - Status: ${user.status}
            - Course: ${user.course}
          `);
        });

        // Count and log users by status
        const statusCounts = {
          pending: users.filter(u => u.status === 'pending').length,
          approved: users.filter(u => u.status === 'approved').length,
          inactive: users.filter(u => u.status === 'inactive').length
        };
        console.log('User Status Breakdown:', statusCounts);
        console.groupEnd();

        // Store and process users
        this.users = users;
        this.statusFilter = 'all';
        this.applyFilters();

        // Complete loading process
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.group('User Loading Error');
        console.error('Detailed Error:', error);
        
        this.errorMessage = `Failed to load users: ${
          error.message || 'Unknown error occurred'
        }`;
        
        this.isLoading = false;
        this.cdr.detectChanges();
        console.groupEnd();
      }
    });
  }

  // Debug helper method
  getDebugInfo(user: any): string {
    if (!user) return 'User is undefined';
    return `ID: ${user.id || 'missing'} (${typeof user.id})`;
  }

  // Enhanced user approval method with better debugging
  approveUser(userId: string): void {
    console.group('User Approval Process');
    console.log('Attempting to approve user:', userId);
    console.log('User ID type:', typeof userId);
    
    // More detailed validation
    if (!userId) {
      console.error('Invalid User ID: Cannot approve user');
      console.log('Current filteredUsers array:', this.filteredUsers);
      this.errorMessage = 'Invalid user selection';
      console.groupEnd();
      return;
    }

    // Start approval process
    this.isLoading = true;
    this.errorMessage = '';

    console.log(`Making API call to approve user with ID: ${userId}`);
    
    this.userService.approveUser(userId).subscribe({
      next: (approvedUser) => {
        console.log('Approval Response:', approvedUser);

        // Update local users array
        this.users = this.users.map(user => 
          user.id === userId 
            ? { ...user, status: 'approved' } 
            : user
        );

        // Reset filters and reapply
        this.statusFilter = 'all';
        this.applyFilters();

        // Reset loading state
        this.isLoading = false;
        this.cdr.detectChanges();

        console.log(`User ${userId} successfully approved`);
        console.groupEnd();
      },
      error: (error) => {
        console.error('Approval Error:', error);
        this.errorMessage = `Failed to approve user: ${error.message || 'Unknown error'}`;
        this.isLoading = false;
        this.cdr.detectChanges();
        console.groupEnd();
      }
    });
  }

  // Delete user method with improved error handling
  deleteUser(userId: string): void {
    console.group('User Deletion Process');
    console.log('Attempting to delete user:', userId);
    
    if (!userId) {
      console.error('Invalid User ID: Cannot delete user');
      this.errorMessage = 'Invalid user selection';
      console.groupEnd();
      return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
      this.isLoading = true;
      this.errorMessage = '';
      
      console.log(`Making API call to delete user with ID: ${userId}`);
      
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          console.log(`User ${userId} successfully deleted`);
          
          // Remove user from local array
          this.users = this.users.filter(u => u.id !== userId);
          this.applyFilters();
          
          this.isLoading = false;
          this.cdr.detectChanges();
          console.groupEnd();
        },
        error: (error) => {
          console.error('Delete User Error:', error);
          this.errorMessage = `Failed to delete user: ${error.message || 'Unknown error'}`;
          this.isLoading = false;
          this.cdr.detectChanges();
          console.groupEnd();
        }
      });
    } else {
      console.log('User cancelled deletion');
      console.groupEnd();
    }
  }

  // Comprehensive filtering method
  applyFilters(): void {
    console.group('User Filtering');
    console.log('Current Filters:', {
      status: this.statusFilter,
      course: this.courseFilter,
      search: this.searchTerm
    });

    this.filteredUsers = this.users.filter(user => {
      const statusMatch = 
        this.statusFilter === 'all' || 
        user.status === this.statusFilter;

      const courseMatch = 
        this.courseFilter === 'all' || 
        user.course === this.courseFilter;

      const searchMatch = 
        !this.searchTerm || 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      return statusMatch && courseMatch && searchMatch;
    });

    console.log('Filtered Users Count:', this.filteredUsers.length);
    console.groupEnd();
  }
}