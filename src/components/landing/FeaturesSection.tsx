import { ArrowRight, Award, Bot, GraduationCap } from "lucide-react";
import { integrations } from "@/components/dashboard/constants";

const flowIcons = {
  "registration-lms": GraduationCap,
  "lms-cert": Award,
  "portal-ai": Bot,
} as const;

export function FeaturesSection() {
  return (
    <section id="connected" className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-7">
        <h2 className="text-2xl font-semibold tracking-tight">
          What it connects
        </h2>
        <p className="mt-2 max-w-xl text-muted">
          Registration, the course platform, certification, and support behave
          as one system instead of four.
        </p>

        <ul className="mt-10 divide-y divide-line border-y border-line">
          {integrations.map((integration) => {
            const Icon = flowIcons[integration.id];
            const [from, to] = integration.label.split(" → ");

            return (
              <li key={integration.id} className="flex gap-4 py-5">
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-strong"
                >
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium">
                    <span>{from}</span>
                    <ArrowRight
                      aria-hidden="true"
                      size={16}
                      className="text-brand"
                    />
                    <span>{to}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {integration.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
