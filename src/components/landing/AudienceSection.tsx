import { GraduationCap, PenLine } from "lucide-react";

const audiences = [
  {
    title: "For students",
    icon: GraduationCap,
    items: [
      "Browse and enroll in published courses",
      "Track lesson progress in one place",
      "Ask for help and reach an instructor when needed",
      "Download and share verified certificates",
    ],
  },
  {
    title: "For instructors",
    icon: PenLine,
    items: [
      "Build courses from modules and lessons",
      "Publish to the catalog when the content is ready",
      "Follow student progress per course",
      "Answer escalated questions from one inbox",
    ],
  },
];

export function AudienceSection() {
  return (
    <section id="roles" className="border-t border-line bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-7">
        <h2 className="text-2xl font-semibold tracking-tight">
          Built for both sides of the course
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {audiences.map((audience) => {
            const Icon = audience.icon;

            return (
              <div key={audience.title}>
                <span
                  aria-hidden="true"
                  className="grid size-11 place-items-center rounded-lg bg-brand-soft text-brand-strong"
                >
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-medium">{audience.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {audience.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-muted">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1 shrink-0 rounded-full bg-brand"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
