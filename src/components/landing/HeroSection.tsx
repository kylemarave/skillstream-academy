import Link from "next/link";

const trustItems = [
  "Verified certificates",
  "AI support 24/7",
  "Instant course access",
];

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-7 md:py-24 lg:py-28">
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)]">
        <div>
          <p className="text-sm font-semibold text-amber-dark">
            Enroll · Learn · Get certified
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-medium leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            One connected journey from enrollment to certification
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
            Skillstream Academy removes the manual handoffs between enrolling,
            learning, and earning a verifiable credential — with 24/7 AI support
            along the way.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-amber-core px-6 text-sm font-semibold text-paper shadow-[0_6px_18px_rgb(122_95_30/0.22)] hover:bg-amber-dark"
            >
              Start learning
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-line bg-surface px-6 text-sm font-semibold hover:border-amber-light hover:bg-amber-tint/30"
            >
              See how it works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-muted">
            {trustItems.map((item, index) => (
              <span key={item} className="flex items-center gap-4">
                {index > 0 ? <span className="hidden text-ink/30 sm:inline">·</span> : null}
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="surface p-5 shadow-[0_24px_60px_rgb(28_29_27/0.1)] sm:p-7">
          <div className="space-y-4">
            <div className="rounded-xl bg-amber-tint/60 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-amber-dark">
                Continue learning
              </p>
              <p className="mt-2 text-sm font-medium">Module 4 of 6</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper">
                <div className="h-full w-[65%] rounded-full bg-amber-core" />
              </div>
              <p className="mt-2 text-xs text-ink/60">65% complete</p>
            </div>
            <div className="rounded-xl border border-amber-light/50 bg-amber-tint/30 p-4">
              <p className="text-xs font-medium text-amber-dark">AI</p>
              <p className="mt-1 text-sm">How can I help?</p>
            </div>
            <div className="rounded-xl border border-amber-dark/20 bg-amber-tint/40 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-amber-dark">
                Certificate issued
              </p>
              <p className="mt-1 text-sm text-ink/70">Verifiable credential ready</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
