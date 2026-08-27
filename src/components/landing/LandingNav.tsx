"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#for-instructors", label: "For Instructors" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-7">
        <Link href="/" className="flex items-center gap-3 text-ink">
          <span className="grid size-10 place-items-center rounded-xl bg-ink text-paper">
            <GraduationCap aria-hidden="true" size={20} strokeWidth={1.8} />
          </span>
          <span className="font-display text-lg font-semibold">Skillstream Academy</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center text-sm font-medium text-muted hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-muted hover:text-ink"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center rounded-lg bg-amber-core px-4 text-sm font-semibold text-paper shadow-[0_5px_14px_rgb(122_95_30/0.2)] hover:bg-amber-dark"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid size-11 place-items-center rounded-lg border border-line bg-surface md:hidden"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-surface px-5 py-4 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted hover:bg-surface-muted hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link href="/login" className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold">
              Log in
            </Link>
            <Link
              href="/login"
              className="mt-2 inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-core px-4 text-sm font-semibold text-paper"
            >
              Get started
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
