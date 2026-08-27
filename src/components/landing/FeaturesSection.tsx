const features = [
  {
    number: "01",
    title: "Instant course access",
    description:
      "Enrollment auto-provisions your LMS account — no manual setup.",
    mock: (
      <div className="mt-4 rounded-xl bg-amber-tint/50 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-amber-dark">
          Account ready
        </p>
        <p className="mt-2 text-sm text-ink/70">LMS provisioned on enrollment</p>
      </div>
    ),
  },
  {
    number: "AI",
    title: "Support that never sleeps",
    description:
      "24/7 AI assistant, escalates to your instructor when needed.",
    mock: (
      <div className="mt-4 space-y-2">
        <div className="rounded-xl bg-amber-light/40 p-3 text-sm">
          AI: How can I help?
        </div>
        <div className="rounded-xl border border-ink/10 bg-paper p-3 text-sm text-ink/70">
          Explain module 4 quiz...
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Get certified",
    description:
      "Completion auto-issues a verifiable checkable certificate.",
    mock: (
      <div className="mt-4 rounded-xl border-2 border-amber-dark/30 bg-amber-tint/40 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-amber-dark">
          Certificate issued
        </p>
        <p className="mt-2 font-medium">SSA-2026-Verified</p>
        <p className="mt-1 text-xs text-ink/60">Public verification enabled</p>
      </div>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-medium tracking-[-0.03em]">
            One connected learning journey
          </h2>
          <p className="mt-3 text-muted">
            Three systems working as one, so nothing falls through the cracks.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="surface p-6 shadow-[0_12px_32px_rgb(28_29_27/0.05)]"
            >
              <p className="text-sm font-semibold text-amber-core">{feature.number}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {feature.description}
              </p>
              {feature.mock}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
