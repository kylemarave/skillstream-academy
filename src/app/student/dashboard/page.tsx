import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { IntegrationFlow } from "@/components/dashboard/IntegrationFlow";
import { JourneyStepper } from "@/components/dashboard/JourneyStepper";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { studentJourneySteps } from "@/components/dashboard/constants";
import { StatusBadge } from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { listCourses } from "@/lib/db";
import { studentNav } from "@/lib/nav";

export default async function StudentDashboardPage() {
  const session = await requireRole(["student"]);
  const courses = await listCourses({ status: "published" });

  return (
    <AppShell
      user={session}
      title={`Welcome back, ${session.firstName}`}
      subtitle="Your learning journey is connected from enrollment to certification — with AI support at every step."
      nav={studentNav}
    >
      <div className="space-y-8">
        <JourneyStepper steps={studentJourneySteps} activeStepId="enroll" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="surface grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <StatCard
                label="Enrolled"
                value={0}
                hint="Courses you've confirmed"
                accent="core"
              />
              <StatCard
                label="In progress"
                value={0}
                hint="Active learning paths"
                accent="light"
              />
              <StatCard
                label="Certified"
                value={0}
                hint="Verifiable credentials earned"
                accent="dark"
              />
            </section>

            <section className="surface px-5 py-2 sm:px-6">
              <div className="border-b border-line py-4">
                <h2 className="font-display text-xl font-semibold">What to do next</h2>
                <p className="mt-1 text-sm text-muted">
                  Start with enrollment. The rest of the journey unlocks automatically.
                </p>
              </div>
              <div>
                <QuickActionCard
                  step="Step 01"
                  title="Browse catalog"
                  description="Find a published course and start your enrollment."
                  href="/student/courses"
                />
                <QuickActionCard
                  step="Step 02"
                  title="Continue learning"
                  description="Pick up where you left off in your course player."
                  href="/student/courses"
                  disabled
                />
                <QuickActionCard
                  step="Step 03"
                  title="View certificates"
                  description="Download and verify credentials after completion."
                  href="/student/courses"
                  disabled
                />
              </div>
            </section>

            <section className="surface flex flex-col gap-5 bg-ink p-6 text-paper sm:flex-row sm:items-center">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-core">
                <Sparkles aria-hidden="true" size={20} strokeWidth={1.8} />
              </span>
              <div className="flex-1">
                <h2 className="font-display text-xl font-semibold">AI support follows your progress</h2>
                <p className="mt-1 text-sm leading-6 text-paper/60">
                  Ask questions in context. If the assistant cannot resolve one,
                  it sends the conversation to your instructor.
                </p>
              </div>
              <span className="rounded-md border border-paper/15 px-3 py-1.5 text-xs font-medium text-paper/65">
                Unlocks after enrollment
              </span>
            </section>
          </div>

          <IntegrationFlow />
        </div>

        <section className="surface overflow-hidden">
          <div className="flex items-end justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-display text-xl font-semibold">Available courses</h2>
              <p className="mt-1 text-sm text-muted">
                {courses.length} published course{courses.length === 1 ? "" : "s"} ready to enroll
              </p>
            </div>
            <Link
              href="/student/courses"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-amber-dark hover:text-ink"
            >
              View catalog
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <div className="divide-y divide-line">
            {courses.slice(0, 2).map((course) => (
              <Link
                key={course.id}
                href="/student/courses"
                className="group flex flex-col gap-4 px-5 py-5 hover:bg-amber-tint/20 sm:flex-row sm:items-center sm:px-6"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-muted text-amber-dark">
                  <BookOpen aria-hidden="true" size={19} strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold group-hover:text-amber-dark">{course.title}</h3>
                    <StatusBadge status={course.status} />
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-muted">{course.description}</p>
                </div>
                <p className="text-base font-semibold text-ink">
                  ${course.price.toFixed(2)}
                </p>
              </Link>
            ))}
            {courses.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="font-medium">No courses are open yet</p>
                <p className="mt-1 text-sm text-muted">
                  Published courses will appear here.
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
