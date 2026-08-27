"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#for-instructors", label: "For Instructors" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight text-ink">
          Skillstream Academy
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink/70 transition hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-ink/70 hover:text-ink"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-amber-core px-4 py-2 text-sm font-medium text-paper hover:bg-amber-dark"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="rounded-lg border border-ink/15 p-2 md:hidden"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="block h-0.5 w-5 bg-ink" />
          <span className="mt-1 block h-0.5 w-5 bg-ink" />
          <span className="mt-1 block h-0.5 w-5 bg-ink" />
        </button>
      </div>

      {open ? (
        <div className="border-t border-ink/10 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-ink/70"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link href="/login" className="text-sm font-medium">
              Log in
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-amber-core px-4 py-2 text-center text-sm font-medium text-paper"
            >
              Get started
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
