"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { completeActionLabel } from "@/lib/player";

interface CompleteLessonButtonProps {
  courseId: string;
  lesson: Lesson;
  completed: boolean;
  nextLessonId: string | null;
}

export function CompleteLessonButton({
  courseId,
  lesson,
  completed,
  nextLessonId,
}: CompleteLessonButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const courseHref = `/student/learning/${courseId}`;
  const nextHref = nextLessonId
    ? `/student/learning/${courseId}/lessons/${nextLessonId}`
    : courseHref;

  async function handleComplete() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/learning/${courseId}/lessons/${lesson.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        },
      );
      const data = (await response.json()) as {
        error?: string;
        enrollment?: { status: string };
        nextLesson?: { id: string } | null;
        certificate?: { id: string } | null;
        justCertified?: boolean;
      };

      if (!response.ok) {
        setError(data.error ?? "This lesson could not be completed.");
        return;
      }

      const destination =
        data.justCertified && data.certificate?.id
          ? `/student/certificates/${data.certificate.id}`
          : data.nextLesson
            ? `/student/learning/${courseId}/lessons/${data.nextLesson.id}`
            : courseHref;

      router.push(destination);
      router.refresh();
    } catch {
      setError("This lesson could not be completed. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  if (completed) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium text-success">Lesson complete</p>
        <Link href={nextHref} className="btn btn-primary">
          {nextLessonId ? "Next lesson" : "Back to course"}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleComplete}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? (
          <LoaderCircle aria-hidden="true" size={16} className="animate-spin" />
        ) : null}
        {loading ? "Saving…" : completeActionLabel(lesson.contentType)}
      </button>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
