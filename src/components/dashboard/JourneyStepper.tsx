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
    <div className="rounded-2xl border border-ink/10 bg-white p-6 md:p-8">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-core">
        Your connected journey
      </p>
      <p className="mt-2 text-sm text-ink/70">
        Three steps, one system — no manual handoffs in between.
      </p>

      <ol className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId;
          const isComplete = index < activeIndex;

          return (
            <li
              key={step.id}
              className={`relative rounded-xl border p-5 transition ${
                isActive
                  ? "border-amber-core bg-amber-tint/40"
                  : isComplete
                    ? "border-amber-light/50 bg-amber-tint/20"
                    : "border-ink/10 bg-paper"
              }`}
            >
              {index < steps.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute -right-3 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-amber-core/30 md:block"
                />
              ) : null}
              <p
                className={`text-sm font-semibold ${
                  isActive || isComplete ? "text-amber-core" : "text-ink/40"
                }`}
              >
                {step.number}
              </p>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                {step.description}
              </p>
              {isActive ? (
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-amber-dark">
                  You are here
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
