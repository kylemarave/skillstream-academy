import { integrations } from "./constants";

export function IntegrationFlow() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-core">
        Connected systems
      </p>
      <h3 className="mt-2 font-semibold">Three integrations working as one</h3>
      <p className="mt-1 text-sm text-ink/70">
        Nothing falls through the cracks — each handoff is automated.
      </p>

      <ul className="mt-6 space-y-4">
        {integrations.map((integration) => (
          <li
            key={integration.id}
            className="rounded-xl border border-ink/10 bg-paper p-4"
          >
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
              <span className="rounded-md bg-amber-tint px-2 py-1">{integration.from}</span>
              <span className="text-amber-core">→</span>
              <span className="rounded-md bg-amber-tint px-2 py-1">{integration.to}</span>
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-ink/50">
              When: {integration.trigger}
            </p>
            <p className="mt-1 text-sm text-ink/70">{integration.outcome}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
