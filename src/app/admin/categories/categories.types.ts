// Define Course Types as a Union Type
export type CourseType = 'Digital Marketing' | 'Graphic Design' | 'Ecommerce Mastery';

// Extend the Category interface to match API response
export interface Category {
  id?: number;
  name?: string;
  title?: string;
  description: string;
  course: CourseType;
  courseId?: number;
  instructor: string;
  duration: string;
  lessons: number;
  thumbnail: string;
}

// API Response Interface
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Course Interface
export interface Course {
  id: number;
  title: string;
}

// Display Category Interface - for UI display purposes
export interface DisplayCategory {
  id?: number;
  name: string;
  description: string;
  course: CourseType;
  thumbnail: string;
  courseId?: number;
}

// Function to convert from API Category to Display Category
export function toDisplayCategory(category: Category): DisplayCategory {
  return {
    id: category.id,
    name: category.name || category.title || '',
    description: category.description || '',
    course: category.course,
    thumbnail: category.thumbnail || 'https://via.placeholder.com/150',
    courseId: category.courseId
  };
}

// Function to convert from Display Category to API Category format
export function toApiCategory(displayCategory: DisplayCategory, instructor = '', duration = '', lessons = 0): Category {
  return {
    id: displayCategory.id,
    name: displayCategory.name,
    description: displayCategory.description,
    course: displayCategory.course,
    courseId: displayCategory.courseId,
    instructor: instructor,
    duration: duration,
    lessons: lessons,
    thumbnail: displayCategory.thumbnail
  };
}