import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 sm:px-7 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted">
          Skillstream Academy — academic project. No real student data.
        </p>
        <div className="flex items-center gap-5">
          <Link
            href="/verify"
            className="text-sm font-semibold text-brand hover:text-brand-strong"
          >
            Verify a certificate
          </Link>
          <p className="text-sm text-muted">© 2026</p>
        </div>
      </div>
    </footer>
  );
}
