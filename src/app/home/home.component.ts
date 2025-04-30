import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

interface Course {
  title: string;
  modules: number;
  duration: string;
  description: string;
  image: string;
  badge?: 'Pro';
  category: string;
  path: string;
  author?: string;
  rating?: number;
  reviewCount?: number;
  currentPrice?: number;
  originalPrice?: number;
  isPremium?: boolean;
  lastUpdated?: string;
  level?: string;
  subtitles?: string;
  shortDescription?: string;
  features?: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatTabsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.min.css']
})
export class HomeComponent {
  
  categories: string[] = ['ALL','Ecommerce Mastery'];
  selectedCategory: string = 'ALL';

  courses: Course[] = [
    
    {
      "title": "Ecommerce Mastery",
      "modules": 6,
      "duration": "1 Month",
      "image": "assets/images/newimg.jpg",
      "description": "Ecommerce Mastery is an exceptional choice for entrepreneurs seeking to establish a thriving ecommerce store or online business. Our comprehensive program covers a wide range of topics, including dropshipping, brand building, affiliate marketing, web development, reselling, and social media marketing. By joining Ecommerce Mastery, you'll learn how to start a successful dropshipping business, develop a strong brand identity, promote products through affiliate marketing, build a professional ecommerce website, resell products online, and leverage social media platforms to drive sales, gaining the knowledge and skills necessary to succeed in the competitive ecommerce landscape",
      "badge": "Pro",
      "category": "Ecommerce Mastery",
      "path": "ecommerce-mastery",
      "author": "SARATH RENJI & RIZWAN",
      "rating": 9.9,
      "reviewCount": 3218,
      "currentPrice": 1999,
      "originalPrice": 9999,
      "isPremium": true,
      "lastUpdated": "May 2025",
      "level": "All Levels",
      "subtitles": "Malayalam",
      "shortDescription": "ECOMMERCE MASTERY is Cloudd Inn's flagship course, empowering entrepreneurs and digital marketers to launch and scale successful online businesses on Shopify. This comprehensive program covers key topics like dropshipping, affiliate marketing, brand building, and social media marketing, equipping students with practical skills to thrive in e-commerce.",
      "features": [
        "Build and launch a profitable online store from scratch",
        "Master dropshipping, inventory management, and fulfillment",
        "Optimize your store for conversions and sales",
        "Implement effective marketing strategies for ecommerce"
      ]
    }
  ];

  constructor(private router: Router) {}

  get filteredCourses(): Course[] {
    return this.selectedCategory === 'ALL'
      ? this.courses
      : this.courses.filter(course => course.category === this.selectedCategory);
  }

  viewMore(course: Course) {
    // Store the selected course information for use in the registration page
    localStorage.setItem('selectedCourse', JSON.stringify(course));
    
    // Navigate to the registration page with course information as query parameters
    this.router.navigate(['/register'], { 
      queryParams: { 
        courseId: course.path,
        title: course.title,
        price: course.currentPrice
      } 
    });
  }
}