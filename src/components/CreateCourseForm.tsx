"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, BookOpen, Save } from "lucide-react";

export function CreateCourseForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("49.99");
  const [publishNow, setPublishNow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        price: Number(price),
        status: publishNow ? "published" : "draft",
      }),
    });

    const data = (await response.json()) as { error?: string; id?: string };

    if (!response.ok) {
      setError(data.error ?? "Failed to create course.");
      setLoading(false);
      return;
    }

    router.push(`/instructor/courses/${data.id}/modules`);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"
    >
      <section className="surface overflow-hidden">
        <div className="border-b border-line px-5 py-5 sm:px-7">
          <h2 className="font-display text-xl font-semibold">Course details</h2>
          <p className="mt-1 text-sm text-muted">
            Give students enough context to understand what they will learn.
          </p>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-7">
          <label className="block text-sm font-semibold" htmlFor="course-title">
            Course title
            <span className="ml-1 text-danger" aria-hidden="true">*</span>
          </label>
          <div className="-mt-4">
            <input
              id="course-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="field"
              placeholder="e.g. Web Development Foundations"
              autoComplete="off"
              required
            />
            <p className="mt-2 text-xs text-muted">
              Use a clear, specific title students can recognize in the catalog.
            </p>
          </div>

          <label className="block text-sm font-semibold" htmlFor="course-description">
            Description
          </label>
          <div className="-mt-4">
            <textarea
              id="course-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={6}
              className="field resize-y"
              placeholder="Describe the skills, topics, and expected outcome."
            />
            <div className="mt-2 flex justify-between gap-4 text-xs text-muted">
              <span>Shown in the student catalog.</span>
              <span className="tabular-nums">{description.length} characters</span>
            </div>
          </div>

          <label className="block text-sm font-semibold" htmlFor="course-price">
            Price
            <span className="ml-1 text-danger" aria-hidden="true">*</span>
          </label>
          <div className="-mt-4 max-w-xs">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-muted">
                USD
              </span>
              <input
                id="course-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="field pl-14"
                required
              />
            </div>
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-lg bg-amber-desaturated/10 px-4 py-3 text-sm font-medium text-danger"
            >
              {error} Check the form and try again.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-line bg-surface-muted/55 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <Link
            href="/instructor/courses"
            className="inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-muted hover:bg-surface hover:text-ink"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-amber-core px-5 text-sm font-semibold text-paper shadow-[0_5px_14px_rgb(122_95_30/0.2)] hover:bg-amber-dark disabled:opacity-60"
          >
            <Save aria-hidden="true" size={17} />
            {loading ? "Creating course…" : "Create and add content"}
            {!loading ? <ArrowRight aria-hidden="true" size={16} /> : null}
          </button>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="surface p-5">
          <span className="grid size-10 place-items-center rounded-lg bg-amber-tint text-amber-dark">
            <BookOpen aria-hidden="true" size={18} />
          </span>
          <h2 className="mt-4 font-semibold">What happens next</h2>
          <ol className="mt-3 space-y-3 text-sm leading-5 text-muted">
            <li>1. Add modules and lessons.</li>
            <li>2. Review the course outline.</li>
            <li>3. Publish it to the student catalog.</li>
          </ol>
        </div>

        <label className="surface flex cursor-pointer items-start gap-3 p-5">
          <input
            type="checkbox"
            checked={publishNow}
            onChange={(event) => setPublishNow(event.target.checked)}
            className="mt-1 size-4 accent-amber-core"
          />
          <span>
            <span className="block text-sm font-semibold">Publish immediately</span>
            <span className="mt-1 block text-xs leading-5 text-muted">
              Make the course visible in the catalog after its outline is created.
              Admin review is planned for a later phase.
            </span>
          </span>
        </label>
      </aside>
    </form>
  );
}
