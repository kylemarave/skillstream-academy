"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { PublicShell } from "@/components/landing/PublicShell";
import { ConfirmedBanner } from "@/components/feedback/ConfirmedBanner";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "@/components/feedback/ConfirmDialog";
import { withConfirmed } from "@/lib/confirmations";
import { destinationAfterAuth } from "@/lib/roleHome";
import type { UserRole } from "@/lib/types";

const demoAccounts: Record<UserRole, { email: string; password: string }> = {
  student: {
    email: "student@skillstream.academy",
    password: "password123",
  },
  instructor: {
    email: "instructor@skillstream.academy",
    password: "password123",
  },
  admin: {
    email: "admin@skillstream.academy",
    password: "password123",
  },
};

const roleLabels: Record<UserRole, string> = {
  student: "Student",
  instructor: "Instructor",
  admin: "Admin",
};

export function AccountForm({
  role,
  allowSignup,
}: {
  role: UserRole;
  allowSignup: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirm = useConfirmDialog();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const label = roleLabels[role];
  const demo = demoAccounts[role];
  const signingUp = allowSignup && mode === "sign-up";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    confirm.request();
  }

  async function handleConfirm() {
    await confirm.run(async () => {
      const response = await fetch(
        signingUp ? "/api/auth/signup" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            signingUp
              ? { firstName, lastName, email, password, role }
              : {
                  email,
                  password,
                  portal: role === "admin" ? "admin" : undefined,
                },
          ),
        },
      );

      const data = (await response.json()) as { error?: string; role?: UserRole };

      if (!response.ok || !data.role) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      const destination = destinationAfterAuth(
        data.role,
        searchParams.get("next"),
      );
      router.push(
        withConfirmed(destination, signingUp ? "account-created" : "signed-in"),
      );
      router.refresh();
    });
  }

  return (
    <PublicShell active="login">
      <main
        id="main-content"
        className="flex flex-1 flex-col items-center px-5 py-8 sm:px-7"
      >
        <div className="my-auto w-full max-w-[26rem]">
          <p className="text-center text-sm font-semibold text-brand">{label}</p>
          <h1 className="mt-1 text-center text-[1.65rem] font-semibold leading-normal tracking-tight">
            {signingUp ? "Create account" : "Sign in"}
          </h1>
          {role !== "admin" ? (
            <p className="mt-3 text-center text-sm text-muted">
              <Link href="/login" className="font-medium text-brand hover:text-brand-strong">
                Choose a different role
              </Link>
            </p>
          ) : null}

          <div className="mt-8">
            <ConfirmedBanner />
          </div>

          <form
            onSubmit={handleSubmit}
            className="card space-y-5 px-5 py-6 sm:px-6"
          >
            {signingUp ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="first-name">
                    First name
                  </label>
                  <input
                    id="first-name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="field mt-1.5"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="last-name">
                    Last name
                  </label>
                  <input
                    id="last-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="field mt-1.5"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>
            ) : null}

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
                autoComplete={signingUp ? "new-password" : "current-password"}
                minLength={signingUp ? 8 : undefined}
                required
              />
              {signingUp ? (
                <p className="hint mt-1.5">At least 8 characters.</p>
              ) : (
                <p className="hint mt-1.5">
                  Demo: <code className="font-mono text-ink">{demo.email}</code>{" "}
                  / <code className="font-mono text-ink">{demo.password}</code>
                </p>
              )}
            </div>

            {error ? (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={confirm.busy}
              className="btn btn-primary w-full"
            >
              {confirm.busy
                ? signingUp
                  ? "Creating account…"
                  : "Signing in…"
                : signingUp
                  ? "Create account"
                  : "Sign in"}
            </button>

            {allowSignup ? (
              <button
                type="button"
                className="w-full text-sm font-medium text-brand hover:text-brand-strong"
                onClick={() => {
                  setMode(signingUp ? "sign-in" : "sign-up");
                  setError("");
                }}
              >
                {signingUp
                  ? "Already have an account? Sign in"
                  : "New here? Create an account"}
              </button>
            ) : null}
          </form>
        </div>
      </main>

      <ConfirmDialog
        open={confirm.open}
        title={
          signingUp
            ? `Create this ${label.toLowerCase()} account?`
            : `Sign in as ${label.toLowerCase()}?`
        }
        description={
          signingUp
            ? `${email || "This email"} will be a ${label.toLowerCase()} account.`
            : `${email || "This email"} will open the matching workspace.`
        }
        confirmLabel={signingUp ? "Create account" : "Sign in"}
        busy={confirm.busy}
        onConfirm={handleConfirm}
        onCancel={confirm.cancel}
      />
    </PublicShell>
  );
}
