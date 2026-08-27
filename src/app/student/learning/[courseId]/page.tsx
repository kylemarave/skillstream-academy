import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CourseOutline } from "@/components/player/CourseOutline";
import { ProgressMeter } from "@/components/player/ProgressMeter";
import { EnrollmentBadge } from "@/components/EnrollmentBadge";
import { requireRole } from "@/lib/auth";
import { getPlayerState } from "@/lib/db";
import { studentNav } from "@/lib/nav";
import { contentTypeLabels } from "@/lib/player";

type PageProps = { params: Promise<{ courseId: string }> };

export default async function CoursePlayerOverviewPage({ params }: PageProps) {
  const session = await requireRole(["student"]);
  const { courseId } = await params;
  const state = await getPlayerState(session.id, courseId);

  if (!state) {
    notFound();
  }

  const { enrollment, course, progress, summary } = state;
  const continueHref = summary.nextLesson
    ? `/student/learning/${course.id}/lessons/${summary.nextLesson.id}`
    : null;
  const courseComplete = enrollment.status === "completed";

  return (
    <AppShell
      user={session}
      title={course.title}
      subtitle={course.description || "Work through the outline at your own pace."}
      nav={studentNav}
      actions={
        <Link href="/student/learning" className="btn btn-secondary">
          <ArrowLeft aria-hidden="true" size={16} />
          My courses
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <CourseOutline
          courseId={course.id}
          modules={course.modules}
          progress={progress}
        />

        <div className="space-y-6">
          <section className="card px-5 py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Your progress</p>
                <p className="mt-1 text-sm text-muted">
                  Access is ready. Finish every lesson to complete the course.
                </p>
              </div>
              <EnrollmentBadge status={enrollment.status} />
            </div>
            <div className="mt-4">
              <ProgressMeter
                completed={summary.completed}
                total={summary.total}
                percent={summary.percent}
              />
            </div>

            {courseComplete && state.certificate ? (
              <div className="mt-5 rounded-lg border border-success/25 bg-success-soft px-4 py-3">
                <p className="text-sm font-medium text-success">
                  Course complete
                </p>
                <p className="mt-1 font-mono text-sm">
                  {state.certificate.referenceNumber}
                </p>
                <Link
                  href={`/student/certificates/${state.certificate.id}`}
                  className="mt-3 inline-flex text-sm font-medium text-brand hover:text-brand-strong"
                >
                  View certificate
                </Link>
              </div>
            ) : courseComplete ? (
              <div className="mt-5 rounded-lg border border-success/25 bg-success-soft px-4 py-3">
                <p className="text-sm font-medium text-success">
                  Course complete
                </p>
              </div>
            ) : null}

            <div className="mt-5">
              {summary.total === 0 ? (
                <p className="text-sm text-muted">
                  This course has no lessons yet. Check back after the instructor
                  adds content.
                </p>
              ) : continueHref ? (
                <Link href={continueHref} className="btn btn-primary">
                  {summary.completed === 0
                    ? `Start ${summary.nextLesson?.title}`
                    : `Continue ${summary.nextLesson?.title}`}
                </Link>
              ) : (
                <Link
                  href={`/student/learning/${course.id}/lessons/${state.lessons[0].id}`}
                  className="btn btn-secondary"
                >
                  Review lessons
                </Link>
              )}
            </div>
          </section>

          <section aria-labelledby="modules-title" className="card">
            <div className="border-b border-line px-5 py-4">
              <h2 id="modules-title" className="section-title">
                Modules
              </h2>
            </div>
            {course.modules.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted">
                No modules have been added yet.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {course.modules.map((courseModule) => (
                  <li key={courseModule.id} className="px-5 py-4">
                    <p className="text-sm font-medium">{courseModule.title}</p>
                    {courseModule.lessons.length === 0 ? (
                      <p className="mt-1 text-sm text-muted">
                        Empty module — it does not block completion.
                      </p>
                    ) : (
                      <ul className="mt-2 space-y-1">
                        {courseModule.lessons.map((lesson) => (
                          <li key={lesson.id}>
                            <Link
                              href={`/student/learning/${course.id}/lessons/${lesson.id}`}
                              className="text-sm text-brand hover:text-brand-strong"
                            >
                              {lesson.title}
                              <span className="ml-2 text-muted">
                                {contentTypeLabels[lesson.contentType]}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
