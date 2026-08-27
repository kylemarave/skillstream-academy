import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-paper px-5 py-12"
    >
      <div className="max-w-lg text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-ink text-paper">
          <GraduationCap aria-hidden="true" size={22} />
        </span>
        <p className="mt-7 text-sm font-semibold text-amber-dark">Page not found</p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-[-0.035em]">
          This lesson is not in the syllabus.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          The page may have moved, or your role may not have access to it.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-core px-5 text-sm font-semibold text-paper hover:bg-amber-dark"
        >
          <ArrowLeft aria-hidden="true" size={17} />
          Return to Skillstream
        </Link>
      </div>
    </main>
  );
}
