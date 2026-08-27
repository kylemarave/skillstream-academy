import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  step?: string;
  disabled?: boolean;
}

export function QuickActionCard({
  title,
  description,
  href,
  step,
  disabled,
}: QuickActionCardProps) {
  const className = `group flex min-h-28 items-start justify-between gap-5 border-b border-line px-1 py-5 last:border-b-0 ${
    disabled
      ? "cursor-not-allowed opacity-50"
      : "hover:text-amber-dark"
  }`;

  const content = (
    <div>
      {step ? (
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-core">
          {step}
        </p>
      ) : null}
      <h3 className={`font-semibold ${step ? "mt-1.5" : ""}`}>{title}</h3>
      <p className="mt-1 max-w-xl text-sm leading-6 text-muted">{description}</p>
    </div>
  );

  if (disabled) {
    return (
      <div className={className}>
        {content}
        <span className="rounded-md bg-surface-muted px-2 py-1 text-xs font-medium text-muted">
          Coming soon
        </span>
      </div>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
      <ArrowUpRight
        aria-hidden="true"
        size={19}
        className="mt-1 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-dark"
      />
    </Link>
  );
}
