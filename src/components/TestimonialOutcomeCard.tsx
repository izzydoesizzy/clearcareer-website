interface TestimonialOutcomeCardProps {
  name: string;
  role: string;
  quote: string;
  tagline?: string;
  outcome?: string;
  image?: string;
  index?: number;
  showReadMore?: boolean;
  onReadMore?: (index: number) => void;
}

export default function TestimonialOutcomeCard({
  name,
  role,
  quote,
  tagline,
  outcome,
  image,
  index = 0,
  showReadMore = false,
  onReadMore,
}: TestimonialOutcomeCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const snippetLength = 120;
  const snippet =
    quote.length > snippetLength
      ? quote.slice(0, quote.lastIndexOf(" ", snippetLength)) + "..."
      : quote;

  return (
    <div className="flex flex-col rounded-xl border border-border border-l-4 border-l-success bg-white p-5 shadow-[0_4px_24px_-4px_rgba(1,97,239,0.10)] transition-shadow duration-300 hover:shadow-[0_8px_40px_-4px_rgba(1,97,239,0.18)]">
      {outcome && (
        <div className="mb-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {outcome}
          </span>
        </div>
      )}

      <h3 className="text-lg font-bold leading-snug text-navy">{tagline}</h3>
      <div className="my-3 h-px w-12 bg-success"></div>

      <blockquote className="flex-1">
        <p className="text-sm leading-relaxed italic text-text-muted">
          &ldquo;{snippet}&rdquo;
        </p>
      </blockquote>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
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
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue text-xs font-semibold text-white">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text">{name}</p>
            <p className="truncate text-xs text-text-muted">{role}</p>
          </div>
        </div>
        {showReadMore && onReadMore && (
          <button
            className="shrink-0 text-xs font-semibold text-blue transition-colors hover:text-blue-dark"
            onClick={() => onReadMore(index)}
          >
            Read more
          </button>
        )}
      </div>
    </div>
  );
}
