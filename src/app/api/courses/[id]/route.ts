import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getCourseById,
  getCourseWithContent,
  updateCourse,
} from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

async function canAccessCourse(
  courseId: string,
  role: string,
  userId: string,
) {
  const course = await getCourseById(courseId);
  if (!course) return { allowed: false as const, course: null };

  if (role === "admin") return { allowed: true as const, course };
  if (role === "instructor" && course.instructorId === userId) {
    return { allowed: true as const, course };
  }
  if (role === "student" && course.status === "published") {
    return { allowed: true as const, course };
  }

  return { allowed: false as const, course };
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const access = await canAccessCourse(id, session.role, session.id);
  if (!access.allowed || !access.course) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const withContent = await getCourseWithContent(id);
  return NextResponse.json(withContent);
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session || session.role !== "instructor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const access = await canAccessCourse(id, session.role, session.id);
  if (!access.allowed || !access.course) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await request.json()) as {
    title?: string;
    description?: string;
    price?: number;
    status?: "draft" | "published" | "archived";
  };

  const updates: Parameters<typeof updateCourse>[1] = {};

  if (body.title !== undefined) updates.title = body.title.trim();
  if (body.description !== undefined) {
    updates.description = body.description.trim();
  }
  if (body.price !== undefined) updates.price = Number(body.price);
  if (body.status !== undefined) updates.status = body.status;

  const course = await updateCourse(id, updates);

  return NextResponse.json(course);
}
