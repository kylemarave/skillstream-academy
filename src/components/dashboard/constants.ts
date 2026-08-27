export const studentJourneySteps = [
  {
    id: "enroll",
    number: "01",
    title: "Enroll",
    description: "Confirm enrollment — your LMS account is provisioned automatically.",
  },
  {
    id: "learn",
    number: "02",
    title: "Learn",
    description: "Track lessons and progress with 24/7 AI support along the way.",
  },
  {
    id: "certify",
    number: "03",
    title: "Get certified",
    description: "Course completion auto-issues a verifiable certificate.",
  },
] as const;

export const instructorJourneySteps = [
  {
    id: "create",
    number: "01",
    title: "Create",
    description: "Author courses with modules and lessons for your students.",
  },
  {
    id: "publish",
    number: "02",
    title: "Publish",
    description: "Students enroll — LMS accounts provision on confirmation.",
  },
  {
    id: "support",
    number: "03",
    title: "Support",
    description: "Monitor rosters, progress, and AI escalations from your inbox.",
  },
] as const;

export const integrations = [
  {
    id: "registration-lms",
    from: "Registration",
    to: "LMS",
    trigger: "Enrollment confirmed",
    outcome: "LMS account auto-provisioned",
  },
  {
    id: "lms-cert",
    from: "LMS",
    to: "Certificates",
    trigger: "Course completed",
    outcome: "Verifiable certificate issued",
  },
  {
    id: "portal-ai",
    from: "Student Portal",
    to: "AI Assistant",
    trigger: "Student asks for help",
    outcome: "Progress-aware support · escalates to you",
  },
] as const;

export type JourneyStepId = (typeof studentJourneySteps)[number]["id"];
