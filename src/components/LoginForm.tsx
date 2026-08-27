"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const demoAccounts = [
  {
    role: "Student",
    email: "student@skillstream.academy",
    icon: GraduationCap,
  },
  {
    role: "Instructor",
    email: "instructor@skillstream.academy",
    icon: BookOpen,
  },
  { role: "Admin", email: "admin@skillstream.academy", icon: ShieldCheck },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("instructor@skillstream.academy");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = (await response.json()) as { error?: string; role?: string };

    if (!response.ok) {
      setError(data.error ?? "Login failed.");
      setLoading(false);
      return;
    }

    const next = searchParams.get("next");
    if (next) {
      router.push(next);
    } else if (data.role === "student") {
      router.push("/student/dashboard");
    } else if (data.role === "instructor") {
      router.push("/instructor/dashboard");
    } else {
      router.push("/admin");
    }

    router.refresh();
  }

  return (
    <main
      id="main-content"
      className="grid min-h-screen bg-paper lg:grid-cols-[minmax(380px,0.9fr)_minmax(520px,1.1fr)]"
    >
      <section className="hidden bg-ink px-12 py-10 text-paper lg:flex lg:flex-col">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-amber-core">
            <GraduationCap aria-hidden="true" size={22} strokeWidth={1.8} />
          </span>
          <span className="font-display text-xl font-semibold">Skillstream Academy</span>
        </Link>

        <div className="my-auto max-w-lg py-16">
          <p className="font-display text-5xl font-medium leading-[1.04] tracking-[-0.035em]">
            One account for the entire learning journey.
          </p>
          <p className="mt-6 max-w-md text-base leading-7 text-paper/60">
            Move from enrollment to lessons, instructor support, and verifiable
            certification without disconnected systems.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 border-t border-paper/10 pt-6 text-xs text-paper/50">
          <span>Instant LMS access</span>
          <span>24/7 AI support</span>
          <span>Verified certificates</span>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-12 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-core text-paper">
              <GraduationCap aria-hidden="true" size={20} />
            </span>
            <span className="font-display text-lg font-semibold">Skillstream Academy</span>
          </Link>

          <h1 className="font-display text-4xl font-medium tracking-[-0.03em]">
            Welcome back
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Sign in to continue to your role-specific workspace.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold" htmlFor="email">
            Email address
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field mt-2"
              autoComplete="email"
              required
            />
          </label>

          <label className="block text-sm font-semibold" htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field mt-2"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? (
            <p
              role="alert"
              className="rounded-lg bg-amber-desaturated/10 px-4 py-3 text-sm font-medium text-danger"
            >
              {error} Check your email and password.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-amber-core px-5 text-sm font-semibold text-paper shadow-[0_6px_18px_rgb(122_95_30/0.22)] hover:bg-amber-dark disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
            {!loading ? <ArrowRight aria-hidden="true" size={17} /> : null}
          </button>
        </form>

          <div className="mt-9 border-t border-line pt-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold">Demo access</p>
              <p className="text-xs text-muted">
                Password: <code className="font-mono text-ink">password123</code>
              </p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                const isSelected = email === account.email;
                return (
                  <button
                    key={account.email}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setEmail(account.email)}
                    className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg border px-2 text-xs font-semibold ${
                      isSelected
                        ? "border-amber-core bg-amber-tint text-amber-dark"
                        : "border-line bg-surface hover:border-amber-light hover:bg-amber-tint/25"
                    }`}
                  >
                    <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                    {account.role}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-8 flex items-center justify-center gap-2 text-xs text-muted">
            <UserRound aria-hidden="true" size={14} />
            Academic project demo — no real student data
          </p>
        </div>
      </section>
    </main>
  );
}
