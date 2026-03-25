interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  pullQuote?: string;
  tagline?: string;
  outcome?: string;
  image?: string;
  color?: string;
  index?: number;
  onReadMore?: boolean;
}

export default function TestimonialCard({
  name,
  role,
  quote,
  pullQuote,
  tagline,
  outcome,
  image,
  color = "bg-blue",
  index = 0,
}: TestimonialCardProps) {
  const displayQuote = pullQuote || tagline || quote;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`rounded-xl border bg-white p-5 transition-shadow duration-300 flex flex-col ${
        outcome
          ? "border-l-4 border-l-success border-t-border border-r-border border-b-border"
          : "border-border"
      } shadow-[0_4px_24px_-4px_rgba(1,97,239,0.10)] hover:shadow-[0_8px_40px_-4px_rgba(1,97,239,0.18)]`}
      data-testimonial-index={index}
    >
      {/* Outcome Badge */}
      {outcome && (
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {outcome}
          </span>
        </div>
      )}

      {/* Quote */}
      <blockquote className="flex-1">
        <p className="text-[1.0625rem] leading-relaxed italic text-navy">
          &ldquo;{displayQuote}&rdquo;
        </p>
      </blockquote>

      {/* Author */}
      <div className="mt-4 flex items-center gap-3 min-w-0">
        {image ? (
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-blue/20">
            <img
              src={image}
              alt={name}
              width={36}
              height={36}
              className="h-full w-full object-cover object-top"
              loading="lazy"
            />
          </div>
        ) : (
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${color}`}
          >
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text">{name}</p>
          <p className="truncate text-xs text-text-muted">{role}</p>
        </div>
      </div>
    </div>
  );
}
