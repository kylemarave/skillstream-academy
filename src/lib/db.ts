import { promises as fs } from "fs";
import path from "path";
import { randomBytes, randomUUID } from "crypto";
import type {
  Certificate,
  Course,
  CourseModule,
  DataStore,
  Enrollment,
  Lesson,
  LessonProgress,
  LmsAccount,
  User,
} from "./types";
import { normalizeReference } from "./certificates";

const DATA_PATH = path.join(process.cwd(), "data", "store.json");

async function readStore(): Promise<DataStore> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const parsed = JSON.parse(raw) as Partial<DataStore>;
  return {
    users: parsed.users ?? [],
    courses: parsed.courses ?? [],
    modules: parsed.modules ?? [],
    lessons: parsed.lessons ?? [],
    enrollments: parsed.enrollments ?? [],
    lmsAccounts: parsed.lmsAccounts ?? [],
    lessonProgress: parsed.lessonProgress ?? [],
    certificates: parsed.certificates ?? [],
  };
}

async function writeStore(store: DataStore): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const store = await readStore();
  return store.users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
}

export async function getUserById(id: string): Promise<User | undefined> {
  const store = await readStore();
  return store.users.find((user) => user.id === id);
}

export async function listCourses(filters?: {
  instructorId?: string;
  status?: Course["status"];
}): Promise<Course[]> {
  const store = await readStore();
  return store.courses.filter((course) => {
    if (filters?.instructorId && course.instructorId !== filters.instructorId) {
      return false;
    }
    if (filters?.status && course.status !== filters.status) {
      return false;
    }
    return true;
  });
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  const store = await readStore();
  return store.courses.find((course) => course.id === id);
}

