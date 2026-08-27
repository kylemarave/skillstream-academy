import Link from "next/link";
import { ArrowRight, BookOpen, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { JourneyStepper } from "@/components/dashboard/JourneyStepper";
import { instructorJourneySteps } from "@/components/dashboard/constants";
import { StatusBadge } from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { listCourses } from "@/lib/db";
import { instructorNav } from "@/lib/nav";

export default async function InstructorCoursesPage() {
  const session = await requireRole(["instructor"]);
  const courses = await listCourses({ instructorId: session.id });
  const activeStep =
    courses.some((c) => c.status === "published") ? "support" : courses.length > 0 ? "publish" : "create";

  return (
    <AppShell
      user={session}
      title="My courses"
      subtitle="Each published course triggers automatic LMS provisioning on enrollment and certificate issuance on completion."
      nav={instructorNav}
    >
      <div className="mb-8">
        <JourneyStepper steps={instructorJourneySteps} activeStepId={activeStep} />
      </div>

      {courses.length === 0 ? (
        <div className="surface px-6 py-14 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-surface-muted text-amber-dark">
            <BookOpen aria-hidden="true" size={21} />
          </span>
          <p className="mt-4 font-medium">Start your instructor journey</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Create a course with modules and lessons. When published, students can enroll
            and the system handles LMS setup and certification automatically.
          </p>
          <Link
            href="/instructor/courses/new"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-core px-5 text-sm font-semibold text-paper shadow-[0_5px_14px_rgb(122_95_30/0.2)] hover:bg-amber-dark"
          >
            <Plus aria-hidden="true" size={17} />
            Create your first course
          </Link>
        </div>
      ) : (
        <section className="surface overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-line px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-display text-xl font-semibold">Course library</h2>
              <p className="mt-1 text-sm text-muted">
                {courses.length} course{courses.length === 1 ? "" : "s"} in your workspace
              </p>
            </div>
            <Link
              href="/instructor/courses/new"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-amber-core px-4 text-sm font-semibold text-paper shadow-[0_5px_14px_rgb(122_95_30/0.2)] hover:bg-amber-dark"
            >
              <Plus aria-hidden="true" size={17} />
              Create course
            </Link>
          </div>

          <div className="divide-y divide-line">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/instructor/courses/${course.id}`}
                className="group grid gap-4 px-5 py-5 hover:bg-amber-tint/20 sm:px-6 md:grid-cols-[48px_minmax(0,1fr)_190px_20px] md:items-center"
            >
                <span className="grid size-12 place-items-center rounded-xl bg-surface-muted text-amber-dark">
                  <BookOpen aria-hidden="true" size={20} strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="truncate font-semibold group-hover:text-amber-dark">
                      {course.title}
                    </h3>
                    <StatusBadge status={course.status} />
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-muted">
                    {course.description || "No description yet."}
                  </p>
                  <p className="mt-2 text-xs font-medium text-muted">
                    ${course.price.toFixed(2)} · Updated{" "}
                    {new Date(course.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-sm text-muted">
                  {course.status === "published" ? (
                    <>
                      <p className="font-semibold text-success">Live in catalog</p>
                      <p className="mt-1 text-xs">Enrollment automation active</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-amber-dark">Continue setup</p>
                      <p className="mt-1 text-xs">Add content and publish</p>
                    </>
                  )}
                </div>
                <ArrowRight
                  aria-hidden="true"
                  size={17}
                  className="hidden text-muted group-hover:text-amber-dark md:block"
                />
            </Link>
          ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}
