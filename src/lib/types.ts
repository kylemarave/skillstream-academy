export type UserRole = "student" | "instructor" | "admin";

export type CourseStatus = "draft" | "published" | "archived";

export type LessonContentType = "video" | "text" | "quiz" | "assignment";

export type EnrollmentStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

export type LmsSyncStatus = "pending" | "provisioned" | "failed";

export type LessonProgressStatus = "not_started" | "in_progress" | "completed";

export type CertificateVerificationStatus = "valid" | "revoked";

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

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LmsAccount {
  id: string;
  enrollmentId: string;
  provisionedAt: string | null;
  syncStatus: LmsSyncStatus;
  externalLmsId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  status: LessonProgressStatus;
  completedAt: string | null;
  score: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  enrollmentId: string;
  referenceNumber: string;
  issuedAt: string;
  fileUrl: string;
  verificationStatus: CertificateVerificationStatus;
  createdAt: string;
}

export interface DataStore {
  users: User[];
  courses: Course[];
  modules: CourseModule[];
  lessons: Lesson[];
  enrollments: Enrollment[];
  lmsAccounts: LmsAccount[];
  lessonProgress: LessonProgress[];
  certificates: Certificate[];
}
