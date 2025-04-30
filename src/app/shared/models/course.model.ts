// src/app/shared/models/course.model.ts

// Lesson Interface: Represents individual learning units
export interface Lesson {
    id: number;        // Unique identifier for the lesson
    day: number;       // Sequence of lesson in course progression
    title: string;     // Name of the lesson
    videoUrl: string;  // Direct link to lesson video content
    description: string; // Detailed explanation of lesson content
    topics: string[];  // Key learning topics covered
    duration?: string; // Optional lesson duration (flexible representation)
}

// Subcategory Interface: Groups related lessons
export interface Subcategory {
    id: number;             // Unique subcategory identifier
    title: string;          // Subcategory name
    description: string;    // Comprehensive explanation of subcategory focus
    lessons: Lesson[];      // Collection of lessons within this subcategory
    thumbnail: string;      // Subcategory thumbnail image (FIXED: now required property)
}

// Course Interface: Represents the complete learning offering
export interface Course {
    id: number;                   // Unique course identifier
    title: string;                // Course name
    lessons: number;              // Total number of lessons
    thumbnail: string;            // Primary course image
    progress?: number;            // Optional tracking of user's learning progress
    subcategories: Subcategory[]; // Structured learning content
    description?: string;         // Optional detailed course overview
    instructor?: string;          // Optional instructor name
    duration?: string;            // Optional total course duration
    level?: 'beginner' | 'intermediate' | 'advanced'; // Skill level categorization
}

// Enrollment Interface: Tracks user's interaction with a course
export interface Enrollment {
    userId: string;            // Unique user identifier
    courseId: number;          // Course being tracked
    enrollmentDate: Date;      // Start of user's learning journey
    progress: number;          // Percentage of course completed
    lastAccessedDate?: Date;   // Most recent interaction timestamp
    completedLessons?: number[]; // IDs of lessons user has finished
}

// Response Interface: Structures data retrieval for user courses
export interface UserCoursesResponse {
    courses: Course[];         // Available courses in the system
    enrollments: Enrollment[]; // User's specific course interactions
}