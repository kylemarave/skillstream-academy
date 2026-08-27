import { ArrowDown, ArrowRight, Bot, Link2 } from "lucide-react";
import { integrations } from "./constants";

export function IntegrationFlow() {
  return (
    <aside className="surface overflow-hidden">
      <div className="border-b border-line bg-ink px-5 py-5 text-paper">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-amber-core">
            <Link2 aria-hidden="true" size={18} strokeWidth={1.9} />
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold">Connected systems</h2>
            <p className="mt-0.5 text-xs text-paper/55">Automated handoffs</p>
          </div>
        </div>
      </div>

      <ol className="divide-y divide-line">
        {integrations.map((integration) => (
          <li
            key={integration.id}
            className="relative px-5 py-5"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-tint text-amber-dark">
                {integration.id === "portal-ai" ? (
                  <Bot aria-hidden="true" size={16} />
                ) : (
                  <ArrowDown aria-hidden="true" size={16} />
                )}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {integration.from}{" "}
                  <ArrowRight
                    aria-hidden="true"
                    size={14}
                    className="mx-1 inline text-amber-core"
                  />{" "}
                  {integration.to}
                </p>
                <p className="mt-0.5 text-xs text-muted">{integration.trigger}</p>
              </div>
            </div>
            <p className="mt-3 pl-11 text-sm leading-5 text-muted">
              {integration.outcome}
            </p>
          </li>
        ))}
      </ol>
    </aside>
  );
}
