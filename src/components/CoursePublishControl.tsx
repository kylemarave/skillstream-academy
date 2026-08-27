"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Eye, LoaderCircle } from "lucide-react";
import type { CourseStatus } from "@/lib/types";

interface CoursePublishControlProps {
  courseId: string;
  status: CourseStatus;
}

export function CoursePublishControl({
  courseId,
  status,
}: CoursePublishControlProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isPublished = status === "published";

  async function updateStatus(nextStatus: "draft" | "published") {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "The course status could not be updated.");
        return;
      }

      setMessage(
        nextStatus === "published"
          ? "Course published to the student catalog."
          : "Course returned to draft.",
      );
      router.refresh();
    } catch {
      setError("The course status could not be updated. Check your connection.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="surface overflow-hidden">
      <div className="border-b border-line px-5 py-5 sm:px-6">
        <h2 className="font-display text-xl font-semibold">Catalog visibility</h2>
        <p className="mt-1 text-sm text-muted">
          {isPublished
            ? "Students can discover this course and see its enrollment status."
            : "This draft is visible only in your instructor workspace."}
        </p>
      </div>

      <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <span
            className={`grid size-10 place-items-center rounded-lg ${
              isPublished
                ? "bg-success/10 text-success"
                : "bg-amber-tint text-amber-dark"
            }`}
          >
            {isPublished ? (
              <CheckCircle2 aria-hidden="true" size={19} />
            ) : (
              <Eye aria-hidden="true" size={19} />
            )}
          </span>
          <div>
            <p className="text-sm font-semibold">
              {isPublished ? "Published" : "Draft"}
            </p>
            <p className="text-xs text-muted">
              {isPublished ? "Live in the student catalog" : "Not visible to students"}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={() => updateStatus(isPublished ? "draft" : "published")}
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold disabled:opacity-60 ${
            isPublished
              ? "border border-line bg-surface hover:bg-surface-muted"
              : "bg-amber-core text-paper shadow-[0_5px_14px_rgb(122_95_30/0.2)] hover:bg-amber-dark"
          }`}
        >
          {saving ? (
            <LoaderCircle aria-hidden="true" size={17} className="animate-spin" />
          ) : null}
          {saving ? "Updating…" : isPublished ? "Return to draft" : "Publish course"}
        </button>
      </div>

      {message ? (
        <p
          role="status"
          className="border-t border-line bg-success/5 px-5 py-3 text-sm font-medium text-success sm:px-6"
        >
          {message}
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="border-t border-line bg-danger/5 px-5 py-3 text-sm font-medium text-danger sm:px-6"
        >
          {error}
        </p>
      ) : null}
    </section>
  );
}
