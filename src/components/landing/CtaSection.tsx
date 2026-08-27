import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-2xl bg-ink px-8 py-14 text-center text-paper shadow-[0_24px_60px_rgb(28_29_27/0.14)] md:px-16 md:py-20">
          <h2 className="font-display text-4xl font-medium tracking-[-0.03em]">
            Start your first course today
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-paper/60">
            Join Skillstream Academy and experience enrollment, learning, and
            certification as one connected journey.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex min-h-12 items-center rounded-lg bg-amber-core px-8 text-sm font-semibold text-paper hover:bg-amber-dark"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
