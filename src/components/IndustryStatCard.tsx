interface IndustryStatCardProps {
  number: string;
  label: string;
  detail?: string;
  source: string;
  color?: "blue" | "warning" | "success";
}

const colorClasses = {
  blue: "text-blue",
  warning: "text-warning",
  success: "text-success",
};

export default function IndustryStatCard({
  number,
  label,
  detail,
  source,
  color = "blue",
}: IndustryStatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-6 text-center shadow-sm">
      <p className={`text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none ${colorClasses[color]}`}>
        {number}
      </p>
      <p className="mt-3 text-sm font-semibold text-navy">{label}</p>
      {detail && (
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{detail}</p>
      )}
      <p className="mt-3 text-[0.65rem] uppercase tracking-wider text-text-muted/70">{source}</p>
    </div>
  );
}
