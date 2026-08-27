import { AppShell } from "@/components/AppShell";
import { JourneyStepper } from "@/components/dashboard/JourneyStepper";
import { instructorJourneySteps } from "@/components/dashboard/constants";
import { requireRole } from "@/lib/auth";
import { instructorNav } from "@/lib/nav";

export default async function InstructorEscalationsPage() {
  const session = await requireRole(["instructor"]);

  return (
    <AppShell
      user={session}
      title="Escalation inbox"
      subtitle="When the AI assistant can't resolve a student query, it hands off here — part of Integration 3 (Portal ↔ AI Assistant)."
      nav={instructorNav}
    >
      <div className="mb-8">
        <JourneyStepper steps={instructorJourneySteps} activeStepId="support" />
      </div>

      <div className="rounded-2xl border border-dashed border-amber-desaturated/30 bg-amber-tint/20 p-10 text-center">
        <p className="font-medium">No escalations yet</p>
        <p className="mx-auto mt-2 max-w-lg text-sm text-ink/70">
          When a student asks the AI for help and it cannot answer, the query
          routes to you with status visible to the student (Pending → In Progress → Resolved).
        </p>
      </div>
    </AppShell>
  );
}
