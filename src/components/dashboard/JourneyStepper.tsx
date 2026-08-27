import { Check } from "lucide-react";

interface JourneyStepperProps {
  steps: ReadonlyArray<{
    id: string;
    number: string;
    title: string;
    description: string;
  }>;
  activeStepId: string;
}

export function JourneyStepper({ steps, activeStepId }: JourneyStepperProps) {
  const activeIndex = steps.findIndex((step) => step.id === activeStepId);

  return (
    <section className="surface overflow-hidden" aria-labelledby="journey-title">
      <div className="flex flex-col justify-between gap-2 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <h2 id="journey-title" className="font-display text-xl font-semibold">
          Your connected journey
        </h2>
        <p className="text-sm text-muted">
          Three steps, one system
        </p>
      </div>

      <ol className="grid md:grid-cols-3">
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId;
          const isComplete = index < activeIndex;

          return (
            <li
              key={step.id}
              aria-current={isActive ? "step" : undefined}
              className={`relative min-h-40 px-5 py-5 sm:px-6 ${
                index < steps.length - 1
                  ? "border-b border-line md:border-b-0 md:border-r"
                  : ""
              } ${isActive ? "bg-amber-tint/45" : "bg-surface"}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`grid size-8 place-items-center rounded-full text-xs font-semibold ${
                    isComplete
                      ? "bg-success text-white"
                      : isActive
                        ? "bg-amber-core text-paper"
                        : "border border-line bg-surface-muted text-muted"
                  }`}
                >
                  {isComplete ? (
                    <Check aria-label="Complete" size={15} strokeWidth={2.5} />
                  ) : (
                    step.number
                  )}
                </span>
                <span
                  className={`text-xs font-semibold uppercase tracking-[0.14em] ${
                    isActive ? "text-amber-dark" : "text-muted"
                  }`}
                >
                  {isActive ? "Current" : isComplete ? "Complete" : "Up next"}
                </span>
              </div>
              <h3
                className={`mt-5 text-base font-semibold ${
                  isActive ? "text-amber-dark" : "text-ink"
                }`}
              >
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-muted">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
