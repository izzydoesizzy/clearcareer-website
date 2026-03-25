interface StatItem {
  number: string;
  label: string;
}

interface StatsBarProps {
  stats?: StatItem[];
  variant?: "light" | "dark";
}

export default function StatsBar({
  stats = [
    { number: "200+", label: "Professionals Coached" },
    { number: "$1.2M+", label: "Collective Raises" },
    { number: "46%", label: "Landed Within 1 Month" },
    { number: "98%", label: "Client Satisfaction" },
  ],
  variant = "dark",
}: StatsBarProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={`py-12 ${
        isDark
          ? "bg-gradient-to-r from-navy via-[#0a1a4a] to-navy border-y border-blue/10"
          : "bg-white border-y border-border"
      }`}
    >
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4" data-animate-stagger>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className={`text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none ${
                  isDark
                    ? "bg-gradient-to-r from-blue to-blue-light bg-clip-text text-transparent"
                    : "text-blue"
                }`}
              >
                {stat.number}
              </p>
              <p
                className={`mt-2 text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-text-muted"
                }`}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
