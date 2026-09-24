import { promises as fs } from "fs";
import path from "path";
import { randomBytes, randomUUID } from "crypto";
import type {
  AiConversation,
  AiMessage,
  Certificate,
  Course,
  CourseModule,
  DataStore,
  Enrollment,
  Escalation,
  Lesson,
  LessonProgress,
  LmsAccount,
  User,
} from "./types";
import { normalizeReference } from "./certificates";
import { recordIntegrationEvent } from "./integrationEvents";
import { canAccessLessons } from "./access";
import { attentionReason, lastActivityAt, needsAttention } from "./roster";

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
    integrationEvents: parsed.integrationEvents ?? [],
    aiConversations: parsed.aiConversations ?? [],
    aiMessages: parsed.aiMessages ?? [],
    escalations: parsed.escalations ?? [],
  };
}

async function writeStore(store: DataStore): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export async function registerUser(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "student" | "instructor";
}): Promise<
  | { ok: true; user: User }
  | { ok: false; error: string; status: number }
> {
  const email = input.email.trim().toLowerCase();
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const password = input.password;

  if (!firstName || !lastName) {
    return { ok: false, error: "First and last name are required.", status: 400 };
  }
  if (!email || !email.includes("@")) {
    return { ok: false, error: "A valid email is required.", status: 400 };
  }
  if (password.length < 8) {
    return {
      ok: false,
      error: "Password must be at least 8 characters.",
      status: 400,
    };
  }

  const store = await readStore();
  const existing = store.users.find(
    (user) => user.email.toLowerCase() === email,
  );
  if (existing) {
    return {
      ok: false,
      error: "An account with this email already exists. Sign in instead.",
      status: 409,
    };
  }

  const user: User = {
    id: randomUUID(),
    email,
    password,
    firstName,
    lastName,
    role: input.role,
  };
  store.users.push(user);
  await writeStore(store);
  return { ok: true, user };
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
  input: Partial<Pick<Course, "title" | "description" | "status">>,
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

function resequence<T extends { sequenceOrder: number }>(items: T[]) {
  return items
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
    .map((item, index) => ({ ...item, sequenceOrder: index + 1 }));
}

function swapSequence<T extends { id: string; sequenceOrder: number }>(
  items: T[],
  id: string,
  direction: "up" | "down",
) {
  const ordered = [...items].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  const index = ordered.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= ordered.length) return ordered;

  const current = ordered[index];
  ordered[index] = ordered[target];
  ordered[target] = current;
  return ordered.map((item, nextIndex) => ({
    ...item,
    sequenceOrder: nextIndex + 1,
  }));
}

export async function updateModule(
  id: string,
  input: Partial<Pick<CourseModule, "title">>,
): Promise<CourseModule | undefined> {
  const store = await readStore();
  const index = store.modules.findIndex((courseModule) => courseModule.id === id);
  if (index === -1) return undefined;

  store.modules[index] = {
    ...store.modules[index],
    ...input,
  };
  await writeStore(store);
  return store.modules[index];
}

export async function deleteModule(courseId: string, moduleId: string) {
  const store = await readStore();
  const courseModule = store.modules.find(
    (item) => item.id === moduleId && item.courseId === courseId,
  );
  if (!courseModule) return { ok: false as const };

  const lessonIds = new Set(
    store.lessons
      .filter((lesson) => lesson.moduleId === moduleId)
      .map((lesson) => lesson.id),
  );

  store.lessons = store.lessons.filter((lesson) => lesson.moduleId !== moduleId);
  store.lessonProgress = store.lessonProgress.filter(
    (progress) => !lessonIds.has(progress.lessonId),
  );
  const remaining = store.modules.filter((item) => item.id !== moduleId);
  store.modules = [
    ...remaining.filter((item) => item.courseId !== courseId),
    ...resequence(remaining.filter((item) => item.courseId === courseId)),
  ];
  await writeStore(store);
  return { ok: true as const };
}

