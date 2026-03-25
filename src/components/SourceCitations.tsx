interface Source {
  source: string;
  year: number;
  url: string;
}

interface SourceCitationsProps {
  sources: Source[];
  variant?: "section" | "page";
}

export default function SourceCitations({ sources, variant = "section" }: SourceCitationsProps) {
  const isPage = variant === "page";

  return (
    <div className={`rounded-xl bg-blue-bg ${isPage ? "p-6 sm:p-8 mt-12" : "p-4 sm:p-5 mt-8"}`}>
      <p className={`font-semibold uppercase tracking-wider text-text-muted ${isPage ? "text-xs" : "text-[0.65rem]"}`}>
        Sources
      </p>
      <ol className={`list-none ${isPage ? "mt-3 space-y-1.5" : "mt-2 space-y-1"}`}>
        {sources.map((src, i) => (
          <li key={src.url} className={`text-text-muted ${isPage ? "text-sm" : "text-xs"}`}>
            <sup className="mr-1 font-semibold text-blue">{i + 1}</sup>
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-text-muted/30 underline-offset-2 transition-colors hover:text-blue hover:decoration-blue/50"
            >
              {src.source}, {src.year}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
