"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import type { CourseStatus } from "@/lib/types";

interface CoursePublishControlProps {
  courseId: string;
  status: CourseStatus;
  hasContent: boolean;
}

export function CoursePublishControl({
  courseId,
  status,
  hasContent,
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
          ? "Published. Students can now see this course."
          : "Returned to draft. Students can no longer see it.",
      );
      router.refresh();
    } catch {
      setError("The course status could not be updated. Check your connection.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section aria-labelledby="visibility-title" className="card p-5">
      <h2 id="visibility-title" className="section-title">
        Catalog visibility
      </h2>
      <p className="mt-1 text-sm text-muted">
        {isPublished
          ? "This course is listed in the student catalog."
          : "This draft is only visible to you."}
      </p>

      {!isPublished && !hasContent ? (
        <p className="mt-3 rounded-lg bg-warn-soft px-3 py-2 text-sm text-warn">
          This course has no lessons yet. Add content before publishing.
        </p>
      ) : null}

      <button
        type="button"
        disabled={saving}
        onClick={() => updateStatus(isPublished ? "draft" : "published")}
        className={`mt-4 ${isPublished ? "btn btn-secondary" : "btn btn-primary"}`}
      >
        {saving ? (
          <LoaderCircle aria-hidden="true" size={16} className="animate-spin" />
        ) : null}
        {saving ? "Saving…" : isPublished ? "Return to draft" : "Publish course"}
      </button>

      {message ? (
        <p role="status" className="mt-3 text-sm text-success">
          {message}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </section>
  );
}
