/** Lesson category types */
export type LessonCategory = "Toán" | "Anh văn" | "Lý" | "Hóa" | "Công nghệ";

/** Available lesson categories */
export const LESSON_CATEGORIES: LessonCategory[] = [
  "Toán",
  "Anh văn",
  "Lý",
  "Hóa",
  "Công nghệ",
];

/** Lesson data structure returned from API */
export interface Lesson {
  id: string;
  title: string;
  description?: string;
  category?: LessonCategory;
  startAt?: string;
  durationMinutes?: number;
  isPublished: boolean;
  documentUrl?: string;
  videoUrl?: string;
  teacherId: string;
  createdAt?: string;
  updatedAt?: string;
  studentCount?: number; // Số user đang học bài này
}

/** Form data for creating/updating a lesson */
export interface LessonFormData {
  title: string;
  description?: string;
  category?: LessonCategory;
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



