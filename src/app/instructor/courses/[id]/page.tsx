import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { instructorNav } from "@/lib/nav";
import { getCourseById } from "@/lib/db";

type PageProps = { params: Promise<{ id: string }> };

const pipelineSteps = [
  { label: "Student enrolls", detail: "Registration confirms payment" },
  { label: "LMS provisioned", detail: "Integration 1 — instant access" },
  { label: "Student learns", detail: "Lessons + AI assistant" },
  { label: "Certificate issued", detail: "Integration 2 — on completion" },
];

export default async function InstructorCourseDetailPage({ params }: PageProps) {
  const session = await requireRole(["instructor"]);
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course || course.instructorId !== session.id) {
    notFound();
  }

  return (
    <AppShell
      user={session}
      title={course.title}
      subtitle={course.description || "Manage this course and its connected lifecycle."}
      nav={instructorNav}
    >
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <StatusBadge status={course.status} />
        <span className="text-sm text-ink/60">${course.price.toFixed(2)}</span>
      </div>

      <section className="mb-8 rounded-2xl border border-ink/10 bg-amber-tint/20 p-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-core">
          Connected lifecycle for this course
        </p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pipelineSteps.map((step, index) => (
            <li
              key={step.label}
              className="rounded-xl border border-ink/10 bg-white p-4"
            >
              <p className="text-xs font-semibold text-amber-core">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 font-medium">{step.label}</p>
              <p className="mt-1 text-xs text-ink/60">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={`/instructor/courses/${course.id}/modules`}
          className="rounded-2xl border border-ink/10 bg-white p-6 hover:border-amber-core/40"
        >
          <p className="text-xs font-medium text-amber-core">Step 01 · Create</p>
          <h2 className="mt-2 font-semibold">Modules & lessons</h2>
          <p className="mt-2 text-sm text-ink/70">
            Build the content students will learn — organized into modules.
          </p>
        </Link>

        <Link
          href={`/instructor/courses/${course.id}/roster`}
          className="rounded-2xl border border-ink/10 bg-white p-6 hover:border-amber-core/40"
        >
          <p className="text-xs font-medium text-amber-core">Step 03 · Support</p>
          <h2 className="mt-2 font-semibold">Roster & progress</h2>
          <p className="mt-2 text-sm text-ink/70">
            View enrolled students and monitor lesson completion.
          </p>
        </Link>
      </div>
    </AppShell>
  );
}
