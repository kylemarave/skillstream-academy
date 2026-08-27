import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EnrollmentBadge } from "@/components/EnrollmentBadge";
import { requireRole } from "@/lib/auth";
import { instructorNav } from "@/lib/nav";
import { getCourseById, listRosterByCourse } from "@/lib/db";

type PageProps = { params: Promise<{ id: string }> };

export default async function CourseRosterPage({ params }: PageProps) {
  const session = await requireRole(["instructor"]);
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course || course.instructorId !== session.id) {
    notFound();
  }

  const roster = await listRosterByCourse(course.id);

  return (
    <AppShell
      user={session}
      title="Roster and progress"
      subtitle={course.title}
      nav={instructorNav}
      actions={
        <Link
          href={`/instructor/courses/${course.id}`}
          className="btn btn-secondary"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back to course
        </Link>
      }
    >
      {roster.length === 0 ? (
        <div className="card px-5 py-10">
          <p className="text-sm font-medium">No enrollments yet</p>
          <p className="mt-1 max-w-md text-sm text-muted">
            Students who enroll in this course will appear here with their
            lesson progress.
          </p>
        </div>
      ) : (
        <section aria-labelledby="roster-title" className="card">
          <div className="border-b border-line px-5 py-4">
            <h2 id="roster-title" className="section-title">
              {roster.length} student{roster.length === 1 ? "" : "s"}
            </h2>
          </div>
          <ul className="divide-y divide-line">
            {roster.map(({ enrollment, student, summary, certificate }) => (
              <li
                key={enrollment.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-muted">
                    {student.email}
                    {enrollment.enrolledAt
                      ? ` · enrolled ${new Date(enrollment.enrolledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm tabular-nums text-muted">
                    {certificate
                      ? certificate.referenceNumber
                      : `${summary.percent}% complete`}
                  </p>
                  <EnrollmentBadge status={enrollment.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AppShell>
  );
}
