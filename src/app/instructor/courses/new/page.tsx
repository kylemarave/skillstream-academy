import { AppShell } from "@/components/AppShell";
import { CreateCourseForm } from "@/components/CreateCourseForm";
import { JourneyStepper } from "@/components/dashboard/JourneyStepper";
import { instructorJourneySteps } from "@/components/dashboard/constants";
import { requireRole } from "@/lib/auth";
import { instructorNav } from "@/lib/nav";

export default async function NewCoursePage() {
  const session = await requireRole(["instructor"]);

  return (
    <AppShell
      user={session}
      title="Create course"
      subtitle="Step 01 — author your course. Modules and lessons come next, then publish to the student catalog."
      nav={instructorNav}
    >
      <div className="mb-8">
        <JourneyStepper steps={instructorJourneySteps} activeStepId="create" />
      </div>
      <CreateCourseForm />
    </AppShell>
  );
}
