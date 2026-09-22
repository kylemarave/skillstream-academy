export const studentJourneySteps = [
  {
    id: "enroll",
    title: "Enroll",
    description: "Pick a published course.",
  },
  {
    id: "learn",
    title: "Learn",
    description: "Work through lessons at your pace.",
  },
  {
    id: "certify",
    title: "Get certified",
    description: "Completion issues your certificate.",
  },
] as const;

export const instructorJourneySteps = [
  {
    id: "create",
    title: "Create",
    description: "Author modules and lessons.",
  },
  {
    id: "publish",
    title: "Publish",
    description: "Open the course for enrollment.",
  },
  {
    id: "support",
    title: "Support",
    description: "Track progress and answer escalations.",
  },
] as const;

/*
  Enrollment and certification run in this prototype. AI escalation does not.
*/
export const integrations = [
  {
    id: "registration-lms",
    label: "Enrollment → LMS access",
    detail: "Confirming enrollment sets up LMS access and writes enrollment.confirmed. The course becomes active only after access is provisioned.",
    status: "Live",
  },
  {
    id: "lms-cert",
    label: "Completion → Certificate",
    detail: "Finishing every lesson issues a verifiable credential and writes enrollment.completed.",
    status: "Live",
  },
  {
    id: "portal-ai",
    label: "AI assistant → Instructor",
    detail: "Unanswered questions escalate to the course instructor.",
    status: "Planned",
  },
] as const;

export type JourneyStepId = (typeof studentJourneySteps)[number]["id"];
