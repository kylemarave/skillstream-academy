import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ModuleEditor } from "@/components/ModuleEditor";
import { requireRole } from "@/lib/auth";
import { instructorNav } from "@/lib/nav";
import { getCourseWithContent } from "@/lib/db";

type PageProps = { params: Promise<{ id: string }> };

export default async function CourseModulesPage({ params }: PageProps) {
  const session = await requireRole(["instructor"]);
  const { id } = await params;
  const course = await getCourseWithContent(id);

  if (!course || course.instructorId !== session.id) {
    notFound();
  }

  return (
    <AppShell
      user={session}
      title={`Modules · ${course.title}`}
      subtitle="Build lesson content — students track progress here during Step 02 (Learn)."
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
      <ModuleEditor courseId={course.id} initialModules={course.modules} />
    </AppShell>
  );
}
