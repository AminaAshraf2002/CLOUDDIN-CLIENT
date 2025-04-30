import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LessonService, Lesson } from '../services/lesson.service';
import { CourseService } from '../services/course.service';
import { MatTabsModule } from '@angular/material/tabs';
import { Subscription } from 'rxjs';

// Import the Course and Subcategory types from the CourseService
import { Course, Subcategory } from '../services/course.service';

@Component({
  selector: 'app-lesson-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTabsModule],
  templateUrl: './lesson-viewer.component.html',
  styleUrls: ['./lesson-viewer.component.css']
})
export class LessonViewerComponent implements OnInit, OnDestroy {
  courseId: number = 0;
  subcategoryId: number = 0;
  currentLessonId: number = 0;
  lesson: Lesson | null = null;
  lessons: Lesson[] = [];
  course: Course | null = null;
  subcategory: Subcategory | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  safeVideoUrl: SafeResourceUrl | null = null;
  selectedTabIndex: number = 0;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lessonService: LessonService,
    private courseService: CourseService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Extract parameters
    const courseParam = this.route.snapshot.params['courseId'];
    const subcategoryParam = this.route.snapshot.params['subcategoryId'];
    const lessonParam = this.route.snapshot.params['lessonId'];

    console.log('Extracted Params:', {
      courseParam, 
      subcategoryParam,
      lessonParam
    });

    // Convert to number, with fallback
    this.courseId = this.safeParseInt(courseParam, 'Course ID');
    this.subcategoryId = this.safeParseInt(subcategoryParam, 'Subcategory ID');
    this.currentLessonId = this.safeParseInt(lessonParam, 'Lesson ID');

    console.log('Parsed IDs:', {
      courseId: this.courseId,
      subcategoryId: this.subcategoryId,
      currentLessonId: this.currentLessonId
    });

    // First load course and subcategory data
    this.loadCourseData();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  // Safe integer parsing method
  private safeParseInt(value: any, paramName: string): number {
    // If value is already a number, return it
    if (typeof value === 'number' && !isNaN(value)) {
      return value;
    }

    // If value is a string, try parsing
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }

