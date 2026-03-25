import Link from "next/link";

interface CTA {
  text: string;
  href: string;
}

interface HeroProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  primaryCTA?: CTA;
  secondaryCTA?: CTA;
  trustText?: string;
  variant?: "default" | "split" | "page";
  photoSrc?: string;
  photoAlt?: string;
}

export default function Hero({
  eyebrow,
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  trustText,
  variant = "default",
  photoSrc,
  photoAlt = "",
}: HeroProps) {
  const isPage = variant === "page";
  const isSplit = variant === "split";

  return (
    <section className={`relative overflow-hidden bg-navy ${isPage ? "py-16 md:py-20" : "py-20 md:py-28"}`}>
      {/* Mesh gradient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-blue/10 blur-[120px]"></div>
        <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-dark/15 blur-[100px]"></div>
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-blue/5 blur-[80px]"></div>
      </div>

      {/* Floating decorative shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute right-[8%] top-[12%] h-16 w-16 rotate-12 rounded-2xl border border-blue/20 opacity-40"></div>
        <div className="absolute bottom-[15%] left-[6%] h-10 w-10 rounded-full border border-blue/15 opacity-30"></div>
        <div className="absolute right-[25%] top-[25%] h-3 w-3 rounded-full bg-blue/30"></div>
        <div className="absolute bottom-[30%] left-[20%] h-2 w-2 rounded-full bg-blue/20"></div>
        <div className="absolute right-[15%] bottom-[20%] h-6 w-6 rotate-45 rounded-sm border border-blue/10 opacity-30"></div>
      </div>

      <div className="relative mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        {isSplit ? (
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
            {/* Text column */}
            <div className="text-center md:text-left" data-animate="fade-up">
              {eyebrow && (
                <p className="mb-4 inline-block rounded-full bg-blue/10 px-4 py-1.5 text-sm font-semibold text-blue">
                  {eyebrow}
                </p>
              )}
              <h1
                className="mx-auto max-w-4xl font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-white md:mx-0"
                dangerouslySetInnerHTML={{ __html: headline }}
              />
              {subheadline && (
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 md:mx-0">
                  {subheadline}
                </p>
              )}
              {(primaryCTA || secondaryCTA) && (
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
                  {primaryCTA && (
                    <a
                      href={primaryCTA.href}
                      className="inline-flex items-center justify-center rounded-lg bg-blue px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-blue-dark hover:shadow-lg hover:shadow-blue/25"
                    >
                      {primaryCTA.text}
                    </a>
                  )}
                  {secondaryCTA && (
                    secondaryCTA.href.startsWith("/") ? (
                      <Link
                        href={secondaryCTA.href}
                        className="inline-flex items-center justify-center rounded-lg border-2 border-white/20 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
                      >
                        {secondaryCTA.text}
                      </Link>
                    ) : (
                      <a
                        href={secondaryCTA.href}
                        className="inline-flex items-center justify-center rounded-lg border-2 border-white/20 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
                      >
                        {secondaryCTA.text}
                      </a>
                    )
                  )}
                </div>
              )}
              {trustText && (
                <p className="mt-8 text-sm text-gray-500">{trustText}</p>
              )}
            </div>

            {/* Photo column */}
            {photoSrc && (
              <div className="flex justify-center" data-animate="slide-right">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-blue/15 blur-2xl" aria-hidden="true"></div>
                  <img
                    src={photoSrc}
                    alt={photoAlt}
                    className="relative h-[320px] w-[320px] rounded-full object-cover object-top shadow-2xl ring-4 ring-white/10 md:h-[400px] md:w-[400px]"
                    loading="eager"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center" data-animate="fade-up">
            {eyebrow && (
              <p className="mb-4 inline-block rounded-full bg-blue/10 px-4 py-1.5 text-sm font-semibold text-blue">
                {eyebrow}
              </p>
            )}
            <h1
              className="mx-auto max-w-4xl font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-white"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
            {subheadline && (
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
                {subheadline}
              </p>
            )}
            {(primaryCTA || secondaryCTA) && (
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {primaryCTA && (
                  primaryCTA.href.startsWith("/") ? (
                    <Link
                      href={primaryCTA.href}
                      className="inline-flex items-center justify-center rounded-lg bg-blue px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-blue-dark hover:shadow-lg hover:shadow-blue/25"
                    >
                      {primaryCTA.text}
                    </Link>
                  ) : (
                    <a
                      href={primaryCTA.href}
                      className="inline-flex items-center justify-center rounded-lg bg-blue px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-blue-dark hover:shadow-lg hover:shadow-blue/25"
                    >
                      {primaryCTA.text}
                    </a>
                  )
                )}
                {secondaryCTA && (
                  secondaryCTA.href.startsWith("/") ? (
                    <Link
                      href={secondaryCTA.href}
                      className="inline-flex items-center justify-center rounded-lg border-2 border-white/20 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
                    >
                      {secondaryCTA.text}
                    </Link>
                  ) : (
                    <a
                      href={secondaryCTA.href}
                      className="inline-flex items-center justify-center rounded-lg border-2 border-white/20 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
                    >
                      {secondaryCTA.text}
                    </a>
                  )
                )}
              </div>
            )}
            {trustText && (
              <p className="mt-8 text-sm text-gray-500">{trustText}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
