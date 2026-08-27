import Link from "next/link";
import { Award, BookOpen, ClipboardCheck } from "lucide-react";

const path = [
  { label: "Enroll", icon: ClipboardCheck },
  { label: "Learn", icon: BookOpen },
  { label: "Certify", icon: Award },
] as const;

export function CtaSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-7">
        <div className="card flex flex-wrap items-center justify-between gap-6 px-6 py-8">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Start your first course
            </h2>
            <p className="mt-1.5 max-w-md text-sm text-muted">
              Sign in with a demo account to see the student and instructor
              workspaces.
            </p>
            <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              {path.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.label}
                    className="flex items-center gap-4 text-sm text-muted"
                  >
                    {index > 0 ? (
                      <span aria-hidden="true" className="h-px w-4 bg-line" />
                    ) : null}
                    <span className="flex items-center gap-1.5">
                      <Icon aria-hidden="true" size={15} strokeWidth={1.8} />
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <Link href="/login" className="btn btn-primary">
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
