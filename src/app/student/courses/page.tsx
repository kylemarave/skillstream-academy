import { BookOpen, Clock, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { JourneyStepper } from "@/components/dashboard/JourneyStepper";
import { StatusBadge } from "@/components/StatusBadge";
import { studentJourneySteps } from "@/components/dashboard/constants";
import { requireRole } from "@/lib/auth";
import { listCourses } from "@/lib/db";
import { studentNav } from "@/lib/nav";

export default async function StudentCoursesPage() {
  const session = await requireRole(["student"]);
  const courses = await listCourses({ status: "published" });

  return (
    <AppShell
      user={session}
      title="Course catalog"
      subtitle="Step 01 of your journey — enroll in a published course. Your LMS account provisions automatically on confirmation."
      nav={studentNav}
    >
      <div className="mb-8">
        <JourneyStepper steps={studentJourneySteps} activeStepId="enroll" />
      </div>

      {courses.length === 0 ? (
        <div className="surface px-6 py-14 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-surface-muted text-amber-dark">
            <Search aria-hidden="true" size={21} />
          </span>
          <p className="mt-4 font-medium">No courses are open for enrollment</p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
            Instructors publish courses from their dashboard. Once live, they appear here
            for instant enrollment and LMS provisioning.
          </p>
        </div>
      ) : (
        <section className="surface overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-line px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-display text-xl font-semibold">Open courses</h2>
              <p className="mt-1 text-sm text-muted">
                {courses.length} course{courses.length === 1 ? "" : "s"} available
              </p>
            </div>
            <div className="flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface-muted px-3 text-sm text-muted">
              <Search aria-hidden="true" size={16} />
              Search and filters are planned
            </div>
          </div>

          <div className="divide-y divide-line">
          {courses.map((course) => (
            <article
              key={course.id}
                className="group grid gap-5 px-5 py-6 sm:px-6 lg:grid-cols-[48px_minmax(0,1fr)_180px] lg:items-center"
            >
                <span className="grid size-12 place-items-center rounded-xl bg-amber-tint text-amber-dark">
                  <BookOpen aria-hidden="true" size={20} strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-xl font-semibold">{course.title}</h3>
                    <StatusBadge status={course.status} />
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                    {course.description || "Course description coming soon."}
                  </p>
                  <p className="mt-3 flex items-center gap-2 text-xs font-medium text-muted">
                    <Clock aria-hidden="true" size={14} />
                    Self-paced · LMS access on enrollment
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-ink">
                  ${course.price.toFixed(2)}
                  </p>
                <button
                  type="button"
                  disabled
                    aria-describedby={`enrollment-status-${course.id}`}
                    className="mt-2 min-h-11 w-full rounded-lg border border-line bg-surface-muted px-4 text-sm font-semibold text-muted"
                >
                    Enrollment coming soon
                </button>
                  <p id={`enrollment-status-${course.id}`} className="sr-only">
                    Enrollment and payment are not implemented yet.
                  </p>
              </div>
            </article>
          ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}
