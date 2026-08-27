import { Award, BookOpen, ClipboardCheck, type LucideIcon } from "lucide-react";

const steps: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Enroll",
    description:
      "Choose a published course and confirm your place. Course access is set up for you.",
    icon: ClipboardCheck,
  },
  {
    title: "Learn",
    description:
      "Work through modules and lessons at your own pace, with help available as you go.",
    icon: BookOpen,
  },
  {
    title: "Get certified",
    description:
      "Finishing every lesson issues a certificate other people can verify.",
    icon: Award,
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-t border-line bg-surface py-16 md:py-20"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-7">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <p className="mt-2 max-w-xl text-muted">
          Three steps, with nothing to chase in between.
        </p>

        <ol className="mt-10 flex flex-col gap-8 md:flex-row md:items-start md:gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                key={step.title}
                className="flex md:min-w-0 md:flex-1 md:flex-col"
              >
                <div className="flex items-center md:w-full">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand text-white">
                    <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
                  </span>
                  {index < steps.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="mx-3 hidden h-0.5 flex-1 bg-brand md:block"
                    />
                  ) : null}
                </div>
                <div className="ml-4 min-w-0 md:ml-0 md:mt-4">
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
