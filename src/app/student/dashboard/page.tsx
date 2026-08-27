import Link from "next/link";
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
      <div className="space-y-10">
        <JourneyStepper steps={studentJourneySteps} activeStepId="enroll" />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-3">
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
            </div>

            <section className="rounded-2xl border border-ink/10 bg-white p-6">
              <h2 className="font-semibold">Quick actions</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                <QuickActionCard
                  title="AI Learning Assistant"
                  description="24/7 progress-aware help — escalates to your instructor when needed."
                  href="/student/courses"
                  disabled
                />
              </div>
            </section>

            <section className="rounded-2xl border border-dashed border-amber-core/30 bg-amber-tint/20 p-6">
              <h2 className="font-semibold">What happens when you enroll</h2>
              <ol className="mt-4 space-y-3 text-sm text-ink/70">
                <li className="flex gap-3">
                  <span className="font-semibold text-amber-core">1.</span>
                  Payment confirms your enrollment
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-amber-core">2.</span>
                  Your LMS account is auto-provisioned — instant course access
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-amber-core">3.</span>
                  Complete all lessons → certificate auto-issued with verification number
                </li>
              </ol>
            </section>
          </div>

          <IntegrationFlow />
        </div>

        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Available courses</h2>
              <p className="mt-1 text-sm text-ink/70">
                {courses.length} published course{courses.length === 1 ? "" : "s"} ready to enroll
              </p>
            </div>
            <Link
              href="/student/courses"
              className="text-sm font-medium text-amber-core hover:text-amber-dark"
            >
              View all →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {courses.slice(0, 2).map((course) => (
              <article
                key={course.id}
                className="rounded-2xl border border-ink/10 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{course.title}</h3>
                  <StatusBadge status={course.status} />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-ink/70">{course.description}</p>
                <p className="mt-4 text-lg font-semibold text-amber-core">
                  ${course.price.toFixed(2)}
                </p>
              </article>
            ))}
            {courses.length === 0 ? (
              <p className="text-sm text-ink/60 md:col-span-2">
                No published courses yet. Check back soon.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