export async function moveModule(
  courseId: string,
  moduleId: string,
  direction: "up" | "down",
) {
  const store = await readStore();
  const courseModules = store.modules.filter(
    (item) => item.courseId === courseId,
  );
  const next = swapSequence(courseModules, moduleId, direction);
  if (!next) return undefined;

  const byId = new Map(next.map((item) => [item.id, item.sequenceOrder]));
  store.modules = store.modules.map((item) =>
    item.courseId === courseId && byId.has(item.id)
      ? { ...item, sequenceOrder: byId.get(item.id)! }
      : item,
  );
  await writeStore(store);
  return store.modules
    .filter((item) => item.courseId === courseId)
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
}

export async function updateLesson(
  id: string,
  input: Partial<Pick<Lesson, "title" | "contentType" | "contentRef" | "durationMinutes">>,
): Promise<Lesson | undefined> {
  const store = await readStore();
  const index = store.lessons.findIndex((lesson) => lesson.id === id);
  if (index === -1) return undefined;

  store.lessons[index] = {
    ...store.lessons[index],
    ...input,
  };
  await writeStore(store);
  return store.lessons[index];
}

export async function deleteLesson(moduleId: string, lessonId: string) {
  const store = await readStore();
  const lesson = store.lessons.find(
    (item) => item.id === lessonId && item.moduleId === moduleId,
  );
  if (!lesson) return { ok: false as const };

  store.lessonProgress = store.lessonProgress.filter(
    (progress) => progress.lessonId !== lessonId,
  );
  store.lessons = [
    ...store.lessons.filter((item) => item.moduleId !== moduleId),
    ...resequence(
      store.lessons.filter(
        (item) => item.moduleId === moduleId && item.id !== lessonId,
      ),
    ),
  ];
  await writeStore(store);
  return { ok: true as const };
}

export async function moveLesson(
  moduleId: string,
  lessonId: string,
  direction: "up" | "down",
) {
  const store = await readStore();
  const lessons = store.lessons.filter((item) => item.moduleId === moduleId);
  const next = swapSequence(lessons, lessonId, direction);
  if (!next) return undefined;

  const byId = new Map(next.map((item) => [item.id, item.sequenceOrder]));
  store.lessons = store.lessons.map((item) =>
    item.moduleId === moduleId && byId.has(item.id)
      ? { ...item, sequenceOrder: byId.get(item.id)! }
      : item,
  );
  await writeStore(store);
  return store.lessons
    .filter((item) => item.moduleId === moduleId)
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
}

export async function deleteCourse(courseId: string) {
  const store = await readStore();
  const course = store.courses.find((item) => item.id === courseId);
  if (!course) return { ok: false as const, error: "Course not found.", status: 404 };

  const hasEnrollment = store.enrollments.some(
    (enrollment) =>
      enrollment.courseId === courseId && enrollment.status !== "cancelled",
  );
  if (hasEnrollment) {
    return {
      ok: false as const,
      error: "This course has enrollments. Archive it instead of deleting.",
      status: 409,
    };
  }

  const moduleIds = new Set(
    store.modules
      .filter((item) => item.courseId === courseId)
      .map((item) => item.id),
  );
  const lessonIds = new Set(
    store.lessons
      .filter((lesson) => moduleIds.has(lesson.moduleId))
      .map((lesson) => lesson.id),
  );

  store.lessonProgress = store.lessonProgress.filter(
    (progress) => !lessonIds.has(progress.lessonId),
  );
  store.lessons = store.lessons.filter(
    (lesson) => !moduleIds.has(lesson.moduleId),
  );
  store.modules = store.modules.filter((item) => item.courseId !== courseId);
  store.courses = store.courses.filter((item) => item.id !== courseId);
  await writeStore(store);
  return { ok: true as const };
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
    const progress = progressForEnrollment(store, enrollment.id);
    const activityAt = lastActivityAt(progress);
    const lmsAccount =
      store.lmsAccounts.find((item) => item.enrollmentId === enrollment.id) ??
      null;
    return [
      {
        enrollment,
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
        },
        summary: summarizeProgress(lessons, progress),
        progress,
        lastActivityAt: activityAt,
        needsAttention: needsAttention(
          enrollment,
          activityAt,
          lmsAccount?.syncStatus,
        ),
        attentionReason: attentionReason(
          enrollment,
          activityAt,
          lmsAccount?.syncStatus,
        ),
        lmsAccount,
        certificate:
          store.certificates.find(
            (item) => item.enrollmentId === enrollment.id,
          ) ?? null,
      },
    ];
  });
}

