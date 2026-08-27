import Link from "next/link";
import { Award, BookOpen, ClipboardCheck } from "lucide-react";

const path = [
  { title: "Enroll", icon: ClipboardCheck },
  { title: "Learn", icon: BookOpen },
  { title: "Get certified", icon: Award },
] as const;

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-12 px-5 py-16 sm:px-7 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(280px,22rem)]">
      <div>
        <h1 className="max-w-xl text-4xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl">
          One connected journey from enrollment to certification
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
          Skillstream Academy removes the manual handoffs between signing up,
          learning, and earning a credential you can verify.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login" className="btn btn-primary">
            Sign in to get started
          </Link>
          <a href="#how-it-works" className="btn btn-secondary">
            See how it works
          </a>
        </div>
      </div>

      <div className="card px-5 py-6">
        <p className="text-sm font-medium">The student path</p>
        <p className="mt-0.5 text-sm text-muted">
          Three steps. Nothing to chase in between.
        </p>

        <ol className="mt-5">
          {path.map((step, index) => {
            const Icon = step.icon;
            const isFirst = index === 0;

            return (
              <li key={step.title} className="flex gap-3">
                <div className="flex flex-col items-center self-stretch">
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-full ${
                      isFirst
                        ? "bg-brand text-white"
                        : "border border-line-strong bg-subtle text-muted"
                    }`}
                  >
                    <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                  </span>
                  {index < path.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className={`mt-1 w-px min-h-4 flex-1 ${isFirst ? "bg-brand" : "bg-line"}`}
                    />
                  ) : null}
                </div>
                <p className={`pt-2 text-sm font-medium ${index < path.length - 1 ? "pb-5" : ""}`}>
                  {step.title}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
