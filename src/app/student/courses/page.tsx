import { AppShell } from "@/components/AppShell";
import { CourseCover } from "@/components/dashboard/CourseCover";
import { EnrollButton } from "@/components/EnrollButton";
import { requireRole } from "@/lib/auth";
import { courseAccessState } from "@/lib/access";
import { listCourses, listLearningForStudent } from "@/lib/db";
import { studentNav } from "@/lib/nav";

export default async function StudentCoursesPage() {
  const session = await requireRole(["student"]);
  const [courses, enrolled] = await Promise.all([
    listCourses({ status: "published" }),
    listLearningForStudent(session.id),
  ]);
  const enrolledByCourse = new Map(
    enrolled.map((item) => [item.course.id, item]),
  );

  return (
    <AppShell
      user={session}
      title="Course catalog"
      subtitle="All courses are free. Confirm a place; access is set up after you enroll."
      nav={studentNav}
    >
      {courses.length === 0 ? (
        <div className="card px-5 py-10">
          <p className="text-sm font-medium">Nothing is open for enrollment</p>
          <p className="mt-1 max-w-md text-sm text-muted">
            Instructors publish courses from their own workspace. Published
            courses show up here straight away.
          </p>
        </div>
      ) : (
        <section aria-labelledby="catalog-title" className="card">
          <div className="border-b border-line px-5 py-4">
            <h2 id="catalog-title" className="section-title">
              {courses.length} course{courses.length === 1 ? "" : "s"}
            </h2>
          </div>

          <ul className="divide-y divide-line">
            {courses.map((course) => (
              <li
                key={course.id}
                className="grid gap-4 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
              >
                <div className="flex min-w-0 gap-3">
                  <CourseCover title={course.title} status={course.status} />
                  <div className="min-w-0">
                    <h3 className="text-base font-medium">{course.title}</h3>
                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">
                      {course.description || "No description yet."}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      Self-paced · access after enrollment
                    </p>
                  </div>
                </div>

                <div className="sm:w-48">
                  <p className="text-sm font-medium sm:text-right">Free</p>
                  <div className="mt-2">
                    <EnrollButton
                      courseId={course.id}
                      courseTitle={course.title}
                      enrolled={enrolledByCourse.has(course.id)}
                      accessState={courseAccessState(
                        enrolledByCourse.get(course.id)?.lmsAccount,
                      )}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AppShell>
  );
}
