"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function AppShell({ user, title, subtitle, children, nav }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-ink/10 bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/" className="text-sm font-medium uppercase tracking-[0.2em] text-amber-core">
              Skillstream Academy
            </Link>
            <p className="mt-1 text-xs text-ink/50">
              Enroll · Learn · Get certified
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{roleLabels[user.role]}</p>
            <p className="text-xs text-ink/60">
              {user.firstName} {user.lastName}
            </p>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 pb-4">
          <nav className="flex flex-wrap gap-1">
            {nav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-amber-core text-paper"
                      : "text-ink/70 hover:bg-amber-tint/50 hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <LogoutButton className="text-sm text-ink/60 hover:text-ink" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-2 max-w-2xl text-ink/70">{subtitle}</p> : null}
        </div>
        {children}
      </main>
    </div>
  );
}
