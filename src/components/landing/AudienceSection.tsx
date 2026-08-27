const audiences = [
  {
    id: "students",
    title: "For students",
    description:
      "One dashboard for courses, progress, AI help, and certificates.",
    items: [
      "Browse and enroll in published courses",
      "Track lesson progress in one place",
      "Get 24/7 AI support with instructor escalation",
      "Download and verify certificates",
    ],
  },
  {
    id: "for-instructors",
    title: "For instructors",
    description:
      "Roster, progress monitoring, and an AI escalation inbox.",
    items: [
      "Create courses with modules and lessons",
      "Monitor student progress per course",
      "Handle AI handoffs from your inbox",
      "Publish courses to the student catalog",
    ],
  },
];

export function AudienceSection() {
  return (
    <section id="for-instructors" className="border-t border-ink/10 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-4xl font-medium tracking-[-0.03em]">
          Built for students and instructors
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {audiences.map((audience) => (
            <article
              key={audience.title}
              className="border-t border-line py-8 md:border-t-0 md:border-l md:px-8"
            >
              <h3 className="font-display text-2xl font-semibold">{audience.title}</h3>
              <p className="mt-3 text-muted">{audience.description}</p>
              <ul className="mt-6 space-y-3">
                {audience.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-ink/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-core" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
