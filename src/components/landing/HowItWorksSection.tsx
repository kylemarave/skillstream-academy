const steps = [
  {
    number: "01",
    title: "Enroll",
    description:
      "Confirm enrollment and your LMS account is provisioned automatically.",
  },
  {
    number: "02",
    title: "Learn",
    description:
      "Track lessons and progress, with 24/7 AI support along the way.",
  },
  {
    number: "03",
    title: "Get certified",
    description:
      "Course completion auto-issues a verifiable certificate.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t border-ink/10 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-medium tracking-[-0.03em]">How it works</h2>
          <p className="mt-3 text-muted">
            Three steps, one connected system — no manual handoffs in between.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="border-t border-line py-6 md:border-t-0 md:border-l md:px-6"
            >
              <p className="text-sm font-semibold text-amber-core">{step.number}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
