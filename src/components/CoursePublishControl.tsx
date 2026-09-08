"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import type { CourseStatus } from "@/lib/types";
import { confirmationCopy } from "@/lib/confirmations";
import { ActionNotice } from "./feedback/ActionNotice";
import { ConfirmDialog, useConfirmDialog } from "./feedback/ConfirmDialog";

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
  const confirm = useConfirmDialog();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<"published" | "unpublished" | null>(null);
  const isPublished = status === "published";

  async function updateStatus() {
    const nextStatus = isPublished ? "draft" : "published";
    setError("");
    setNotice(null);

    await confirm.run(async () => {
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

        setNotice(nextStatus === "published" ? "published" : "unpublished");
        router.refresh();
      } catch {
        setError("The course status could not be updated. Check your connection.");
      }
    });
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
        disabled={confirm.busy}
        onClick={confirm.request}
        className={`mt-4 ${isPublished ? "btn btn-secondary" : "btn btn-primary"}`}
      >
        {confirm.busy ? (
          <LoaderCircle aria-hidden="true" size={16} className="animate-spin" />
        ) : null}
        {confirm.busy
          ? "Saving…"
          : isPublished
            ? "Return to draft"
            : "Publish course"}
      </button>

      {notice ? (
        <div className="mt-3">
          <ActionNotice
            title={confirmationCopy[notice].title}
            detail={confirmationCopy[notice].detail}
          />
        </div>
      ) : null}
      {error ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <ConfirmDialog
        open={confirm.open}
        title={isPublished ? "Return this course to draft?" : "Publish this course?"}
        description={
          isPublished
            ? "Students will no longer see it in the catalog. Existing enrollments stay in place."
            : hasContent
              ? "Students will see this course in the catalog and can enroll immediately."
              : "This course has no lessons yet. Students who enroll will find an empty outline."
        }
        confirmLabel={isPublished ? "Return to draft" : "Publish"}
        tone={isPublished ? "danger" : "brand"}
        busy={confirm.busy}
        onConfirm={updateStatus}
        onCancel={confirm.cancel}
      />
    </section>
  );
}
