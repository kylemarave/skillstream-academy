export const confirmationKeys = [
  "signed-in",
  "account-created",
  "signed-out",
  "enrolled",
  "access-pending",
  "access-failed",
  "lesson-complete",
  "certified",
  "course-created",
  "module-added",
  "lesson-added",
  "published",
  "unpublished",
  "archived",
  "restored",
  "saved",
  "deleted",
  "order-saved",
  "revoked",
  "question-sent",
] as const;

export type ConfirmationKey = (typeof confirmationKeys)[number];

export const confirmationCopy: Record<
  ConfirmationKey,
  { title: string; detail?: string; tone?: "success" | "danger" }
> = {
  "signed-in": {
    title: "Signed in",
    detail: "You are in your workspace.",
  },
  "account-created": {
    title: "Account created",
    detail: "You are signed in.",
  },
  "signed-out": {
    title: "Signed out",
    detail: "Sign in again to continue.",
  },
  enrolled: {
    title: "Enrollment confirmed",
    detail: "Course access is ready. Start the first lesson when you are.",
  },
  "access-pending": {
    title: "Enrollment confirmed",
    detail: "Course access is being set up. Lessons open when it finishes.",
  },
  "access-failed": {
    title: "Enrollment confirmed",
    detail: "Course access did not provision. Retry is Planned.",
    tone: "danger",
  },
  "lesson-complete": {
    title: "Lesson complete",
    detail: "Your progress is saved.",
  },
  certified: {
    title: "Certificate issued",
    detail: "Share the reference number. Anyone can verify it without signing in.",
  },
  "course-created": {
    title: "Course created",
    detail: "Saved as a draft. Add modules and lessons before you publish.",
  },
  "module-added": {
    title: "Module added",
  },
  "lesson-added": {
    title: "Lesson added",
  },
  published: {
    title: "Published",
    detail: "Students can now see this course in the catalog.",
  },
  unpublished: {
    title: "Returned to draft",
    detail: "Students can no longer see this course in the catalog.",
  },
  archived: {
    title: "Archived",
    detail: "Off the catalog. Students who already enrolled keep access.",
  },
  restored: {
    title: "Restored to draft",
    detail: "This is a private draft again. Publish when you want it in the catalog.",
  },
  saved: {
    title: "Saved",
  },
  deleted: {
    title: "Deleted",
  },
  "order-saved": {
    title: "Order saved",
  },
  "question-sent": {
    title: "Question sent",
    detail: "Your instructor can see it as pending.",
  },
  revoked: {
    title: "Certificate revoked",
    detail: "The reference stays in the registry. Public verify now shows it as revoked.",
    tone: "danger",
  },
};

export function withConfirmed(path: string, key: ConfirmationKey) {
  const url = new URL(path, "http://local");
  url.searchParams.set("confirmed", key);
  return `${url.pathname}${url.search}`;
}

export function isConfirmationKey(value: string | null): value is ConfirmationKey {
  return confirmationKeys.includes(value as ConfirmationKey);
}
