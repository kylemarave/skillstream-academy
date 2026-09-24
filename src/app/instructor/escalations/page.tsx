import { AppShell } from "@/components/AppShell";
import { requireRole } from "@/lib/auth";
import { listEscalationsForInstructor } from "@/lib/db";
import { instructorNav } from "@/lib/nav";

const statusLabels = {
  pending: "Pending",
  in_progress: "In progress",
  resolved: "Resolved",
} as const;

export default async function InstructorEscalationsPage() {
  const session = await requireRole(["instructor"]);
  const rows = await listEscalationsForInstructor(session.id);

  return (
    <AppShell
      user={session}
      title="Escalation inbox"
      subtitle="Questions students send from a course. Replies are not wired yet."
      nav={instructorNav}
    >
      {rows.length === 0 ? (
        <div className="card px-5 py-10">
          <p className="text-sm font-medium">No escalations</p>
          <p className="mt-1 max-w-md text-sm text-muted">
            When a student asks from one of your courses, it shows up here as
            pending.
          </p>
        </div>
      ) : (
        <ul className="card divide-y divide-line">
          {rows.map((row) => (
            <li key={row.id} className="px-5 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium">{row.studentName}</p>
                <span className="rounded-md border border-line bg-subtle px-1.5 py-0.5 text-xs font-medium text-muted">
                  {statusLabels[row.status]}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{row.courseTitle}</p>
              <p className="mt-2 text-sm">{row.question}</p>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
