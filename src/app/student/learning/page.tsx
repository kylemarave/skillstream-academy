import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { CourseCover } from "@/components/dashboard/CourseCover";
import { EnrollmentBadge } from "@/components/EnrollmentBadge";
import { ProgressMeter } from "@/components/player/ProgressMeter";
import { requireRole } from "@/lib/auth";
import { listLearningForStudent } from "@/lib/db";
import { studentNav } from "@/lib/nav";

export default async function StudentLearningPage() {
  const session = await requireRole(["student"]);
  const enrolled = await listLearningForStudent(session.id);

  return (
    <AppShell
      user={session}
      title="My courses"
      subtitle="Open a course to work through lessons. Completing every lesson finishes the course."
      nav={studentNav}
      actions={
        <Link href="/student/courses" className="btn btn-secondary">
          Browse catalog
        </Link>
      }
    >
      {enrolled.length === 0 ? (
        <div className="card px-5 py-10">
          <p className="text-sm font-medium">You are not enrolled yet</p>
          <p className="mt-1 max-w-md text-sm text-muted">
            Open the catalog, pick a published course, and confirm your place.
            Access is set up as soon as you enroll.
          </p>
          <Link href="/student/courses" className="btn btn-primary mt-4">
            Go to catalog
          </Link>
        </div>
      ) : (
        <section aria-labelledby="learning-title" className="card">
          <div className="border-b border-line px-5 py-4">
            <h2 id="learning-title" className="section-title">
              {enrolled.length} course{enrolled.length === 1 ? "" : "s"}
            </h2>
          </div>
          <ul className="divide-y divide-line">
            {enrolled.map(({ enrollment, course, summary, certificate }) => {
              const href = summary.nextLesson
                ? `/student/learning/${course.id}/lessons/${summary.nextLesson.id}`
                : `/student/learning/${course.id}`;

              return (
                <li
                  key={enrollment.id}
                  className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center"
                >
                  <CourseCover title={course.title} status={course.status} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{course.title}</p>
                    <div className="mt-2 max-w-md">
                      <ProgressMeter
                        completed={summary.completed}
                        total={summary.total}
                        percent={summary.percent}
                      />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <EnrollmentBadge status={enrollment.status} />
                    <Link href={href} className="btn btn-secondary">
                      {enrollment.status === "completed"
                        ? "Review"
                        : summary.completed === 0
                          ? "Start"
                          : "Continue"}
                    </Link>
                    {certificate ? (
                      <Link
                        href={`/student/certificates/${certificate.id}`}
                        className="btn btn-quiet"
                      >
                        Certificate
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </AppShell>
  );
}
