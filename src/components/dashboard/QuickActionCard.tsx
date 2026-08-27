import Link from "next/link";

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
  const className = `block rounded-xl border p-5 transition ${
    disabled
      ? "cursor-not-allowed border-ink/10 bg-paper opacity-60"
      : "border-ink/10 bg-white hover:border-amber-core/40 hover:bg-amber-tint/20"
  }`;

  const content = (
    <>
      {step ? (
        <p className="text-xs font-semibold text-amber-core">{step}</p>
      ) : null}
      <h3 className={`font-semibold ${step ? "mt-2" : ""}`}>{title}</h3>
      <p className="mt-2 text-sm text-ink/70">{description}</p>
    </>
  );

  if (disabled) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
