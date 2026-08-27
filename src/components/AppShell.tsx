"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Library,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import type { SessionUser } from "@/lib/types";
import { LogoutButton } from "./LogoutButton";

const roleLabels: Record<SessionUser["role"], string> = {
  student: "Student Portal",
  instructor: "Instructor Dashboard",
  admin: "Admin Console",
};

interface AppShellProps {
  user: SessionUser;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  nav: { href: string; label: string }[];
}

const navIcons = {
  Dashboard: LayoutDashboard,
  Catalog: Library,
  "My courses": BookOpen,
  Escalations: MessageSquareText,
  Overview: ShieldCheck,
};

export function AppShell({ user, title, subtitle, children, nav }: AppShellProps) {
  const pathname = usePathname();
  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`;

  return (
    <div className="min-h-screen bg-paper text-ink lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      <aside className="border-b border-line bg-ink text-paper lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5 lg:block lg:px-6 lg:py-7">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-core text-paper shadow-[0_6px_18px_rgb(0_0_0/0.18)]">
              <GraduationCap aria-hidden="true" size={21} strokeWidth={1.8} />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold leading-none">
                Skillstream
              </span>
              <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-paper/50">
                Academy
              </span>
            </span>
          </Link>
          <div className="rounded-md border border-paper/15 px-2 py-1 text-[11px] font-medium text-paper/65 lg:mt-7 lg:inline-flex">
            {roleLabels[user.role]}
          </div>
        </div>

        <nav
          aria-label={`${roleLabels[user.role]} navigation`}
          className="flex gap-1 overflow-x-auto px-4 pb-4 lg:flex-col lg:overflow-visible lg:px-4 lg:py-2"
        >
            {nav.map((item) => {
              const isActive =
                pathname === item.href ||
                (pathname.startsWith(item.href) &&
                  !nav.some(
                    (candidate) =>
                      candidate.href !== item.href &&
                      candidate.href.startsWith(item.href) &&
                      pathname.startsWith(candidate.href),
                  ));
              const Icon =
                navIcons[item.label as keyof typeof navIcons] ?? BookOpen;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-paper text-ink shadow-[0_4px_14px_rgb(0_0_0/0.12)]"
                      : "text-paper/65 hover:bg-paper/10 hover:text-paper"
                  }`}
                >
                  <Icon
                    aria-hidden="true"
                    size={18}
                    strokeWidth={isActive ? 2 : 1.7}
                    className={isActive ? "text-amber-dark" : ""}
                  />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        <div className="hidden lg:mt-auto lg:block lg:border-t lg:border-paper/10 lg:p-4">
          <div className="flex items-center gap-3 rounded-xl bg-paper/[0.06] p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-core text-xs font-semibold uppercase text-paper">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-paper">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs text-paper/45">{user.email}</p>
            </div>
            <LogoutButton iconOnly />
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-b border-line bg-paper/95 px-5 py-4 backdrop-blur-sm lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <p className="text-sm text-muted">
              {roleLabels[user.role]}
              <span className="mx-2 text-line">/</span>
              <span className="font-medium text-ink">{title}</span>
            </p>
            <div className="lg:hidden">
              <LogoutButton />
            </div>
          </div>
        </header>

        <main
          id="main-content"
          className="mx-auto max-w-7xl px-5 py-8 sm:px-7 lg:px-10 lg:py-10"
        >
          <div className="mb-9 border-b border-line pb-7">
            <h1 className="page-title">{title}</h1>
            {subtitle ? (
              <p className="mt-3 max-w-3xl text-[15px] leading-6 text-muted">
                {subtitle}
              </p>
            ) : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
