export const confirmationKeys = [
  "signed-in",
  "signed-out",
  "enrolled",
  "lesson-complete",
  "certified",
  "course-created",
  "module-added",
  "lesson-added",
  "published",
  "unpublished",
] as const;

export type ConfirmationKey = (typeof confirmationKeys)[number];

export const confirmationCopy: Record<
  ConfirmationKey,
  { title: string; detail?: string }
> = {
  "signed-in": {
    title: "Signed in",
    detail: "You are in your workspace.",
  },
  "signed-out": {
    title: "Signed out",
    detail: "Sign in again to continue.",
  },
  enrolled: {
    title: "Enrollment confirmed",
    detail: "Course access is ready. Start the first lesson when you are.",
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
    detail: "Students can no longer see this course.",
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