export async function createCourse(
  input: Omit<Course, "id" | "createdAt" | "updatedAt">,
): Promise<Course> {
  const store = await readStore();
  const now = new Date().toISOString();
  const course: Course = {
    ...input,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  store.courses.push(course);
  await writeStore(store);
  return course;
}

export async function updateCourse(
  id: string,
  input: Partial<Pick<Course, "title" | "description" | "price" | "status">>,
): Promise<Course | undefined> {
  const store = await readStore();
  const index = store.courses.findIndex((course) => course.id === id);
  if (index === -1) return undefined;

  store.courses[index] = {
    ...store.courses[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  await writeStore(store);
  return store.courses[index];
}

export async function listModulesByCourse(
  courseId: string,
): Promise<CourseModule[]> {
  const store = await readStore();
  return store.modules
    .filter((module) => module.courseId === courseId)
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
}

export async function createModule(
  input: Omit<CourseModule, "id" | "createdAt">,
): Promise<CourseModule> {
  const store = await readStore();
  const courseModule: CourseModule = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.modules.push(courseModule);
  await writeStore(store);
  return courseModule;
}

export async function listLessonsByModule(moduleId: string): Promise<Lesson[]> {
  const store = await readStore();
  return store.lessons
    .filter((lesson) => lesson.moduleId === moduleId)
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
}

export async function createLesson(
  input: Omit<Lesson, "id" | "createdAt">,
): Promise<Lesson> {
  const store = await readStore();
  const lesson: Lesson = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.lessons.push(lesson);
  await writeStore(store);
  return lesson;
}

export async function getCourseWithContent(courseId: string) {
  const course = await getCourseById(courseId);
  if (!course) return null;

  const modules = await listModulesByCourse(courseId);
  const modulesWithLessons = await Promise.all(
    modules.map(async (module) => ({
      ...module,
      lessons: await listLessonsByModule(module.id),
    })),
  );

  return { ...course, modules: modulesWithLessons };
}

function isOpenEnrollment(status: Enrollment["status"]) {
  return status !== "cancelled";
}

export async function listEnrollments(filters: {
  studentId?: string;
  courseId?: string;
}): Promise<Enrollment[]> {
  const store = await readStore();
  return store.enrollments.filter((enrollment) => {
    if (filters.studentId && enrollment.studentId !== filters.studentId) {
      return false;
    }
    if (filters.courseId && enrollment.courseId !== filters.courseId) {
      return false;
    }
    return isOpenEnrollment(enrollment.status);
  });
}

export async function getEnrollmentByStudentAndCourse(
  studentId: string,
  courseId: string,
): Promise<Enrollment | undefined> {
  const enrollments = await listEnrollments({ studentId, courseId });
  return enrollments[0];
}

export async function listEnrollmentsWithCourses(studentId: string) {
  const enrollments = await listEnrollments({ studentId });
  const courses = await Promise.all(
    enrollments.map((enrollment) => getCourseById(enrollment.courseId)),
  );

  return enrollments.flatMap((enrollment, index) => {
    const course = courses[index];
    if (!course) return [];
    return [{ enrollment, course }];
  });
}

export async function listRosterByCourse(courseId: string) {
  const enrollments = await listEnrollments({ courseId });
  const course = await getCourseWithContent(courseId);
  const lessons = course ? flattenCourseLessons(course.modules) : [];
  const store = await readStore();
  const now = new Date().toISOString();
  let changed = false;

  for (const enrollment of enrollments) {
    const before = store.certificates.length;
    issueCertificateIfEligible(store, enrollment, now);
    if (store.certificates.length !== before) {
      changed = true;
    }
  }

  if (changed) {
    await writeStore(store);
  }

  const students = await Promise.all(
    enrollments.map((enrollment) => getUserById(enrollment.studentId)),
  );

  return enrollments.flatMap((enrollment, index) => {
    const student = students[index];
    if (!student) return [];
    return [
      {
        enrollment,
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
        },
        summary: summarizeProgress(
          lessons,
          progressForEnrollment(store, enrollment.id),
        ),
        certificate:
          store.certificates.find(
            (item) => item.enrollmentId === enrollment.id,
          ) ?? null,
      },
    ];
  });
}

export type EnrollResult =
  | { ok: true; enrollment: Enrollment; lmsAccount: LmsAccount }
  | { ok: false; error: string; status: number; enrollment?: Enrollment };

export async function enrollStudent(
  studentId: string,
  courseId: string,
): Promise<EnrollResult> {
  const store = await readStore();
  const course = store.courses.find((item) => item.id === courseId);

  if (!course) {
    return { ok: false, error: "Course not found.", status: 404 };
  }

  if (course.status !== "published") {
    return {
      ok: false,
      error: "Only published courses can be enrolled.",
      status: 400,
    };
  }

  const existing = store.enrollments.find(
    (enrollment) =>
      enrollment.studentId === studentId &&
      enrollment.courseId === courseId &&
      isOpenEnrollment(enrollment.status),
  );

  if (existing) {
    return {
      ok: false,
      error: "You are already enrolled in this course.",
      status: 409,
      enrollment: existing,
    };
  }

  const now = new Date().toISOString();
  const enrollment: Enrollment = {
    id: randomUUID(),
    studentId,
    courseId,
    status: "active",
    enrolledAt: now,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  const lmsAccount: LmsAccount = {
    id: randomUUID(),
    enrollmentId: enrollment.id,
    provisionedAt: now,
    syncStatus: "provisioned",
    externalLmsId: `lms-${enrollment.id.slice(0, 8)}`,
    createdAt: now,
    updatedAt: now,
  };

  store.enrollments.push(enrollment);
  store.lmsAccounts.push(lmsAccount);
  await writeStore(store);

  return { ok: true, enrollment, lmsAccount };
}

export function flattenCourseLessons(
  modules: Array<CourseModule & { lessons: Lesson[] }>,
) {
  return modules.flatMap((courseModule) => courseModule.lessons);
}

function progressForEnrollment(store: DataStore, enrollmentId: string) {
  return store.lessonProgress.filter(
    (item) => item.enrollmentId === enrollmentId,
  );
}

export function summarizeProgress(
  lessons: Lesson[],
  progress: LessonProgress[],
) {
  const completedIds = new Set(
    progress
      .filter((item) => item.status === "completed")
      .map((item) => item.lessonId),
  );
  const completed = lessons.filter((lesson) => completedIds.has(lesson.id)).length;
  const total = lessons.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const nextLesson =
    lessons.find((lesson) => !completedIds.has(lesson.id)) ?? null;

  return { completed, total, percent, nextLesson };
}

export async function listLearningForStudent(studentId: string) {
  const enrolled = await listEnrollmentsWithCourses(studentId);
  const store = await readStore();
  let changed = false;
  const now = new Date().toISOString();

  for (const { enrollment } of enrolled) {
    const before = store.certificates.length;
    issueCertificateIfEligible(store, enrollment, now);
    if (store.certificates.length !== before) {
      changed = true;
    }
  }

  if (changed) {
    await writeStore(store);
  }

  return Promise.all(
    enrolled.map(async ({ enrollment, course }) => {
      const content = await getCourseWithContent(course.id);
      const lessons = content ? flattenCourseLessons(content.modules) : [];
      const summary = summarizeProgress(
        lessons,
        progressForEnrollment(store, enrollment.id),
      );
      const certificate =
        store.certificates.find(
          (item) => item.enrollmentId === enrollment.id,
        ) ?? null;
      return { enrollment, course, summary, certificate };
    }),
  );
}

export async function getPlayerState(studentId: string, courseId: string) {
  const enrollment = await getEnrollmentByStudentAndCourse(studentId, courseId);
  if (!enrollment) return null;

  const course = await getCourseWithContent(courseId);
  if (!course) return null;

  const store = await readStore();
  const progress = progressForEnrollment(store, enrollment.id);
  const lessons = flattenCourseLessons(course.modules);
  const summary = summarizeProgress(lessons, progress);
  const certificate =
    enrollment.status === "completed"
      ? await getCertificateForEnrollment(enrollment.id)
      : null;

  return { enrollment, course, progress, lessons, summary, certificate };
}

export async function startLesson(
  studentId: string,
  courseId: string,
  lessonId: string,
) {
  const store = await readStore();
  const enrollment = store.enrollments.find(
    (item) =>
      item.studentId === studentId &&
      item.courseId === courseId &&
      isOpenEnrollment(item.status),
  );
  if (!enrollment) {
    return { ok: false as const, error: "Not enrolled.", status: 404 };
  }

  const lesson = store.lessons.find((item) => item.id === lessonId);
  if (!lesson) {
    return { ok: false as const, error: "Lesson not found.", status: 404 };
  }

  const courseModule = store.modules.find((item) => item.id === lesson.moduleId);
  if (!courseModule || courseModule.courseId !== courseId) {
    return { ok: false as const, error: "Lesson not found.", status: 404 };
  }

  const existing = store.lessonProgress.find(
    (item) =>
      item.enrollmentId === enrollment.id && item.lessonId === lessonId,
  );

  if (existing) {
    return { ok: true as const, progress: existing, enrollment };
  }

  const now = new Date().toISOString();
  const progress: LessonProgress = {
    id: randomUUID(),
    enrollmentId: enrollment.id,
    lessonId,
    status: "in_progress",
    completedAt: null,
    score: null,
    createdAt: now,
    updatedAt: now,
  };
  store.lessonProgress.push(progress);
  await writeStore(store);
  return { ok: true as const, progress, enrollment };
}

export async function completeLesson(
  studentId: string,
  courseId: string,
  lessonId: string,
) {
  const started = await startLesson(studentId, courseId, lessonId);
  if (!started.ok) return started;

  const store = await readStore();
  const enrollmentIndex = store.enrollments.findIndex(
    (item) => item.id === started.enrollment.id,
  );
  const progressIndex = store.lessonProgress.findIndex(
    (item) =>
      item.enrollmentId === started.enrollment.id && item.lessonId === lessonId,
  );

  if (enrollmentIndex === -1 || progressIndex === -1) {
    return { ok: false as const, error: "Enrollment not found.", status: 404 };
  }

  const now = new Date().toISOString();
  const lesson = store.lessons.find((item) => item.id === lessonId);
  const needsScore =
    lesson?.contentType === "quiz" || lesson?.contentType === "assignment";

  store.lessonProgress[progressIndex] = {
    ...store.lessonProgress[progressIndex],
    status: "completed",
    completedAt: now,
    score: needsScore ? 100 : store.lessonProgress[progressIndex].score,
    updatedAt: now,
  };

  const course = await getCourseWithContent(courseId);
  const lessons = course ? flattenCourseLessons(course.modules) : [];
  const enrollmentProgress = progressForEnrollment(
    store,
    started.enrollment.id,
  );
  const summary = summarizeProgress(lessons, enrollmentProgress);
  const completedIds = new Set(
    enrollmentProgress
      .filter((item) => item.status === "completed")
      .map((item) => item.lessonId),
  );
  const currentIndex = lessons.findIndex((item) => item.id === lessonId);
  const nextLesson =
    lessons.slice(currentIndex + 1).find((item) => !completedIds.has(item.id)) ??
    lessons.find((item) => !completedIds.has(item.id)) ??
    null;

  const wasComplete = started.enrollment.status === "completed";

  if (summary.total > 0 && summary.completed === summary.total) {
    store.enrollments[enrollmentIndex] = {
      ...store.enrollments[enrollmentIndex],
      status: "completed",
      completedAt: store.enrollments[enrollmentIndex].completedAt ?? now,
      updatedAt: now,
    };
  }

  const certificate = issueCertificateIfEligible(
    store,
    store.enrollments[enrollmentIndex],
    now,
  );
  const justCertified =
    Boolean(certificate) &&
    !wasComplete &&
    store.enrollments[enrollmentIndex].status === "completed";

  await writeStore(store);

  return {
    ok: true as const,
    progress: store.lessonProgress[progressIndex],
    enrollment: store.enrollments[enrollmentIndex],
    summary,
    nextLesson,
    certificate,
    justCertified,
  };
}

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateReferenceNumber(
  existing: Set<string>,
  issuedAt: string,
) {
  const year = new Date(issuedAt).getUTCFullYear();

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const bytes = randomBytes(6);
    let suffix = "";
    for (const byte of bytes) {
      suffix += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length];
    }
    const reference = `SSA-${year}-${suffix}`;
    if (!existing.has(reference)) {
      return reference;
    }
  }

  return `SSA-${year}-${randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

function issueCertificateIfEligible(
  store: DataStore,
  enrollment: Enrollment,
  now: string,
): Certificate | null {
  if (enrollment.status !== "completed") {
    return null;
  }

  const existing = store.certificates.find(
    (item) => item.enrollmentId === enrollment.id,
  );
  if (existing) {
    return existing;
  }

  const issuedAt = enrollment.completedAt ?? now;
  const referenceNumber = generateReferenceNumber(
    new Set(store.certificates.map((item) => item.referenceNumber)),
    issuedAt,
  );
  const certificate: Certificate = {
    id: randomUUID(),
    enrollmentId: enrollment.id,
    referenceNumber,
    issuedAt,
    fileUrl: `/verify/${referenceNumber}`,
    verificationStatus: "valid",
    createdAt: now,
  };
  store.certificates.push(certificate);
  return certificate;
}

export async function getCertificateForEnrollment(enrollmentId: string) {
  const store = await readStore();
  const enrollment = store.enrollments.find((item) => item.id === enrollmentId);
  if (!enrollment) return null;

  const existing = store.certificates.find(
    (item) => item.enrollmentId === enrollmentId,
  );
  if (existing) return existing;

  const certificate = issueCertificateIfEligible(
    store,
    enrollment,
    new Date().toISOString(),
  );
  if (certificate && !existing) {
    await writeStore(store);
  }
  return certificate;
}

export async function listCertificatesForStudent(studentId: string) {
  const store = await readStore();
  let changed = false;

  for (const enrollment of store.enrollments) {
    if (enrollment.studentId !== studentId) continue;
    const before = store.certificates.length;
    issueCertificateIfEligible(store, enrollment, new Date().toISOString());
    if (store.certificates.length !== before) {
      changed = true;
    }
  }

  if (changed) {
    await writeStore(store);
  }

  return store.certificates.flatMap((certificate) => {
    const enrollment = store.enrollments.find(
      (item) => item.id === certificate.enrollmentId,
    );
    if (!enrollment || enrollment.studentId !== studentId) return [];
    const course = store.courses.find((item) => item.id === enrollment.courseId);
    if (!course) return [];
    return [{ certificate, enrollment, course }];
  });
}

export async function getStudentCertificate(
  studentId: string,
  certificateId: string,
) {
  const records = await listCertificatesForStudent(studentId);
  return records.find((item) => item.certificate.id === certificateId) ?? null;
}

export async function getPublicCertificate(referenceNumber: string) {
  const reference = normalizeReference(referenceNumber);
  if (!reference) return null;

  const store = await readStore();
  const certificate = store.certificates.find(
    (item) => item.referenceNumber === reference,
  );
  if (!certificate) return null;

  const enrollment = store.enrollments.find(
    (item) => item.id === certificate.enrollmentId,
  );
  if (!enrollment) return null;

  const student = store.users.find((item) => item.id === enrollment.studentId);
  const course = store.courses.find((item) => item.id === enrollment.courseId);
  if (!student || !course) return null;

  return {
    certificate,
    courseTitle: course.title,
    studentName: `${student.firstName} ${student.lastName}`,
    issuedAt: certificate.issuedAt,
  };
}
