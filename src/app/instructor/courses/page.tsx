import Link from "next/link";
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

      <div className="mb-6 flex justify-end">
        <Link
          href="/instructor/courses/new"
          className="rounded-lg bg-amber-core px-4 py-2 text-sm font-medium text-paper hover:bg-amber-dark"
        >
          Create course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-white p-10 text-center">
          <p className="font-medium">Start your instructor journey</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">
            Create a course with modules and lessons. When published, students can enroll
            and the system handles LMS setup and certification automatically.
          </p>
          <Link
            href="/instructor/courses/new"
            className="mt-6 inline-block rounded-lg bg-amber-core px-6 py-2.5 text-sm font-medium text-paper hover:bg-amber-dark"
          >
            Create your first course
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/instructor/courses/${course.id}`}
              className="rounded-2xl border border-ink/10 bg-white p-6 transition hover:border-amber-core/40"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold">{course.title}</h2>
                    <StatusBadge status={course.status} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-ink/70">
                    {course.description || "No description yet."}
                  </p>
                  <p className="mt-3 text-sm font-medium text-amber-core">
                    ${course.price.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-tint/40 px-4 py-3 text-xs text-ink/70 sm:max-w-[200px]">
                  {course.status === "published" ? (
                    <>
                      <p className="font-medium text-ink">Live in catalog</p>
                      <p className="mt-1">Enrollments → LMS → Certificates</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-ink">Draft</p>
                      <p className="mt-1">Add modules & publish when ready</p>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
