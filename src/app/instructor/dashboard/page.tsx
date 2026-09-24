import Link from "next/link";
import {
  BookOpen,
  MessageSquareText,
  PenLine,
  Plus,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CourseCover } from "@/components/dashboard/CourseCover";
import { IntegrationFlow } from "@/components/dashboard/IntegrationFlow";
import { JourneyStepper } from "@/components/dashboard/JourneyStepper";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { instructorJourneySteps } from "@/components/dashboard/constants";
import { StatusBadge } from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { listCourses, listEscalationsForInstructor } from "@/lib/db";
import { instructorNav } from "@/lib/nav";

export default async function InstructorDashboardPage() {
  const session = await requireRole(["instructor"]);
  const courses = await listCourses({ instructorId: session.id });
  const draftCount = courses.filter((c) => c.status === "draft").length;
  const publishedCount = courses.filter((c) => c.status === "published").length;
  const escalations = await listEscalationsForInstructor(session.id);
  const pendingEscalations = escalations.filter(
    (row) => row.status === "pending",
  ).length;

  return (
    <AppShell
      user={session}
      title={`Welcome, ${session.firstName}`}
      subtitle="Author courses, publish them to the catalog, and support the students taking them."
      nav={instructorNav}
      actions={
        <Link href="/instructor/courses/new" className="btn btn-primary">
          <Plus aria-hidden="true" size={16} />
          New course
        </Link>
      }
    >
      <div className="space-y-6">
        <JourneyStepper
          steps={instructorJourneySteps}
          activeStepId={
            publishedCount > 0 ? "support" : draftCount > 0 ? "publish" : "create"
          }
        />

        <section
          aria-label="Your numbers"
          className="card grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          <StatCard
            label="Drafts"
            value={draftCount}
            hint="Not yet published"
            icon={PenLine}
            tone="warn"
          />
          <StatCard
            label="Published"
            value={publishedCount}
            hint="Live in the catalog"
            icon={BookOpen}
            tone="success"
          />
          <StatCard
            label="Escalations"
            value={pendingEscalations}
            hint="Waiting on you"
            icon={MessageSquareText}
            tone="muted"
          />
        </section>

        <section aria-labelledby="courses-title" className="card">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <h2 id="courses-title" className="section-title">
              Your courses
            </h2>
            <Link
              href="/instructor/courses"
              className="text-sm font-medium text-brand hover:text-brand-strong"
            >
              View all
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="px-5 py-8">
              <p className="text-sm font-medium">No courses yet</p>
              <p className="mt-1 max-w-md text-sm text-muted">
                Create one with a title and description, then add modules and
                lessons before publishing it.
              </p>
              <Link
                href="/instructor/courses/new"
                className="btn btn-secondary mt-4"
              >
                <Plus aria-hidden="true" size={16} />
                Create your first course
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {courses.slice(0, 5).map((course) => (
                <li key={course.id}>
                  <Link
                    href={`/instructor/courses/${course.id}`}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-subtle"
                  >
                    <CourseCover title={course.title} status={course.status} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {course.title}
                      </p>
                      <p className="mt-0.5 text-sm text-muted">
                        Updated{" "}
                        {new Date(course.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <StatusBadge status={course.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="teaching-title" className="card">
          <div className="border-b border-line px-5 py-4">
            <h2 id="teaching-title" className="section-title">
              Teaching tasks
            </h2>
          </div>
          <div className="divide-y divide-line">
            <QuickActionCard
              title="Create a course"
              description="Set the title and description."
              href="/instructor/courses/new"
              icon={PenLine}
            />
            <QuickActionCard
              title="Manage course content"
              description="Add modules and lessons, then publish."
              href="/instructor/courses"
              icon={BookOpen}
            />
            <QuickActionCard
              title="Escalation inbox"
              description="Questions students send from a course."
              href="/instructor/escalations"
              icon={MessageSquareText}
            />
          </div>
        </section>

        <IntegrationFlow />
      </div>
    </AppShell>
  );
}