    // Log error for debugging
    console.error(`Invalid ${paramName}:`, value);
    return 0;
  }

  // Extract video ID from various YouTube URL formats
  extractVideoId(url: string): string {
    if (!url) return '';
    
    try {
      // Extract from embed URL
      if (url.includes('/embed/')) {
        const match = url.match(/\/embed\/([^?&]+)/);
        return match && match[1] ? match[1] : '';
      }
      
      // Extract from regular YouTube URL
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v') || '';
      }
      
      // Extract from short YouTube URL
      if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split('?')[0];
      }
      
      // Extract from thumbnail URL
      if (url.includes('img.youtube.com/vi/')) {
        const parts = url.split('/');
        const videoIdIndex = parts.indexOf('vi') + 1;
        if (videoIdIndex < parts.length) {
          return parts[videoIdIndex].split('/')[0];
        }
      }
      
      return '';
    } catch (error) {
      console.error('Error extracting video ID:', error);
      return '';
    }
  }

  // Convert any YouTube URL to embed format
  private prepareVideoUrl(url: string | undefined): string | null {
    if (!url) return null;
    
    console.log('Original video URL:', url);
    
    // Already an embed URL
    if (url.includes('/embed/')) return url;
    
    try {
      // Convert YouTube watch URLs to embed format
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get('v');
        if (videoId) {
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          console.log('Converted to embed URL:', embedUrl);
          return embedUrl;
        }
      }
      
      // Convert YouTube short links
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        if (videoId) {
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          console.log('Converted short URL to embed URL:', embedUrl);
          return embedUrl;
        }
      }
      
      // Convert YouTube thumbnails to embeds
      if (url.includes('img.youtube.com/vi/')) {
        const parts = url.split('/');
        const videoIdIndex = parts.indexOf('vi') + 1;
        if (videoIdIndex < parts.length) {
          const videoId = parts[videoIdIndex].split('/')[0];
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          console.log('Converted thumbnail URL to embed URL:', embedUrl);
          return embedUrl;
        }
      }
      
      // Return original URL if no conversions matched
      return url;
    } catch (error) {
      console.error('Error converting video URL:', error);
      return url;
    }
  }

  // Load course data
  private loadCourseData(): void {
    this.isLoading = true;
    console.log('Loading course data for ID:', this.courseId);
    
    const subscription = this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.course = course;
        console.log('Loaded course:', this.course);
        
        // Now load subcategory
        this.loadSubcategoryData();
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.errorMessage = 'Failed to load course: ' + error.message;
        this.isLoading = false;
      }
    });
    
    this.subscriptions.add(subscription);
  }
  
  // Load subcategory data
  private loadSubcategoryData(): void {
    console.log('Loading subcategory data for ID:', this.subcategoryId);
    
    const subscription = this.courseService.getSubcategoryById(this.subcategoryId).subscribe({
      next: (subcategory) => {
        this.subcategory = subcategory;
        console.log('Loaded subcategory:', this.subcategory);
        
        // Finally load lessons
        this.loadLessonsForSubcategory();
      },
      error: (error) => {
        console.error('Error loading subcategory:', error);
        this.errorMessage = 'Failed to load subcategory: ' + error.message;
        this.isLoading = false;
      }
    });
    
    this.subscriptions.add(subscription);
  }

  // Load all lessons for this subcategory
  private loadLessonsForSubcategory(): void {
    console.log('Loading lessons for subcategory:', this.subcategoryId);
    
    const subscription = this.lessonService.getLessonsByCategory(this.subcategoryId)
      .subscribe({
        next: (lessons) => {
          this.lessons = lessons;
          
          console.log('Loaded lessons:', this.lessons);
          
          // Sort lessons by day to ensure proper order
          this.lessons.sort((a, b) => {
            const dayA = a.day !== undefined ? a.day : 0;
            const dayB = b.day !== undefined ? b.day : 0;
            return dayA - dayB;
          });
          
          if (lessons.length > 0) {
            // If no specific lesson was requested, use the first one
            if (!this.currentLessonId) {
              const firstLesson = lessons[0];
              if (firstLesson && firstLesson.id) {
                this.currentLessonId = firstLesson.id;
                // Find the index for our tab selection
                this.selectedTabIndex = 0;
              }
            } else {
              // Find the index for our tab selection
              this.selectedTabIndex = this.lessons.findIndex(l => l.id === this.currentLessonId);
              if (this.selectedTabIndex < 0) this.selectedTabIndex = 0;
            }
            
            console.log('Selected tab index:', this.selectedTabIndex);
            console.log('Selected lesson ID:', this.currentLessonId);
            
            // Now load the specific lesson
            this.loadLesson();
          } else {
            this.errorMessage = 'No lessons found in this subcategory';
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Error finding lessons:', error);
          this.errorMessage = 'Failed to find lessons: ' + error.message;
          this.isLoading = false;
        }
      });
      
    this.subscriptions.add(subscription);
  }

  loadLesson(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Additional validation
    if (!this.subcategoryId || !this.currentLessonId) {
      this.errorMessage = 'Invalid subcategory or lesson ID';
      this.isLoading = false;
      return;
    }

    console.log('Loading lesson with ID:', this.currentLessonId);
    
    const subscription = this.lessonService.getLessonById(this.subcategoryId, this.currentLessonId)
      .subscribe({
        next: (lesson) => {
          this.lesson = lesson;
          
          console.log('Loaded lesson data:', lesson);
          
          // Sanitize video URL if present
          if (lesson.videoUrl) {
            console.log('Raw video URL:', lesson.videoUrl);
            
            // Make sure we have the correct embed URL format
            const embedUrl = this.prepareVideoUrl(lesson.videoUrl);
            console.log('Final video URL:', embedUrl);
            
            if (embedUrl) {
              // Important: Add allow-scripts to the URL if needed
              this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
              console.log('Sanitized video URL created');
            } else {
              this.safeVideoUrl = null;
              console.log('Failed to create embed URL');
            }
          } else {
            this.safeVideoUrl = null;
            console.log('No video URL available');
          }
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading lesson:', error);
          this.errorMessage = error.message || 'Failed to load the lesson. Please try again later.';
          this.isLoading = false;
        }
      });
      
    this.subscriptions.add(subscription);
  }

  goBack(): void {
    this.router.navigate(['/user/course', this.courseId]);
  }
  
  // Tab change event handler
  onTabChanged(index: number): void {
    console.log('Tab changed to index:', index);
    
    if (this.lessons.length > 0 && index >= 0 && index < this.lessons.length) {
      this.selectedTabIndex = index;
      const lessonItem = this.lessons[index];
      
      // Only proceed if we have a valid lesson with an ID
      if (lessonItem && lessonItem.id) {
        const selectedLessonId = lessonItem.id;
        console.log('Selected lesson ID:', selectedLessonId);
        
        // Update the URL without full navigation
        this.router.navigate(
          ['/user/lesson', this.courseId, this.subcategoryId, selectedLessonId],
          { replaceUrl: true }
        );
        
        // Update current lesson ID and load it
        this.currentLessonId = selectedLessonId;
        this.loadLesson();
      } else {
        console.error('Selected lesson has no ID:', lessonItem);
      }
    }
  }
  
  // Helper methods for the template
  getLessonTitle(lesson: Lesson): string {
    return lesson.title || 'Untitled Lesson';
  }
  
  getLessonDescription(lesson: Lesson): string {
    return lesson.description || 'No description available';
  }
  
  getLessonTopics(lesson: Lesson): string[] {
    return lesson.topics || [];
  }
  
  // Safe comparison method for checking if a lesson is the current one
  isCurrentLesson(lessonId: number | undefined): boolean {
    return lessonId !== undefined && lessonId === this.currentLessonId;
  }
}