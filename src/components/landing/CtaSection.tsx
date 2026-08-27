import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-2xl border border-ink/10 bg-amber-tint/30 px-8 py-12 text-center md:px-16 md:py-16">
          <h2 className="text-3xl font-semibold tracking-tight">
            Start your first course today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">
            Join Skillstream Academy and experience enrollment, learning, and
            certification as one connected journey.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-lg bg-amber-core px-8 py-3 text-sm font-medium text-paper hover:bg-amber-dark"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
