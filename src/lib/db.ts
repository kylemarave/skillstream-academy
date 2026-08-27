import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type {
  Course,
  CourseModule,
  DataStore,
  Lesson,
  User,
} from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "store.json");

async function readStore(): Promise<DataStore> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as DataStore;
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
  const module: CourseModule = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.modules.push(module);
  await writeStore(store);
  return module;
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
