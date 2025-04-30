// src/app/guards/user-auth.guard.ts
import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Retrieve the current user from local storage or service
    const user = this.getUserFromStorage();

    // Check if user exists and is approved
    if (user && user.role === 'user' && user.status === 'approved') {
      return true;
    }

    // If not authorized, redirect to login
    this.router.navigate(['/login'], {
      queryParams: { 
        returnUrl: state.url,
        reason: user ? user.status : 'not_logged_in'
      }
    });
    
    return false;
  }

  // Helper method to get user from storage
  private getUserFromStorage(): any {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (error) {
        console.error('Error parsing user data', error);
        return null;
      }
    }
    return null;
  }
}