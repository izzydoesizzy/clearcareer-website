import { generatePageMetadata } from "@components/SEOHead";
import Hero from "@components/Hero";
import CTASection from "@components/CTASection";
import toolsData from "@data/tools.json";

export const metadata = generatePageMetadata({
  title: "Career Tools & Resources | ClearCareer",
  description: "Curated directory of career tools for job seekers. Resume builders, salary research, interview prep, and more. Personally tested and recommended by Izzy.",
  url: "/tools",
});

const categories = [...new Set(toolsData.map((t: any) => t.category))];
const toolsByCategory = categories.map((cat) => ({
  name: cat,
  tools: toolsData.filter((t: any) => t.category === cat),
}));

const pricingColors: Record<string, string> = {
  Free: "bg-success/10 text-success",
  Freemium: "bg-blue-bg text-blue",
  Paid: "bg-warning/10 text-warning",
};

export default function ToolsPage() {
  return (
    <>
      <Hero
        variant="page"
        eyebrow="Career Tools"
        headline="Tools That Make Your Job Search Smarter"
        subheadline="Every tool on this page is one I've personally used with clients. Some are free, some are paid. All are worth your time."
      />

      {toolsByCategory.map((category) => (
        <section key={category.name} className="py-10 md:py-14">
          <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-2xl font-bold text-navy">{category.name}</h2>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-navy/10">
                    <th className="py-3 pr-4 text-sm font-semibold uppercase tracking-wider text-text-muted">Tool</th>
                    <th className="py-3 pr-4 text-sm font-semibold uppercase tracking-wider text-text-muted">What it does</th>
                    <th className="py-3 pr-4 text-sm font-semibold uppercase tracking-wider text-text-muted">Pricing</th>
                    <th className="py-3 text-sm font-semibold uppercase tracking-wider text-text-muted">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {category.tools.map((tool: any, i: number) => (
                    <tr key={tool.name} className={`border-b border-border ${i % 2 === 0 ? "bg-white" : "bg-blue-bg/30"}`}>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-navy">{tool.name}</span>
                          {tool.recommended && (
                            <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Pick</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-[0.9375rem] text-text-muted">{tool.description}</td>
                      <td className="py-4 pr-4">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${pricingColors[tool.pricing] || "bg-blue-bg text-blue"}`}>
                          {tool.pricing}
                        </span>
                      </td>
                      <td className="py-4">
                        {tool.url && (
                          <a
                            href={tool.affiliateUrl && tool.affiliateUrl !== "PLACEHOLDER" ? tool.affiliateUrl : tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-blue hover:text-blue-dark"
                          >
                            Visit <span className="hidden lg:inline">&rarr;</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-blue hover:text-blue-dark">
                  Read Izzy&apos;s reviews ({category.tools.filter((t: any) => t.review).length})
                </summary>
                <div className="mt-4 space-y-4">
                  {category.tools.filter((t: any) => t.review).map((tool: any) => (
                    <div key={tool.name} className="rounded-lg border border-border bg-white p-4">
                      <p className="mb-1 font-semibold text-navy">{tool.name}</p>
                      <p className="text-[0.9375rem] leading-relaxed text-text-muted">{tool.review}</p>
                    </div>
                  ))}
                </div>
              </details>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 md:hidden">
              {category.tools.map((tool: any) => (
                <details key={tool.name} className="group rounded-xl border border-border bg-white">
                  <summary className="flex cursor-pointer items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-navy">{tool.name}</span>
                      {tool.recommended && (
                        <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Pick</span>
                      )}
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${pricingColors[tool.pricing] || "bg-blue-bg text-blue"}`}>
                        {tool.pricing}
                      </span>
                    </div>
                    <svg className="h-5 w-5 shrink-0 text-text-muted transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="border-t border-border px-4 pb-4 pt-3">
                    <p className="text-[0.9375rem] text-text-muted">{tool.description}</p>
                    {tool.review && (
                      <p className="mt-3 border-l-2 border-blue pl-3 text-sm italic text-text-muted">
                        {tool.review}
                      </p>
                    )}
                    {tool.url && (
                      <a
                        href={tool.affiliateUrl && tool.affiliateUrl !== "PLACEHOLDER" ? tool.affiliateUrl : tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue hover:text-blue-dark"
                      >
                        Visit {tool.name} &rarr;
                      </a>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-border py-8">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-muted">Affiliate Disclosure</h3>
          <p className="text-sm leading-relaxed text-text-muted">
            Some links on this page are affiliate links. If you sign up through these links, ClearCareer may earn a small commission at no extra cost to you. This helps support the free content and resources we create. We only recommend tools we&apos;ve personally tested and used with clients.
          </p>
        </div>
      </section>

      <CTASection
        heading="Want Expert Guidance on Your Job Search?"
        primaryCTA={{ text: "Book a Free Audit", href: "https://calendly.com/clearcareer/discovery-call" }}
        variant="blue"
      />
    </>
  );
}
