import type { CourseStatus } from "@/lib/types";

const styles: Record<CourseStatus, string> = {
  draft: "bg-amber-tint text-ink",
  published: "bg-amber-core text-paper",
  archived: "bg-amber-desaturated/20 text-amber-desaturated",
};

const labels: Record<CourseStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export function StatusBadge({ status }: { status: CourseStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
