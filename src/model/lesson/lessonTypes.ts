/** Lesson data structure returned from API */
export interface Lesson {
  id: string;
  title: string;
  description?: string;
  startAt?: string;
  durationMinutes?: number;
  isPublished: boolean;
  documentUrl?: string;
  videoUrl?: string;
  teacherId: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Form data for creating/updating a lesson */
export interface LessonFormData {
  title: string;
  description?: string;
  startAt?: string;
  durationMinutes?: number;
  isPublished: boolean;
  documentFile?: File | null;
  videoFile?: File | null;
}

/** Response when fetching lessons by teacher */
export interface TeacherLessonsResponse {
  lessons: Lesson[];
  totalCount: number;
}



