import { AppShell } from "@/components/AppShell";
import { requireRole } from "@/lib/auth";
import { instructorNav } from "@/lib/nav";

export default async function InstructorEscalationsPage() {
  const session = await requireRole(["instructor"]);

  return (
    <AppShell
      user={session}
      title="Escalation inbox"
      subtitle="Questions the AI assistant could not answer get handed to you here."
      nav={instructorNav}
    >
      <div className="card px-5 py-10">
        <p className="text-sm font-medium">No escalations</p>
        <p className="mt-1 max-w-md text-sm text-muted">
          Once the AI assistant is live, unresolved student questions will
          arrive here and move through pending, in progress, and resolved.
        </p>
      </div>
    </AppShell>
  );
}
