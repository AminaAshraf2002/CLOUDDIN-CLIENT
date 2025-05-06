import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LessonService } from '../../services/lesson.service';
import { CategoryService } from '../../services/category.service';
import { CourseService } from '../../services/course.service';
import { Lesson as ServiceLesson } from '../../services/lesson.service';

// This interface extends the service's Lesson interface to ensure compatibility
export interface Lesson extends ServiceLesson {
  subcategoryId: number;
  topics: string[];
  videoUrl?: string;
}

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {
  // Data properties
  lessons: Lesson[] = [];
  courses: any[] = [];
  subcategories: { [courseId: number]: any[] } = {};
  
  // UI control properties
  isLoading: boolean = false;
  error: string | null = null;
  searchTerm: string = '';
  selectedCourse: string = '';
  
  // Modal Control Properties
  isAddLessonModalOpen: boolean = false;
  isEditLessonModalOpen: boolean = false;
  currentLesson: Lesson | null = null;
  
  // Pagination Properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  
  @ViewChild('topicInput') topicInput!: ElementRef<HTMLInputElement>;
  
  constructor(
    private lessonService: LessonService,
    private categoryService: CategoryService,
    private courseService: CourseService,
    private sanitizer: DomSanitizer
  ) {}
  
  ngOnInit(): void {
    this.loadCourses();
  }
  
  // Load all courses
  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        console.log('Loaded courses:', courses);
        
        // Load subcategories for each course
        courses.forEach(course => {
          this.loadSubcategories(course.id);
        });
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.error = 'Failed to load courses. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  // Load subcategories for a course
  loadSubcategories(courseId: number): void {
    this.categoryService.getCategoriesByCourse(courseId).subscribe({
      next: (subcategories) => {
        this.subcategories[courseId] = subcategories;
        console.log(`Found ${subcategories.length} subcategories for course ${courseId}`);
        
        // Load lessons for each subcategory
        subcategories.forEach(subcategory => {
          this.loadLessonsForSubcategory(subcategory.id);
        });
      },
      error: (err) => {
        console.error(`Error loading subcategories for course ${courseId}:`, err);
      }
    });
  }
  
  // Load lessons for a subcategory
  loadLessonsForSubcategory(subcategoryId: number): void {
    this.lessonService.getLessonsByCategory(subcategoryId).subscribe({
      next: (serviceLessons) => {
        // Convert service lessons to component lessons and add to the lessons array
        const convertedLessons = serviceLessons.map(lesson => ({
          ...lesson,
          subcategoryId,
          topics: lesson.topics || []
        })) as Lesson[];
        
        // Add lessons to the main lessons array
        this.lessons = [...this.lessons, ...convertedLessons];
      },
      error: (err) => {
        console.error(`Error loading lessons for subcategory ${subcategoryId}:`, err);
      }
    });
  }
  
  // Filtered Lessons Getter
  get filteredLessons(): Lesson[] {
    return this.lessons.filter(lesson => 
      (this.searchTerm === '' || 
       lesson.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       lesson.description.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.selectedCourse === '' || this.getCourseForLesson(lesson) === this.selectedCourse)
    );
  }
  
  // Paginated Lessons Getter
  get paginatedLessons(): Lesson[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredLessons.slice(startIndex, endIndex);
  }
  
  // Get lessons by course name
  getLessonsByCourse(courseTitle: string): Lesson[] {
    if (!courseTitle) return [];
    return this.paginatedLessons.filter(lesson => 
      this.getCourseForLesson(lesson) === courseTitle
    );
  }
  
  // Get course name for a lesson
  getCourseForLesson(lesson: Lesson): string {
    if (!lesson?.subcategoryId) return '';
    
    // Find which course this subcategory belongs to
    for (const courseId in this.subcategories) {
      const subcat = this.subcategories[courseId]?.find(sub => sub.id === lesson.subcategoryId);
      if (subcat) {
        const course = this.courses.find(c => c.id === parseInt(courseId));
        return course && course.title ? course.title : '';
      }
    }
    return '';
  }
  
  // Get subcategory name for a lesson
  getSubcategoryForLesson(lesson: Lesson): string {
    if (!lesson?.subcategoryId) return '';
    
    // Find the subcategory across all courses
    for (const courseId in this.subcategories) {
      const subcat = this.subcategories[courseId]?.find(sub => sub.id === lesson.subcategoryId);
      if (subcat) {
        return subcat.title || '';
      }
    }
    return '';
  }
  
  // Total Pages Getter
  get totalPages(): number {
    return Math.ceil(this.filteredLessons.length / this.itemsPerPage);
  }
  
  // Pagination Methods
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  // Sanitize Video URL
  sanitizeVideoUrl(url: string): SafeResourceUrl {
    if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    
    // Convert to embed URL before sanitizing
    const embedUrl = this.prepareVideoUrl(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
  
  // Modified method to handle both URLs and iframe embed code
  prepareVideoUrl(input: string | undefined): string {
    if (!input || input.trim() === '') return '';
    
    // Check if it's an iframe embed code
    if (input.includes('<iframe') && input.includes('</iframe>')) {
      // Extract the src attribute from the iframe
      const srcMatch = input.match(/src=["'](.*?)["']/i);
      if (srcMatch && srcMatch[1]) {
        console.log('Extracted src from iframe:', srcMatch[1]);
        return srcMatch[1]; // Return just the URL from src attribute
      }
    }
    
    // Handle regular YouTube URLs as before
    if (input.includes('/embed/')) return input;
    
    try {
      // Convert YouTube watch URLs to embed format
      if (input.includes('youtube.com/watch')) {
        const urlObj = new URL(input);
        const videoId = urlObj.searchParams.get('v');
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      
      // Convert YouTube short links
      if (input.includes('youtu.be/')) {
        const videoId = input.split('youtu.be/')[1].split('?')[0];
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      
      // Return original URL if no conversions matched
      return input;
    } catch (error) {
      console.error('Error converting video URL:', error);
      return input;
    }
  }
  
  // Extract YouTube Thumbnail
  extractYoutubeThumbnail(videoUrl?: string): string {
    if (!videoUrl) return 'https://via.placeholder.com/300x200?text=No+Thumbnail';
    
    const videoId = this.extractVideoId(videoUrl);
    return videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : 'https://via.placeholder.com/300x200?text=Invalid+URL';
  }
  
  // Extract Video ID - updated to handle iframe embed codes
  private extractVideoId(input: string): string {
    if (!input) return '';
    
    // Handle iframe embed code
    if (input.includes('<iframe') && input.includes('</iframe>')) {
      const srcMatch = input.match(/src=["'](.*?)["']/i);
      if (srcMatch && srcMatch[1]) {
        // Now extract video ID from the src URL
        const srcUrl = srcMatch[1];
        if (srcUrl.includes('/embed/')) {
          const embedMatch = srcUrl.match(/\/embed\/([^?&]+)/);
          return embedMatch && embedMatch[1] ? embedMatch[1] : '';
        }
      }
      return '';
    }
    
    // Handle regular URLs as before
    let match;
    if (input.includes('/embed/')) {
      match = input.match(/\/embed\/([^?&]+)/);
    } else if (input.includes('youtube.com/watch')) {
      match = input.match(/v=([^?&]+)/);
    } else if (input.includes('youtu.be/')) {
      match = input.match(/youtu\.be\/([^?&]+)/);
    }
    
    return match && match[1] ? match[1] : '';
  }
  
  // Open Add Lesson Modal
  openAddLessonModal(): void {
    this.isAddLessonModalOpen = true;
    this.isEditLessonModalOpen = false;
    
    // Find the first course with subcategories
    const firstCourse = this.courses.length > 0 ? this.courses[0] : null;
    let defaultSubcategoryId = 0;
    
    if (firstCourse) {
      const courseSubcategories = this.subcategories[firstCourse.id] || [];
      if (courseSubcategories.length > 0) {
        defaultSubcategoryId = courseSubcategories[0].id;
      }
      
      this.selectedCourse = firstCourse.title || '';
    }
    
    this.currentLesson = {
      id: 0,
      day: 1,
      title: '',
      description: '',
      topics: [],
      videoUrl: '',
      subcategoryId: defaultSubcategoryId,
      duration: '45 minutes'
    };
  }
  
  // Open Edit Lesson Modal
  openEditLessonModal(lesson: Lesson): void {
    this.isEditLessonModalOpen = true;
    this.isAddLessonModalOpen = false;
    this.currentLesson = { ...lesson };
    this.selectedCourse = this.getCourseForLesson(lesson);
  }
  
  // Close Modal
  closeModal(): void {
    this.isAddLessonModalOpen = false;
    this.isEditLessonModalOpen = false;
    this.currentLesson = null;
  }
  
  // Add Topic
  addTopic(topicInput: HTMLInputElement): void {
    if (this.currentLesson && topicInput.value.trim()) {
      if (!this.currentLesson.topics) {
        this.currentLesson.topics = [];
      }
      this.currentLesson.topics.push(topicInput.value.trim());
      topicInput.value = '';
    }
  }
  
  // Remove Topic
  removeTopic(index: number): void {
    if (this.currentLesson && this.currentLesson.topics) {
      this.currentLesson.topics.splice(index, 1);
    }
  }
  
  // Save Lesson - UPDATED to handle iframe embed codes
  saveLesson(): void {
    if (!this.currentLesson) return;
    
    // Handle video URL or iframe embed
    if (this.currentLesson.videoUrl) {
      // Extract the video URL from the current lesson's videoUrl
      this.currentLesson.videoUrl = this.prepareVideoUrl(this.currentLesson.videoUrl);
      console.log('Saving with video URL:', this.currentLesson.videoUrl);
    }
    
    this.isLoading = true;
    
    if (this.isEditLessonModalOpen && this.currentLesson.id) {
      // Update existing lesson
      this.lessonService.updateLesson(
        this.currentLesson.subcategoryId,
        this.currentLesson.id,
        this.currentLesson
      ).subscribe({
        next: (updatedLesson) => {
          // Convert the service lesson to a component lesson
          const convertedLesson = {
            ...updatedLesson,
            subcategoryId: this.currentLesson!.subcategoryId,
            topics: updatedLesson.topics || []
          } as Lesson;
          
          const index = this.lessons.findIndex(l => l.id === this.currentLesson!.id);
          if (index !== -1) {
            this.lessons[index] = convertedLesson;
          }
          
          this.closeModal();
          this.isLoading = false;
          alert('Lesson updated successfully!');
        },
        error: (err) => {
          console.error('Error updating lesson:', err);
          this.error = 'Failed to update lesson. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      // Create new lesson
      this.lessonService.createLesson(
        this.currentLesson.subcategoryId,
        this.currentLesson
      ).subscribe({
        next: (newLesson) => {
          // Convert the service lesson to a component lesson
          const convertedLesson = {
            ...newLesson,
            subcategoryId: this.currentLesson!.subcategoryId,
            topics: newLesson.topics || []
          } as Lesson;
          
          this.lessons.push(convertedLesson);
          this.closeModal();
          this.isLoading = false;
          alert('Lesson created successfully!');
        },
        error: (err) => {
          console.error('Error creating lesson:', err);
          this.error = 'Failed to create lesson. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }
  
  // Delete Lesson
  deleteLesson(id: number): void {
    if (!confirm('Are you sure you want to delete this lesson?')) {
      return;
    }
    
    const lesson = this.lessons.find(l => l.id === id);
    if (!lesson || !lesson.subcategoryId) {
      alert('Cannot identify the lesson to delete');
      return;
    }
    
    this.isLoading = true;
    
    this.lessonService.deleteLesson(lesson.subcategoryId, id).subscribe({
      next: (response) => {
        this.lessons = this.lessons.filter(lesson => lesson.id !== id);
        this.isLoading = false;
        alert('Lesson deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting lesson:', err);
        this.error = 'Failed to delete lesson. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  // Get subcategories for a course
  getSubcategoriesForCourse(courseId: number): any[] {
    return this.subcategories[courseId] || [];
  }
  
  // Get course ID by name
  getCourseIdByName(courseName: string): number {
    if (!courseName) return 0;
    const course = this.courses.find(c => c.title === courseName);
    return course ? course.id : 0;
  }
  
  // Handle course selection change in the modal
  onCourseChange(courseName: string): void {
    if (!this.currentLesson || !courseName) return;
    
    const courseId = this.getCourseIdByName(courseName);
    const subcats = this.getSubcategoriesForCourse(courseId);
    
    if (subcats.length > 0) {
      this.currentLesson.subcategoryId = subcats[0].id;
    }
  }
}