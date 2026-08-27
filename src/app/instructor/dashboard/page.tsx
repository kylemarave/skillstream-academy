import Link from "next/link";
import { ArrowRight, BookOpen, Plus } from "lucide-react";
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
      <div className="space-y-8">
        <JourneyStepper
          steps={instructorJourneySteps}
          activeStepId={publishedCount > 0 ? "support" : draftCount > 0 ? "publish" : "create"}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="surface grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
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
            </section>

            <section className="surface px-5 py-2 sm:px-6">
              <div className="border-b border-line py-4">
                <h2 className="font-display text-xl font-semibold">Teaching workspace</h2>
                <p className="mt-1 text-sm text-muted">
                  Create content first, then monitor the students using it.
                </p>
              </div>
              <div>
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
              </div>
            </section>

            <section className="surface overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
                <div>
                  <h2 className="font-display text-xl font-semibold">Your courses</h2>
                  <p className="mt-1 text-sm text-muted">
                    Draft, publish, and review course content.
                  </p>
                </div>
                <Link
                  href="/instructor/courses/new"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-core px-4 text-sm font-semibold text-paper shadow-[0_5px_14px_rgb(122_95_30/0.22)] hover:bg-amber-dark"
                >
                  <Plus aria-hidden="true" size={17} />
                  Create course
                </Link>
              </div>

              {courses.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <span className="mx-auto grid size-12 place-items-center rounded-xl bg-surface-muted text-amber-dark">
                    <BookOpen aria-hidden="true" size={21} />
                  </span>
                  <p className="mt-4 font-medium">Create your first course</p>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
                    Start with a title and outline. You can add modules and lessons next.
                  </p>
                  <Link
                    href="/instructor/courses/new"
                    className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-amber-dark"
                  >
                    Start course setup
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {courses.map((course) => (
                    <li key={course.id}>
                      <Link
                        href={`/instructor/courses/${course.id}`}
                        className="group flex items-center gap-4 px-5 py-4 hover:bg-amber-tint/20 sm:px-6"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface-muted text-amber-dark">
                          <BookOpen aria-hidden="true" size={18} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium group-hover:text-amber-dark">
                            {course.title}
                          </p>
                          <p className="mt-0.5 text-sm text-muted">
                            ${course.price.toFixed(2)} · Updated{" "}
                            {new Date(course.updatedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <StatusBadge status={course.status} />
                        <ArrowRight
                          aria-hidden="true"
                          size={17}
                          className="hidden text-muted group-hover:text-amber-dark sm:block"
                        />
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
