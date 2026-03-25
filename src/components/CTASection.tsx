import Link from "next/link";

interface CTA {
  text: string;
  href: string;
}

interface CTASectionProps {
  heading: string;
  body?: string;
  primaryCTA?: CTA;
  secondaryCTA?: CTA;
  variant?: "blue" | "white" | "gradient";
}

export default function CTASection({
  heading,
  body,
  primaryCTA,
  secondaryCTA,
  variant = "blue",
}: CTASectionProps) {
  const isBlue = variant === "blue";
  const isGradient = variant === "gradient";
  const isDark = isBlue || isGradient;

  return (
    <section
      className={`relative overflow-hidden py-16 md:py-24 ${
        isGradient ? "" : isBlue ? "bg-blue" : "bg-white"
      }`}
      style={isGradient ? { background: "linear-gradient(135deg, #0161EF 0%, #0450c8 50%, #030620 100%)" } : undefined}
    >
      {isGradient && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-white/5 blur-[80px]"></div>
          <div className="absolute -bottom-20 -left-20 h-[250px] w-[250px] rounded-full bg-blue-light/10 blur-[60px]"></div>
        </div>
      )}

      <div className="relative mx-auto max-w-[720px] px-4 text-center sm:px-6 lg:px-8" data-animate="fade-up">
        <h2
          className={`font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] ${isDark ? "text-white" : "text-navy"}`}
          dangerouslySetInnerHTML={{ __html: heading }}
        />

        {body && (
          <p className={`mx-auto mt-4 max-w-xl text-lg leading-relaxed ${isDark ? "text-blue-100" : "text-text-muted"}`}>
            {body}
          </p>
        )}

        {(primaryCTA || secondaryCTA) && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {primaryCTA && (
              primaryCTA.href.startsWith("/") ? (
                <Link
                  href={primaryCTA.href}
                  className={`inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-base font-semibold transition-all ${
                    isDark
                      ? "bg-white text-blue hover:bg-gray-100 hover:shadow-lg"
                      : "bg-blue text-white hover:bg-blue-dark hover:shadow-lg hover:shadow-blue/25"
                  }`}
                >
                  {primaryCTA.text}
                </Link>
              ) : (
                <a
                  href={primaryCTA.href}
                  className={`inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-base font-semibold transition-all ${
                    isDark
                      ? "bg-white text-blue hover:bg-gray-100 hover:shadow-lg"
                      : "bg-blue text-white hover:bg-blue-dark hover:shadow-lg hover:shadow-blue/25"
                  }`}
                >
                  {primaryCTA.text}
                </a>
              )
            )}
            {secondaryCTA && (
              secondaryCTA.href.startsWith("/") ? (
                <Link
                  href={secondaryCTA.href}
                  className={`inline-flex items-center justify-center rounded-lg border-2 px-8 py-3.5 text-base font-semibold transition-colors ${
                    isDark
                      ? "border-white/30 text-white hover:bg-white/10"
                      : "border-blue text-blue hover:bg-blue-bg"
                  }`}
                >
                  {secondaryCTA.text}
                </Link>
              ) : (
                <a
                  href={secondaryCTA.href}
                  className={`inline-flex items-center justify-center rounded-lg border-2 px-8 py-3.5 text-base font-semibold transition-colors ${
                    isDark
                      ? "border-white/30 text-white hover:bg-white/10"
                      : "border-blue text-blue hover:bg-blue-bg"
                  }`}
                >
                  {secondaryCTA.text}
                </a>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
