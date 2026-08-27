interface StatCardProps {
  label: string;
  value: string | number;
  hint: string;
  accent?: "core" | "light" | "dark";
}

const accentStyles = {
  core: "border-amber-core/30 bg-amber-tint/30",
  light: "border-amber-light/40 bg-amber-tint/20",
  dark: "border-amber-dark/30 bg-amber-tint/40",
};

export function StatCard({ label, value, hint, accent = "core" }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${accentStyles[accent]}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
      <p className="mt-2 text-sm text-ink/60">{hint}</p>
    </div>
  );
}
