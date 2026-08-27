"use client";

import { FormEvent, useState } from "react";
import { BookOpen, FileText, GripVertical, Plus } from "lucide-react";

interface ModuleEditorProps {
  courseId: string;
  initialModules: Array<{
    id: string;
    title: string;
    sequenceOrder: number;
    lessons: Array<{
      id: string;
      title: string;
      contentType: string;
      sequenceOrder: number;
    }>;
  }>;
}

export function ModuleEditor({ courseId, initialModules }: ModuleEditorProps) {
  const [modules, setModules] = useState(initialModules);
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonDrafts, setLessonDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [addingModule, setAddingModule] = useState(false);
  const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null);

  async function addModule(event: FormEvent) {
    event.preventDefault();
    setError("");
    setAddingModule(true);

    try {
      const response = await fetch(`/api/courses/${courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: moduleTitle }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "The module could not be added.");
        return;
      }

      setModules((current) => [...current, { ...data, lessons: [] }]);
      setModuleTitle("");
    } finally {
      setAddingModule(false);
    }
  }

  async function addLesson(moduleId: string) {
    const title = lessonDrafts[moduleId]?.trim();
    if (!title) return;

    setError("");
    setAddingLessonTo(moduleId);
    try {
      const response = await fetch(
        `/api/courses/${courseId}/modules/${moduleId}/lessons`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, contentType: "text" }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "The lesson could not be added.");
        return;
      }

      setModules((current) =>
        current.map((module) =>
          module.id === moduleId
            ? { ...module, lessons: [...module.lessons, data] }
            : module,
        ),
      );
      setLessonDrafts((current) => ({ ...current, [moduleId]: "" }));
    } finally {
      setAddingLessonTo(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-5">
      <form
        onSubmit={addModule}
          className="surface p-5 sm:p-6"
      >
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-amber-tint text-amber-dark">
              <Plus aria-hidden="true" size={18} />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold">Add a module</h2>
              <p className="mt-1 text-sm text-muted">
                Group related lessons into a clear chapter of the course.
              </p>
            </div>
          </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="module-title" className="sr-only">
              Module title
            </label>
          <input
              id="module-title"
            value={moduleTitle}
            onChange={(event) => setModuleTitle(event.target.value)}
              placeholder="e.g. HTML fundamentals"
              className="field flex-1"
            required
          />
          <button
            type="submit"
              disabled={addingModule}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-amber-core px-4 text-sm font-semibold text-paper hover:bg-amber-dark disabled:opacity-60"
          >
              <Plus aria-hidden="true" size={17} />
              {addingModule ? "Adding…" : "Add module"}
          </button>
        </div>
      </form>

        {error ? (
          <p
            role="alert"
            className="rounded-lg bg-amber-desaturated/10 px-4 py-3 text-sm font-medium text-danger"
          >
            {error} Try again.
          </p>
        ) : null}

      {modules.length === 0 ? (
          <div className="surface px-6 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-xl bg-surface-muted text-amber-dark">
              <BookOpen aria-hidden="true" size={21} />
            </span>
            <p className="mt-4 font-medium">Your course outline is empty</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
              Add the first module above, then build its lesson sequence.
            </p>
          </div>
      ) : (
        modules.map((module) => (
          <section
            key={module.id}
              className="surface overflow-hidden"
          >
              <header className="flex items-center gap-3 border-b border-line bg-surface-muted/55 px-5 py-4 sm:px-6">
                <GripVertical aria-hidden="true" size={18} className="text-muted" />
                <span className="grid size-8 place-items-center rounded-lg bg-ink text-xs font-semibold text-paper">
                  {String(module.sequenceOrder).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{module.title}</h3>
                  <p className="text-xs text-muted">
                    {module.lessons.length} lesson{module.lessons.length === 1 ? "" : "s"}
                  </p>
                </div>
              </header>

              <ul className="divide-y divide-line">
              {module.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                    className="flex min-h-14 items-center gap-3 px-5 py-3 sm:px-6"
                >
                    <FileText aria-hidden="true" size={17} className="shrink-0 text-amber-dark" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {lesson.title}
                  </span>
                    <span className="rounded-md bg-surface-muted px-2 py-1 text-xs font-medium capitalize text-muted">
                      {lesson.contentType}
                    </span>
                </li>
              ))}
                {module.lessons.length === 0 ? (
                  <li className="px-6 py-7 text-center text-sm text-muted">
                    No lessons in this module yet.
                  </li>
                ) : null}
            </ul>

              <div className="flex flex-col gap-3 border-t border-line bg-paper/60 px-5 py-4 sm:flex-row sm:px-6">
                <label htmlFor={`lesson-${module.id}`} className="sr-only">
                  Lesson title for {module.title}
                </label>
              <input
                  id={`lesson-${module.id}`}
                value={lessonDrafts[module.id] ?? ""}
                onChange={(event) =>
                  setLessonDrafts((current) => ({
                    ...current,
                    [module.id]: event.target.value,
                  }))
                }
                  placeholder="Add a lesson title"
                  className="field flex-1"
              />
              <button
                type="button"
                onClick={() => addLesson(module.id)}
                  disabled={
                    addingLessonTo === module.id ||
                    !lessonDrafts[module.id]?.trim()
                  }
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-surface px-4 text-sm font-semibold hover:border-amber-core hover:bg-amber-tint/30 disabled:opacity-50"
              >
                  <Plus aria-hidden="true" size={17} />
                  {addingLessonTo === module.id ? "Adding…" : "Add lesson"}
              </button>
            </div>
          </section>
        ))
      )}
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="surface p-5">
          <h2 className="font-display text-xl font-semibold">Outline quality</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <dt className="text-muted">Modules</dt>
              <dd className="font-semibold tabular-nums">{modules.length}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <dt className="text-muted">Lessons</dt>
              <dd className="font-semibold tabular-nums">
                {modules.reduce((total, module) => total + module.lessons.length, 0)}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Recommended next step</dt>
              <dd className="mt-1 font-medium">
                {modules.length === 0
                  ? "Add your first module"
                  : modules.some((module) => module.lessons.length === 0)
                    ? "Add lessons to each module"
                    : "Review and publish"}
              </dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}
