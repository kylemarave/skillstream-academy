import type { CourseStatus } from "@/lib/types";

const styles: Record<CourseStatus, string> = {
  draft: "border-warn/25 bg-warn-soft text-warn",
  published: "border-success/25 bg-success-soft text-success",
  archived: "border-line bg-subtle text-muted",
};

const labels: Record<CourseStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export function StatusBadge({ status }: { status: CourseStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
