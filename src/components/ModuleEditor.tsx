"use client";

import { FormEvent, useState } from "react";

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

  async function addModule(event: FormEvent) {
    event.preventDefault();
    setError("");

    const response = await fetch(`/api/courses/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: moduleTitle }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Failed to add module.");
      return;
    }

    setModules((current) => [...current, { ...data, lessons: [] }]);
    setModuleTitle("");
  }

  async function addLesson(moduleId: string) {
    const title = lessonDrafts[moduleId]?.trim();
    if (!title) return;

    setError("");
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
      setError(data.error ?? "Failed to add lesson.");
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
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={addModule}
        className="rounded-2xl border border-ink/10 bg-white p-6"
      >
        <h2 className="font-semibold">Add module</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={moduleTitle}
            onChange={(event) => setModuleTitle(event.target.value)}
            placeholder="Module title"
            className="flex-1 rounded-lg border border-ink/15 bg-paper px-3 py-2"
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-amber-core px-4 py-2 text-sm font-medium text-paper hover:bg-amber-dark"
          >
            Add module
          </button>
        </div>
      </form>

      {error ? <p className="text-sm text-amber-desaturated">{error}</p> : null}

      {modules.length === 0 ? (
        <p className="text-sm text-ink/70">No modules yet. Add your first module above.</p>
      ) : (
        modules.map((module) => (
          <section
            key={module.id}
            className="rounded-2xl border border-ink/10 bg-white p-6"
          >
            <h3 className="text-lg font-semibold">
              Module {module.sequenceOrder}: {module.title}
            </h3>

            <ul className="mt-4 space-y-2">
              {module.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="flex items-center justify-between rounded-lg bg-amber-tint/40 px-3 py-2 text-sm"
                >
                  <span>
                    {lesson.sequenceOrder}. {lesson.title}
                  </span>
                  <span className="text-ink/50">{lesson.contentType}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={lessonDrafts[module.id] ?? ""}
                onChange={(event) =>
                  setLessonDrafts((current) => ({
                    ...current,
                    [module.id]: event.target.value,
                  }))
                }
                placeholder="Lesson title"
                className="flex-1 rounded-lg border border-ink/15 bg-paper px-3 py-2"
              />
              <button
                type="button"
                onClick={() => addLesson(module.id)}
                className="rounded-lg border border-ink/15 px-4 py-2 text-sm font-medium hover:bg-amber-tint/40"
              >
                Add lesson
              </button>
            </div>
          </section>
        ))
      )}
    </div>
  );
}
