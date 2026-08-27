"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

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
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-core">
          Skillstream Academy
        </p>
        <h1 className="mt-3 text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-ink/70">
          Use a demo account below. Password for all: <code>password123</code>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/15 bg-paper px-3 py-2"
              required
            />
          </label>

          <label className="block text-sm font-medium">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/15 bg-paper px-3 py-2"
              required
            />
          </label>

          {error ? <p className="text-sm text-amber-desaturated">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-core px-4 py-2.5 text-sm font-medium text-paper hover:bg-amber-dark disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-8 space-y-2 border-t border-ink/10 pt-6">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
            Demo accounts
          </p>
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => setEmail(account.email)}
              className="block w-full rounded-lg bg-amber-tint/60 px-3 py-2 text-left text-sm hover:bg-amber-tint"
            >
              <span className="font-medium">{account.role}</span>
              <span className="text-ink/60"> · {account.email}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
