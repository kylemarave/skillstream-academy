export default function Loading() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-paper px-5"
      aria-label="Loading page"
    >
      <div className="w-full max-w-md">
        <div className="h-3 w-28 animate-pulse rounded bg-amber-light/60" />
        <div className="mt-5 h-10 w-3/4 animate-pulse rounded-lg bg-line/70" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-line/55" />
        <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-line/55" />
        <div className="mt-8 h-32 animate-pulse rounded-xl bg-surface-muted" />
        <p className="sr-only" role="status">
          Loading Skillstream Academy
        </p>
      </div>
    </main>
  );
}
