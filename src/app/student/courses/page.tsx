import Link from "next/link";
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
        <div className="rounded-2xl border border-dashed border-ink/15 bg-white p-10 text-center">
          <p className="font-medium text-ink/80">No published courses available yet</p>
          <p className="mt-2 text-sm text-ink/60">
            Instructors publish courses from their dashboard. Once live, they appear here
            for instant enrollment and LMS provisioning.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <article
              key={course.id}
              className="flex flex-col rounded-2xl border border-ink/10 bg-white p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-amber-core">
                    Ready to enroll
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">{course.title}</h2>
                </div>
                <StatusBadge status={course.status} />
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
                {course.description || "No description provided."}
              </p>

              <div className="mt-4 rounded-xl bg-amber-tint/40 p-4 text-sm text-ink/70">
                <p className="font-medium text-ink">After enrollment:</p>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>→ LMS account provisioned instantly</li>
                  <li>→ Learn with AI support 24/7</li>
                  <li>→ Certificate issued on completion</li>
                </ul>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-6">
                <span className="text-xl font-semibold text-amber-core">
                  ${course.price.toFixed(2)}
                </span>
                <button
                  type="button"
                  disabled
                  className="rounded-lg bg-amber-core px-5 py-2.5 text-sm font-medium text-paper opacity-50"
                  title="Enrollment flow coming soon"
                >
                  Enroll
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}
