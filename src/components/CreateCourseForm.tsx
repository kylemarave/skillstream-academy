"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-2xl border border-ink/10 bg-white p-6">
      <label className="block text-sm font-medium">
        Course title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-1 w-full rounded-lg border border-ink/15 bg-paper px-3 py-2"
          placeholder="Intro to Web Development"
          required
        />
      </label>

      <label className="block text-sm font-medium">
        Description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-ink/15 bg-paper px-3 py-2"
          placeholder="What will students learn?"
        />
      </label>

      <label className="block text-sm font-medium">
        Price (USD)
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          className="mt-1 w-full rounded-lg border border-ink/15 bg-paper px-3 py-2"
          required
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={publishNow}
          onChange={(event) => setPublishNow(event.target.checked)}
        />
        Publish immediately (skip draft — for early development)
      </label>

      {error ? <p className="text-sm text-amber-desaturated">{error}</p> : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-amber-core px-4 py-2 text-sm font-medium text-paper hover:bg-amber-dark disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create course"}
        </button>
        <Link
          href="/instructor/courses"
          className="rounded-lg border border-ink/15 px-4 py-2 text-sm font-medium hover:bg-amber-tint/40"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
