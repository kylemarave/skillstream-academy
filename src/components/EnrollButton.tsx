"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  enrolled: boolean;
}

export function EnrollButton({ courseId, enrolled }: EnrollButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (enrolled) {
    return (
      <div className="sm:text-right">
        <Link href={`/student/learning/${courseId}`} className="btn btn-secondary w-full">
          Open course
        </Link>
        <p className="mt-1.5 text-xs text-muted">Access is ready.</p>
      </div>
    );
  }

  async function handleEnroll() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Enrollment could not be completed.");
        return;
      }

      router.push(`/student/learning/${courseId}`);
      router.refresh();
    } catch {
      setError("Enrollment could not be completed. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sm:text-right">
      <button
        type="button"
        onClick={handleEnroll}
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? (
          <LoaderCircle aria-hidden="true" size={16} className="animate-spin" />
        ) : null}
        {loading ? "Enrolling…" : "Enroll"}
      </button>
      <p className="mt-1.5 text-xs text-muted">
        Demo: no payment is collected. Confirming opens access immediately.
      </p>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
