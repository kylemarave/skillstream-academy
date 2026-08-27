import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { listCourses } from "@/lib/db";
import { instructorNav } from "@/lib/nav";

export default async function InstructorCoursesPage() {
  const session = await requireRole(["instructor"]);
  const courses = await listCourses({ instructorId: session.id });

  return (
    <AppShell
      user={session}
      title="My courses"
      subtitle="Drafts are private to you. Published courses appear in the student catalog."
      nav={instructorNav}
      actions={
        <Link href="/instructor/courses/new" className="btn btn-primary">
          <Plus aria-hidden="true" size={16} />
          New course
        </Link>
      }
    >
      {courses.length === 0 ? (
        <div className="card px-5 py-10">
          <p className="text-sm font-medium">No courses yet</p>
          <p className="mt-1 max-w-md text-sm text-muted">
            Start with a title, description, and price. You can add modules and
            lessons before publishing.
          </p>
          <Link href="/instructor/courses/new" className="btn btn-primary mt-4">
            <Plus aria-hidden="true" size={16} />
            Create a course
          </Link>
        </div>
      ) : (
        <section aria-labelledby="library-title" className="card">
          <div className="border-b border-line px-5 py-4">
            <h2 id="library-title" className="section-title">
              {courses.length} course{courses.length === 1 ? "" : "s"}
            </h2>
          </div>

          <ul className="divide-y divide-line">
            {courses.map((course) => (
              <li key={course.id}>
                <Link
                  href={`/instructor/courses/${course.id}`}
                  className="grid gap-2 px-5 py-4 hover:bg-subtle sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-medium">
                        {course.title}
                      </h3>
                      <StatusBadge status={course.status} />
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted">
                      {course.description || "No description yet."}
                    </p>
                  </div>
                  <p className="text-sm text-muted tabular-nums sm:text-right">
                    ${course.price.toFixed(2)} · updated{" "}
                    {new Date(course.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AppShell>
  );
}
