interface StatCardProps {
  label: string;
  value: string | number;
  hint: string;
  accent?: "core" | "light" | "dark";
}

const accentStyles = {
  core: "text-amber-dark",
  light: "text-amber-core",
  dark: "text-ink",
};

export function StatCard({ label, value, hint, accent = "core" }: StatCardProps) {
  return (
    <div className="px-5 py-5 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <p
        className={`mt-2 font-display text-4xl font-semibold leading-none tabular-nums ${accentStyles[accent]}`}
      >
        {value}
      </p>
      <p className="mt-2 text-sm text-muted">{hint}</p>
    </div>
  );
}
