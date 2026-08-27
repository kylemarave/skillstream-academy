"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";

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

  const lessonCount = modules.reduce(
    (total, courseModule) => total + courseModule.lessons.length,
    0,
  );

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
        current.map((courseModule) =>
          courseModule.id === moduleId
            ? { ...courseModule, lessons: [...courseModule.lessons, data] }
            : courseModule,
        ),
      );
      setLessonDrafts((current) => ({ ...current, [moduleId]: "" }));
    } finally {
      setAddingLessonTo(null);
    }
  }

  return (
    <div className="max-w-3xl space-y-5">
      <form onSubmit={addModule} className="card p-5">
        <label className="label" htmlFor="module-title">
          Add a module
        </label>
        <p className="hint mt-0.5">A group of related lessons.</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            id="module-title"
            value={moduleTitle}
            onChange={(event) => setModuleTitle(event.target.value)}
            placeholder="HTML fundamentals"
            className="field flex-1"
            required
          />
          <button
            type="submit"
            disabled={addingModule}
            className="btn btn-primary"
          >
            <Plus aria-hidden="true" size={16} />
            {addingModule ? "Adding…" : "Add module"}
          </button>
        </div>
      </form>

      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}

      {modules.length === 0 ? (
        <div className="card px-5 py-10">
          <p className="text-sm font-medium">This course has no content</p>
          <p className="mt-1 max-w-md text-sm text-muted">
            Add a module above, then list the lessons inside it.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted">
            {modules.length} module{modules.length === 1 ? "" : "s"} ·{" "}
            {lessonCount} lesson{lessonCount === 1 ? "" : "s"}
          </p>

          {modules.map((courseModule) => (
            <section key={courseModule.id} className="card">
              <header className="flex items-baseline gap-3 border-b border-line px-5 py-3.5">
                <span className="text-sm tabular-nums text-muted">
                  {String(courseModule.sequenceOrder).padStart(2, "0")}
                </span>
                <h2 className="min-w-0 flex-1 truncate text-sm font-medium">
                  {courseModule.title}
                </h2>
                <span className="shrink-0 text-xs text-muted">
                  {courseModule.lessons.length} lesson
                  {courseModule.lessons.length === 1 ? "" : "s"}
                </span>
              </header>

              {courseModule.lessons.length > 0 ? (
                <ul className="divide-y divide-line">
                  {courseModule.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="flex items-center gap-3 px-5 py-3"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm">
                        {lesson.title}
                      </span>
                      <span className="shrink-0 text-xs capitalize text-muted">
                        {lesson.contentType}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="flex flex-col gap-2 border-t border-line px-5 py-3.5 sm:flex-row">
                <label htmlFor={`lesson-${courseModule.id}`} className="sr-only">
                  Lesson title for {courseModule.title}
                </label>
                <input
                  id={`lesson-${courseModule.id}`}
                  value={lessonDrafts[courseModule.id] ?? ""}
                  onChange={(event) =>
                    setLessonDrafts((current) => ({
                      ...current,
                      [courseModule.id]: event.target.value,
                    }))
                  }
                  placeholder="Add a lesson title"
                  className="field flex-1"
                />
                <button
                  type="button"
                  onClick={() => addLesson(courseModule.id)}
                  disabled={
                    addingLessonTo === courseModule.id ||
                    !lessonDrafts[courseModule.id]?.trim()
                  }
                  className="btn btn-secondary"
                >
                  <Plus aria-hidden="true" size={16} />
                  {addingLessonTo === courseModule.id ? "Adding…" : "Add lesson"}
                </button>
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
