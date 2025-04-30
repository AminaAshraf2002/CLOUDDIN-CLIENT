// src/app/guards/auth.guard.ts

import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if the user is logged in
    if (this.authService.hasToken()) {
      // User is logged in, allow access
      return true;
    }
    
    // User is not logged in, redirect to login page
    this.router.navigate(['/admin/login'], {
      // Optional: Store the attempted URL for redirecting after login
      queryParams: { returnUrl: state.url }
    });
    
    return false;
  }
}