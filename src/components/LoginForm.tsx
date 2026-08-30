"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

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
    <PublicShell active="login">
      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-7"
      >
        <div className="w-full max-w-[26rem]">
          <h1 className="page-title text-center">Sign in</h1>
          <p className="mx-auto mt-2 max-w-[24rem] text-center text-sm leading-6 text-muted">
            Demo accounts land in that role's workspace. Student is selected so
            you can walk enroll → learn → certify first.
          </p>

          <form
            onSubmit={handleSubmit}
            className="card mt-8 space-y-5 px-5 py-6 sm:px-6"
          >
            <fieldset>
              <legend className="label">Demo account</legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {demoAccounts.map((account) => {
                  const isSelected = email === account.email;
                  return (
                    <button
                      key={account.email}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setEmail(account.email)}
                      className={`min-h-11 rounded-lg border px-2 text-sm ${
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
            </fieldset>

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
              <p className="hint mt-1.5">
                Password for all three:{" "}
                <code className="font-mono text-ink">password123</code>
              </p>
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
        </div>
      </main>
    </PublicShell>
  );
}
