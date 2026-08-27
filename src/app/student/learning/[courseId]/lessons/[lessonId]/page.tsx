import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CompleteLessonButton } from "@/components/player/CompleteLessonButton";
import { CourseOutline } from "@/components/player/CourseOutline";
import { LessonBody } from "@/components/player/LessonBody";
import { requireRole } from "@/lib/auth";
import { getPlayerState, startLesson } from "@/lib/db";
import { studentNav } from "@/lib/nav";
import { contentTypeLabels, getLessonProgressStatus } from "@/lib/player";

type PageProps = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

export default async function LessonPlayerPage({ params }: PageProps) {
  const session = await requireRole(["student"]);
  const { courseId, lessonId } = await params;
  const started = await startLesson(session.id, courseId, lessonId);

  if (!started.ok) {
    notFound();
  }

  const state = await getPlayerState(session.id, courseId);
  const lesson = state?.lessons.find((item) => item.id === lessonId);

  if (!state || !lesson) {
    notFound();
  }

  const courseModule = state.course.modules.find(
    (item) => item.id === lesson.moduleId,
  );
  const lessonIndex = state.lessons.findIndex((item) => item.id === lesson.id);
  const previousLesson = state.lessons[lessonIndex - 1] ?? null;
  const status = getLessonProgressStatus(state.progress, lesson.id);
  const completed = status === "completed";
  const nextLessonId = completed
    ? (state.summary.nextLesson?.id ?? null)
    : (state.lessons[lessonIndex + 1]?.id ?? null);

  return (
    <AppShell
      user={session}
      title={lesson.title}
      subtitle={`${state.course.title}${courseModule ? ` · ${courseModule.title}` : ""}`}
      nav={studentNav}
      actions={
        <Link
          href={`/student/learning/${courseId}`}
          className="btn btn-secondary"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Course outline
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <CourseOutline
          courseId={courseId}
          modules={state.course.modules}
          progress={state.progress}
          currentLessonId={lesson.id}
        />

        <section className="card px-5 py-5 sm:px-6 sm:py-6">
          <p className="eyebrow">
            {contentTypeLabels[lesson.contentType]}
            {lesson.durationMinutes ? ` · ${lesson.durationMinutes} min` : ""}
            {` · Lesson ${lessonIndex + 1} of ${state.lessons.length}`}
          </p>

          <div className="mt-5">
            <LessonBody lesson={lesson} />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            {previousLesson ? (
              <Link
                href={`/student/learning/${courseId}/lessons/${previousLesson.id}`}
                className="btn btn-quiet"
              >
                Previous
              </Link>
            ) : (
              <span />
            )}
            <CompleteLessonButton
              courseId={courseId}
              lesson={lesson}
              completed={completed}
              nextLessonId={nextLessonId}
            />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
