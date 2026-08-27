"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { BrandMark } from "@/components/BrandMark";

const demoAccounts = [
  { role: "Student", email: "student@skillstream.academy" },
  { role: "Instructor", email: "instructor@skillstream.academy" },
  { role: "Admin", email: "admin@skillstream.academy" },
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
      className="flex min-h-screen items-center justify-center bg-canvas px-5 py-12"
    >
      <div className="w-full max-w-sm">
        <BrandMark stacked={false} />

        <h1 className="page-title mt-8">Sign in</h1>
        <p className="mt-2 text-sm text-muted">
          You will land in the workspace for your role.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
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

        <div className="mt-8 border-t border-line pt-5">
          <p className="text-sm font-medium">Demo accounts</p>
          <p className="hint mt-0.5">
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
                      ? "border-brand bg-brand-soft font-medium text-brand-strong"
                      : "border-line-strong bg-surface text-muted hover:bg-subtle"
                  }`}
                >
                  {account.role}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-8 text-xs text-muted">
          Academic project demo — no real student data.{" "}
          <a href="/verify" className="font-medium text-brand hover:text-brand-strong">
            Verify a certificate
          </a>
        </p>
      </div>
    </main>
  );
}
