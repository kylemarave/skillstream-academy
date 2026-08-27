import type { CourseStatus } from "@/lib/types";

const styles: Record<CourseStatus, string> = {
  draft: "border-amber-light/70 bg-amber-tint/60 text-amber-dark",
  published: "border-success/25 bg-success/10 text-success",
  archived: "border-line bg-surface-muted text-muted",
};

const labels: Record<CourseStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export function StatusBadge({ status }: { status: CourseStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
