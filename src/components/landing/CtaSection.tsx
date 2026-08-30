import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-7">
        <div className="card flex flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center sm:px-8">
          <div>
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
              Walk the path on a demo account
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted">
              Sign in as a student to enroll, complete lessons, and share a
              certificate reference. Instructor and admin accounts are on the
              same sign-in screen.
            </p>
          </div>
          <Link href="/login" className="btn btn-primary">
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
