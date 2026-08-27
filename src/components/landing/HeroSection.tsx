import Link from "next/link";

const trustItems = [
  "Verified certificates",
  "AI support 24/7",
  "Instant course access",
];

export function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-core">
            Enroll · Learn · Get certified
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            One connected journey from enrollment to certification
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink/70">
            Skillstream Academy removes the manual handoffs between enrolling,
            learning, and earning a verifiable credential — with 24/7 AI support
            along the way.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="rounded-lg bg-amber-core px-6 py-3 text-center text-sm font-medium text-paper hover:bg-amber-dark"
            >
              Start learning
            </Link>
            <a
              href="#how-it-works"
              className="rounded-lg border border-ink/15 px-6 py-3 text-center text-sm font-medium hover:bg-amber-tint/40"
            >
              See how it works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink/60">
            {trustItems.map((item, index) => (
              <span key={item} className="flex items-center gap-4">
                {index > 0 ? <span className="hidden text-ink/30 sm:inline">·</span> : null}
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
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
