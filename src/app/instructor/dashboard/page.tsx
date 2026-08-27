import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { IntegrationFlow } from "@/components/dashboard/IntegrationFlow";
import { JourneyStepper } from "@/components/dashboard/JourneyStepper";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { instructorJourneySteps } from "@/components/dashboard/constants";
import { StatusBadge } from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { listCourses } from "@/lib/db";
import { instructorNav } from "@/lib/nav";

export default async function InstructorDashboardPage() {
  const session = await requireRole(["instructor"]);
  const courses = await listCourses({ instructorId: session.id });
  const draftCount = courses.filter((c) => c.status === "draft").length;
  const publishedCount = courses.filter((c) => c.status === "published").length;

  return (
    <AppShell
      user={session}
      title={`Welcome, ${session.firstName}`}
      subtitle="Author courses, monitor student progress, and handle AI escalations — all connected to enrollment and certification."
      nav={instructorNav}
    >
      <div className="space-y-10">
        <JourneyStepper
          steps={instructorJourneySteps}
          activeStepId={publishedCount > 0 ? "support" : draftCount > 0 ? "publish" : "create"}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Draft courses"
                value={draftCount}
                hint="Awaiting publish"
                accent="light"
              />
              <StatCard
                label="Published"
                value={publishedCount}
                hint="Live in student catalog"
                accent="core"
              />
              <StatCard
                label="Escalations"
                value={0}
                hint="AI handoffs pending"
                accent="dark"
              />
            </div>

            <section className="rounded-2xl border border-ink/10 bg-white p-6">
              <h2 className="font-semibold">Quick actions</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <QuickActionCard
                  step="Step 01"
                  title="Create a course"
                  description="Add title, modules, and lessons for your students."
                  href="/instructor/courses/new"
                />
                <QuickActionCard
                  step="Step 02"
                  title="Manage courses"
                  description="Edit content and publish to the student catalog."
                  href="/instructor/courses"
                />
                <QuickActionCard
                  step="Step 03"
                  title="Escalation inbox"
                  description="Resolve queries the AI assistant couldn't handle."
                  href="/instructor/escalations"
                />
                <QuickActionCard
                  title="View rosters"
                  description="Monitor enrollment and lesson progress per course."
                  href="/instructor/courses"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-ink/10 bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-semibold">Your courses</h2>
                <Link
                  href="/instructor/courses/new"
                  className="rounded-lg bg-amber-core px-4 py-2 text-sm font-medium text-paper hover:bg-amber-dark"
                >
                  Create course
                </Link>
              </div>

              {courses.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-ink/15 bg-paper p-8 text-center">
                  <p className="text-ink/70">No courses yet.</p>
                  <Link
                    href="/instructor/courses/new"
                    className="mt-3 inline-block text-sm font-medium text-amber-core"
                  >
                    Create your first course →
                  </Link>
                </div>
              ) : (
                <ul className="mt-6 space-y-3">
                  {courses.map((course) => (
                    <li key={course.id}>
                      <Link
                        href={`/instructor/courses/${course.id}`}
                        className="flex items-center justify-between rounded-xl border border-ink/10 bg-paper px-4 py-3 hover:border-amber-core/40"
                      >
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-ink/60">${course.price.toFixed(2)}</p>
                        </div>
                        <StatusBadge status={course.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <IntegrationFlow />
        </div>
      </div>
    </AppShell>
  );
}
