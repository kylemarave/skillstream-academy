export type UserRole = "student" | "instructor" | "admin";

export type CourseStatus = "draft" | "published" | "archived";

export type LessonContentType = "video" | "text" | "quiz" | "assignment";

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface Course {
  id: string;
  instructorId: string;
  title: string;
  description: string;
  price: number;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  sequenceOrder: number;
  createdAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  sequenceOrder: number;
  contentType: LessonContentType;
  contentRef: string;
  durationMinutes: number | null;
  createdAt: string;
}

export interface DataStore {
  users: User[];
  courses: Course[];
  modules: CourseModule[];
  lessons: Lesson[];
}