export async function getRosterDetail(courseId: string, enrollmentId: string) {
  const course = await getCourseWithContent(courseId);
  if (!course) return null;

  const roster = await listRosterByCourse(courseId);
  const row = roster.find((item) => item.enrollment.id === enrollmentId);
  if (!row) return null;

  return { ...row, course };
}

export type EnrollResult =
  | { ok: true; enrollment: Enrollment; lmsAccount: LmsAccount }
  | { ok: false; error: string; status: number; enrollment?: Enrollment };

function lmsAccountForEnrollment(store: DataStore, enrollmentId: string) {
  return (
    store.lmsAccounts.find((item) => item.enrollmentId === enrollmentId) ?? null
  );
}

function provisionLmsAccount(
  store: DataStore,
  enrollment: Enrollment,
  lmsAccount: LmsAccount,
  now: string,
  ok = true,
) {
  if (ok) {
    lmsAccount.syncStatus = "provisioned";
    lmsAccount.provisionedAt = now;
    lmsAccount.externalLmsId = `lms-${enrollment.id.slice(0, 8)}`;
    lmsAccount.updatedAt = now;
    if (enrollment.status === "pending" || enrollment.status === "confirmed") {
      enrollment.status = "active";
      enrollment.enrolledAt = enrollment.enrolledAt ?? now;
      enrollment.updatedAt = now;
    }
  } else {
    lmsAccount.syncStatus = "failed";
    lmsAccount.provisionedAt = null;
    lmsAccount.externalLmsId = null;
    lmsAccount.updatedAt = now;
  }

  recordIntegrationEvent(store, {
    enrollmentId: enrollment.id,
    eventType: "enrollment.confirmed",
    payload: {
      courseId: enrollment.courseId,
      studentId: enrollment.studentId,
      lmsAccountId: lmsAccount.id,
      syncStatus: lmsAccount.syncStatus,
    },
    ok,
    error: ok ? undefined : "LMS provisioning failed.",
    at: now,
  });

  return lmsAccount;
}

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
    status: "confirmed",
    enrolledAt: now,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  const lmsAccount: LmsAccount = {
    id: randomUUID(),
    enrollmentId: enrollment.id,
    provisionedAt: null,
    syncStatus: "pending",
    externalLmsId: null,
    createdAt: now,
    updatedAt: now,
  };

  store.enrollments.push(enrollment);
  store.lmsAccounts.push(lmsAccount);
  provisionLmsAccount(store, enrollment, lmsAccount, now, true);
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
      const lmsAccount = lmsAccountForEnrollment(store, enrollment.id);
      return { enrollment, course, summary, certificate, lmsAccount };
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
  const lmsAccount = lmsAccountForEnrollment(store, enrollment.id);
  const certificate =
    enrollment.status === "completed"
      ? await getCertificateForEnrollment(enrollment.id)
      : null;

  return {
    enrollment,
    course,
    progress,
    lessons,
    summary,
    certificate,
    lmsAccount,
  };
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

  const lmsAccount = lmsAccountForEnrollment(store, enrollment.id);
  if (!canAccessLessons(enrollment, lmsAccount)) {
    return {
      ok: false as const,
      error: "Course access is not ready.",
      status: 403,
    };
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
  recordIntegrationEvent(store, {
    enrollmentId: enrollment.id,
    eventType: "enrollment.completed",
    payload: {
      courseId: enrollment.courseId,
      studentId: enrollment.studentId,
      certificateId: certificate.id,
      referenceNumber: certificate.referenceNumber,
    },
    ok: true,
    at: now,
  });
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

export async function revokeCertificate(
  instructorId: string,
  courseId: string,
  enrollmentId: string,
) {
  const store = await readStore();
  const course = store.courses.find((item) => item.id === courseId);
  if (!course) {
    return { ok: false as const, error: "Course not found.", status: 404 };
  }
  if (course.instructorId !== instructorId) {
    return { ok: false as const, error: "Forbidden.", status: 403 };
  }

  const enrollment = store.enrollments.find(
    (item) => item.id === enrollmentId && item.courseId === courseId,
  );
  if (!enrollment) {
    return { ok: false as const, error: "Enrollment not found.", status: 404 };
  }

  const index = store.certificates.findIndex(
    (item) => item.enrollmentId === enrollmentId,
  );
  if (index === -1) {
    return { ok: false as const, error: "No certificate to revoke.", status: 404 };
  }

  store.certificates[index] = {
    ...store.certificates[index],
    verificationStatus: "revoked",
  };
  await writeStore(store);

  return { ok: true as const, certificate: store.certificates[index] };
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

export async function askCourseQuestion(
  studentId: string,
  courseId: string,
  content: string,
) {
  const question = content.trim();
  if (!question) {
    return { ok: false as const, error: "Write a question first.", status: 400 };
  }
  if (question.length > 2000) {
    return {
      ok: false as const,
      error: "Keep the question under 2,000 characters.",
      status: 400,
    };
  }

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

  const course = store.courses.find((item) => item.id === courseId);
  if (!course) {
    return { ok: false as const, error: "Course not found.", status: 404 };
  }

  const contentCourse = await getCourseWithContent(courseId);
  const lessons = contentCourse ? flattenCourseLessons(contentCourse.modules) : [];
  const summary = summarizeProgress(
    lessons,
    progressForEnrollment(store, enrollment.id),
  );
  const now = new Date().toISOString();

  const conversation: AiConversation = {
    id: randomUUID(),
    studentId,
    enrollmentId: enrollment.id,
    startedAt: now,
    endedAt: null,
    contextSnapshot: {
      courseId: course.id,
      courseTitle: course.title,
      enrollmentStatus: enrollment.status,
      completed: summary.completed,
      total: summary.total,
      percent: summary.percent,
      nextLessonTitle: summary.nextLesson?.title ?? null,
    },
  };
  const message: AiMessage = {
    id: randomUUID(),
    conversationId: conversation.id,
    role: "student",
    content: question,
    createdAt: now,
  };
  const escalation: Escalation = {
    id: randomUUID(),
    conversationId: conversation.id,
    instructorId: course.instructorId,
    status: "pending",
    resolutionNotes: null,
    createdAt: now,
    resolvedAt: null,
  };

  store.aiConversations.push(conversation);
  store.aiMessages.push(message);
  store.escalations.push(escalation);
  await writeStore(store);

  return { ok: true as const, escalation, message };
}

export async function listQuestionsForEnrollment(enrollmentId: string) {
  const store = await readStore();
  return store.escalations
    .filter((escalation) => {
      const conversation = store.aiConversations.find(
        (item) => item.id === escalation.conversationId,
      );
      return conversation?.enrollmentId === enrollmentId;
    })
    .map((escalation) => {
      const message = store.aiMessages.find(
        (item) =>
          item.conversationId === escalation.conversationId &&
          item.role === "student",
      );
      return {
        id: escalation.id,
        status: escalation.status,
        createdAt: escalation.createdAt,
        content: message?.content ?? "",
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listEscalationsForInstructor(instructorId: string) {
  const store = await readStore();
  return store.escalations
    .filter((escalation) => escalation.instructorId === instructorId)
    .map((escalation) => {
      const conversation = store.aiConversations.find(
        (item) => item.id === escalation.conversationId,
      );
      const message = store.aiMessages.find(
        (item) =>
          item.conversationId === escalation.conversationId &&
          item.role === "student",
      );
      const student = store.users.find(
        (item) => item.id === conversation?.studentId,
      );
      const course = store.courses.find(
        (item) => item.id === conversation?.contextSnapshot?.courseId,
      );
      return {
        id: escalation.id,
        status: escalation.status,
        createdAt: escalation.createdAt,
        question: message?.content ?? "",
        studentName: student
          ? `${student.firstName} ${student.lastName}`
          : "Student",
        courseTitle: course?.title ?? conversation?.contextSnapshot?.courseTitle ?? "Course",
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
