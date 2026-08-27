import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

const navLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#connected", label: "What it connects" },
  { href: "/#roles", label: "For students and instructors" },
  { href: "/verify", label: "Verify" },
];

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-5 py-3 sm:px-7">
        <BrandMark stacked={false} />

        <nav aria-label="Sections" className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center text-sm text-muted hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link href="/login" className="btn btn-primary">
          Sign in
        </Link>
      </div>
    </header>
  );
}
