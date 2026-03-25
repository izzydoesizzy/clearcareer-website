interface TrustItem {
  name: string;
  logo?: string;
}

interface TrustBarProps {
  label?: string;
  items?: TrustItem[];
}

export default function TrustBar({
  label = "As seen in",
  items = [
    { name: "CBC Radio" },
    { name: "Global News" },
    { name: "Newsweek" },
    { name: "Inc. Magazine" },
  ],
}: TrustBarProps) {
  return (
    <section className="border-b border-border/50 bg-blue-bg/30 py-8">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            {label}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {items.map((item) =>
              item.logo ? (
                <img
                  key={item.name}
                  src={item.logo}
                  alt={item.name}
                  className="h-6 opacity-60 grayscale transition-opacity hover:opacity-90"
                />
              ) : (
                <span
                  key={item.name}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-navy shadow-sm ring-1 ring-border/60 transition-shadow hover:shadow-md"
                >
                  {item.name}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
