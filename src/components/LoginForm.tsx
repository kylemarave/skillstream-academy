"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { BrandMark } from "@/components/BrandMark";

const demoAccounts = [
  { role: "Student", email: "student@skillstream.academy" },
  { role: "Instructor", email: "instructor@skillstream.academy" },
  { role: "Admin", email: "admin@skillstream.academy" },
] as const;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("student@skillstream.academy");
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
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-canvas">
        <div className="mx-auto flex max-w-lg items-center justify-between px-5 py-3 sm:px-7">
          <BrandMark stacked={false} />
          <Link
            href="/verify"
            className="inline-flex min-h-11 items-center text-sm font-medium text-muted hover:text-ink"
          >
            Verify
          </Link>
        </div>
      </header>

      <main
        id="main-content"
        className="mx-auto flex w-full max-w-lg flex-col px-5 py-12 sm:px-7 sm:py-16"
      >
        <h1 className="page-title">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Demo accounts land in the workspace for that role. The student account
          is selected so you can walk enroll → learn → certify first.
        </p>

        <form onSubmit={handleSubmit} className="card mt-8 space-y-4 px-5 py-6 sm:px-6">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field mt-1.5"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field mt-1.5"
              autoComplete="current-password"
              required
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm text-danger">
              {error} Check your email and password.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-8">
          <p className="text-sm font-semibold">Demo accounts</p>
          <p className="hint mt-1">
            Password for all three:{" "}
            <code className="font-mono text-ink">password123</code>
          </p>
          <div className="mt-3 flex gap-2">
            {demoAccounts.map((account) => {
              const isSelected = email === account.email;
              return (
                <button
                  key={account.email}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setEmail(account.email)}
                  className={`min-h-11 flex-1 rounded-lg border px-2 text-sm ${
                    isSelected
                      ? "border-brand bg-brand-soft font-semibold text-brand-strong"
                      : "border-line-strong bg-surface text-muted hover:bg-subtle"
                  }`}
                >
                  {account.role}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
