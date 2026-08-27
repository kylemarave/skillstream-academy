import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-line bg-surface py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:px-7 md:flex-row">
        <div>
          <p className="font-display text-lg font-semibold text-ink">
            Skillstream Academy
          </p>
          <p className="mt-1 text-xs text-muted">
            Academic capstone project · Privacy and terms documentation is planned.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-amber-dark hover:text-ink"
          >
            Sign in
          </Link>
          <p className="text-sm text-muted">© 2026 Skillstream Academy</p>
        </div>
      </div>
    </footer>
  );
}
