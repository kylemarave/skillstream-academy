import { AppShell } from "@/components/AppShell";
import { IntegrationFlow } from "@/components/dashboard/IntegrationFlow";
import { StatCard } from "@/components/dashboard/StatCard";
import { requireRole } from "@/lib/auth";

export default async function AdminHomePage() {
  const session = await requireRole(["admin"]);

  return (
    <AppShell
      user={session}
      title="Admin Console"
      subtitle="Phase 6 — deferred per roadmap. Platform operations live here."
      nav={[{ href: "/admin", label: "Overview" }]}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Courses" value="—" hint="Publish & archive" accent="core" />
            <StatCard label="Enrollments" value="—" hint="Platform-wide" accent="light" />
            <StatCard label="Failed syncs" value="—" hint="Needs attention" accent="dark" />
          </div>

          <div className="rounded-2xl border border-amber-desaturated/30 bg-amber-tint/30 p-8">
            <h2 className="text-lg font-semibold">Deferred to Phase 6</h2>
            <p className="mt-3 max-w-2xl text-sm text-ink/70">
              The Admin Console is intentionally not built in this phase. When ready, it
              will include course publishing oversight, enrollment management, system health
              for failed integration events, and user management.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink/70">
              <li>· <strong>/admin/courses</strong> — publish, archive, reassign instructor</li>
              <li>· <strong>/admin/enrollments</strong> — search and fix enrollments</li>
              <li>· <strong>/admin/system-health</strong> — failed LMS and certificate sync</li>
              <li>· <strong>/admin/users</strong> — manage accounts</li>
            </ul>
          </div>
        </div>

        <IntegrationFlow />
      </div>
    </AppShell>
  );
}
