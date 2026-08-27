import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { requireRole } from "@/lib/auth";
import { instructorNav } from "@/lib/nav";
import { getCourseById } from "@/lib/db";

type PageProps = { params: Promise<{ id: string }> };

export default async function CourseRosterPage({ params }: PageProps) {
  const session = await requireRole(["instructor"]);
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course || course.instructorId !== session.id) {
    notFound();
  }

  return (
    <AppShell
      user={session}
      title={`Roster · ${course.title}`}
      subtitle="Monitor enrollments and lesson progress — completion here triggers automatic certification."
      nav={instructorNav}
    >
      <div className="mb-6">
        <Link
          href={`/instructor/courses/${course.id}`}
          className="text-sm text-amber-core hover:text-amber-dark"
        >
          ← Back to course
        </Link>
      </div>
      <div className="rounded-2xl border border-dashed border-ink/15 bg-white p-10 text-center">
        <p className="font-medium">No enrollments yet</p>
        <p className="mx-auto mt-2 max-w-lg text-sm text-ink/70">
          When students enroll, their progress appears here. Completing all lessons
          triggers Integration 2 — certificate auto-issued with a verification number.
        </p>
      </div>
    </AppShell>
  );
}
