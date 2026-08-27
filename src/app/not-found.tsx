import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-canvas px-5 py-12"
    >
      <div className="max-w-md">
        <p className="eyebrow">404</p>
        <h1 className="page-title mt-3">This page does not exist</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          The page may have moved, or your role may not have access to it.
        </p>
        <Link href="/" className="btn btn-primary mt-6">
          Back to home
        </Link>
      </div>
    </main>
  );
}
