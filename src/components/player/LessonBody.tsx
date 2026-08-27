import { Play } from "lucide-react";
import type { Lesson } from "@/lib/types";

const lessonCopy: Record<
  string,
  { kicker: string; paragraphs: string[]; takeaway: string }
> = {
  "lesson-1": {
    kicker: "How the public web is put together",
    paragraphs: [
      "The web is a request-and-response system. A browser asks a server for a document; the server replies with HTML, and the browser turns that document into a page you can read and click.",
      "Three languages share the work. HTML names the parts of the page. CSS decides how those parts look. JavaScript handles behaviour — what happens when someone clicks, types, or submits a form.",
      "You do not need a special app to publish. Any computer that can serve files over HTTP can host a site. That is why a first course starts with documents, not with a framework.",
    ],
    takeaway:
      "When you open a URL you are fetching a document, not launching a program. Keep that model in mind as you write HTML.",
  },
  "lesson-2": {
    kicker: "A page is a nested document",
    paragraphs: [
      "Every HTML page starts with a doctype, then an html element that holds a head and a body. The head is metadata: title, character set, links to stylesheets. The body is what people see.",
      "Headings, paragraphs, lists, links, and images are the core elements. Nest them the way the content nests: a section contains a heading and the paragraphs that belong to it.",
      "Browsers are forgiving of mistakes, which is why broken markup can still “work.” Write the structure you mean anyway — later CSS and accessibility tools depend on it.",
    ],
    takeaway:
      "If you can outline the page on paper, you can outline it in HTML. Tags should match that outline, not the other way around.",
  },
  "lesson-3": {
    kicker: "Size is content plus padding, border, and margin",
    paragraphs: [
      "Every element is a box. Inside-out, the box is content, then padding, then border, then margin. Padding is space inside the border; margin is space outside it.",
      "The default content-box model means width applies to the content only. Borders and padding add extra size, which is why a “100% plus padding” layout overflows. Most layouts switch to border-box so width includes padding and border.",
      "Margin collapse is the other surprise: adjoining vertical margins of block boxes combine into one. That is expected, not a bug — use padding or a parent with overflow when you need a hard gap.",
    ],
    takeaway:
      "When a layout is a few pixels off, inspect the box model first. The missing space is usually padding, border, or a collapsed margin.",
  },
};

function VideoFrame({ lesson }: { lesson: Lesson }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-ink text-white">
      <div className="relative aspect-video">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#115e59,transparent_55%),linear-gradient(160deg,#0f172a,#134e4a)]" />
        <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-white/15">
            <Play aria-hidden="true" size={22} fill="currentColor" />
          </span>
          <p className="text-sm font-medium">{lesson.title}</p>
          <p className="max-w-md text-sm text-white/70">
            Prototype recording
            {lesson.durationMinutes ? ` · ${lesson.durationMinutes} min` : ""}.
            There is no video file in this build — use the notes below, then mark
            the lesson watched.
          </p>
        </div>
      </div>
    </div>
  );
}

function QuizFrame({ lesson }: { lesson: Lesson }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-muted">
        Prototype quiz for {lesson.title}. Submitting records a score of 100 and
        marks the lesson complete.
      </p>
      <fieldset className="card px-4 py-4">
        <legend className="text-sm font-medium">
          What is the main job of HTML?
        </legend>
        <label className="mt-3 flex items-start gap-2 text-sm">
          <input type="radio" name={`quiz-${lesson.id}`} defaultChecked className="mt-0.5" />
          Describe the structure of a document.
        </label>
        <label className="mt-2 flex items-start gap-2 text-sm">
          <input type="radio" name={`quiz-${lesson.id}`} className="mt-0.5" />
          Paint colours and spacing onto the page.
        </label>
        <label className="mt-2 flex items-start gap-2 text-sm">
          <input type="radio" name={`quiz-${lesson.id}`} className="mt-0.5" />
          Store records in a database.
        </label>
      </fieldset>
    </div>
  );
}

function AssignmentFrame({ lesson }: { lesson: Lesson }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-muted">
        Prototype assignment for {lesson.title}. Submitting marks the work
        complete with a score of 100. Nothing is uploaded.
      </p>
      <div className="card px-4 py-4">
        <p className="text-sm font-medium">Brief</p>
        <p className="mt-1.5 text-sm leading-6 text-muted">
          Rewrite the outline of this lesson as a short page: one heading, two
          paragraphs, and a list of three takeaways. In a later build you will
          upload that file here.
        </p>
      </div>
    </div>
  );
}

export function LessonBody({ lesson }: { lesson: Lesson }) {
  const copy = lessonCopy[lesson.id] ?? {
    kicker: "Prototype lesson",
    paragraphs: [
      `${lesson.title} is in the course, but this build does not ship a real ${lesson.contentType} file. Read the notes, then mark the lesson complete so progress can move on.`,
    ],
    takeaway: "Completion is what unlocks the rest of the course in this prototype.",
  };

  return (
    <article>
      {lesson.contentType === "video" ? <VideoFrame lesson={lesson} /> : null}
      {lesson.contentType === "quiz" ? <QuizFrame lesson={lesson} /> : null}
      {lesson.contentType === "assignment" ? (
        <AssignmentFrame lesson={lesson} />
      ) : null}

      <div className={lesson.contentType === "text" ? "" : "mt-6"}>
        <p className="eyebrow">{copy.kicker}</p>
        <div className="mt-3 space-y-4 text-sm leading-6 text-ink">
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <aside className="mt-6 border-l-2 border-brand pl-4">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            Takeaway
          </p>
          <p className="mt-1 text-sm leading-6">{copy.takeaway}</p>
        </aside>
      </div>
    </article>
  );
}
