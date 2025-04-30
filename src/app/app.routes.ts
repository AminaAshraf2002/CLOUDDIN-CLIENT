import { Routes } from '@angular/router';

// Import all necessary components
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UserComponent } from './admin/user/user.component';
import { CoursesComponent } from './admin/courses/courses.component';
import { LessonsComponent } from './admin/lessons/lessons.component';
import { CategoriesComponent } from './admin/categories/categories.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserCourseComponent } from './user-course/user-course.component';
import { EcommerceMasteryComponent } from './ecommerce-mastery/ecommerce-mastery.component';
import { DigitalMarketingComponent } from './digital-marketing/digital-marketing.component';

// New imports for course and lesson viewers
import { CourseViewerComponent } from './course-viewer/course-viewer.component';
import { LessonViewerComponent } from './lesson-viewer/lesson-viewer.component';

// Import Guards
import { AuthGuard } from './guards/auth.guard';
import { UserAuthGuard } from './guards/user-auth.guard';

// IMPORTANT: Export the routes
export const routes: Routes = [
  // Public Routes (No authentication required)
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin-login', component: AdminLoginComponent },

  // Courses Routes (Partially Protected)
  {
    path: 'courses',
    children: [
      // Public course previews
      { path: 'digital-marketing', component: DigitalMarketingComponent },
      { path: 'ecommerce-mastery', component: EcommerceMasteryComponent },

      // Protected individual course access
      {
        path: ':id',
        component: UserCourseComponent,
        canActivate: [UserAuthGuard]
      }
    ]
  },

  // Course and Lesson Viewer Routes (Protected)
  {
    path: 'user',
    canActivate: [UserAuthGuard],
    children: [
      // Dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: UserDashboardComponent
      },

      // Course Viewer
      {
        path: 'course/:id',
        component: CourseViewerComponent
      },

    

      // Lesson Viewer with multiple route patterns
      {
        path: 'lesson/:courseId/:subcategoryId',
        component: LessonViewerComponent
      },
      {
        path: 'lesson/:courseId/:subcategoryId/:lessonId',
        component: LessonViewerComponent
      }
    ]
  },

  // Admin Routes - Strictly Protected
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { expectedRole: 'admin' }
      },
      {
        path: 'user',
        component: UserComponent,
        data: { expectedRole: 'admin' }
      },
      {
        path: 'courses',
        component: CoursesComponent,
        data: { expectedRole: 'admin' }
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        data: { expectedRole: 'admin' }
      },
      {
        path: 'lessons',
        component: LessonsComponent,
        data: { expectedRole: 'admin' }
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Wildcard route for 404 - Always keep this as the last route
  {
    path: '**',
    redirectTo: '/error',
    pathMatch: 'full'
  }
];