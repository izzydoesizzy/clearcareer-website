import { generatePageMetadata } from "@components/SEOHead";
import Hero from "@components/Hero";
import PricingCard from "@components/PricingCard";
import CTASection from "@components/CTASection";

export const metadata = generatePageMetadata({
  title: "ClearCareer Community | Weekly Coaching & Support",
  description:
    "Join the ClearCareer Community. Weekly group coaching calls, job search templates, tools, and a supportive network of professionals. $49/month or $249 lifetime.",
  url: "/programs/community",
  noindex: true,
});

const includedItems = [
  {
    emoji: "📞",
    title: "Weekly Group Coaching Calls",
    description:
      "Live calls with Izzy every week. Bring your questions, get real answers, and stay accountable.",
  },
  {
    emoji: "📄",
    title: "Job Search Templates",
    description:
      "Resume templates, outreach scripts, follow-up emails, and negotiation frameworks ready to use.",
  },
  {
    emoji: "👥",
    title: "Private Community",
    description:
      "Connect with professionals navigating the same challenges. Share wins, get feedback, stay motivated.",
  },
  {
    emoji: "🎓",
    title: "Monthly Workshops",
    description:
      "Deep-dive sessions on topics like LinkedIn optimization, interview prep, and salary negotiation.",
  },
  {
    emoji: "📚",
    title: "Resource Library",
    description:
      "Access to guides, tools, and frameworks from the ClearCareer toolkit.",
  },
  {
    emoji: "🤖",
    title: "AI Prompt Library",
    description:
      "30+ tested prompts for resume writing, company research, interview prep, and more.",
  },
];

export default function CommunityPage() {
  return (
    <>
      {/* Hero */}
      <Hero
        variant="page"
        eyebrow="ClearCareer Community"
        headline="Your Job Search Doesn't Have to Be a Solo Mission"
        subheadline="Weekly coaching calls, proven templates, and a community of professionals who get it. For $49/month or $249 lifetime."
        primaryCTA={{ text: "Join the Community", href: "#pricing" }}
        secondaryCTA={{
          text: "Book a Free Call",
          href: "https://calendly.com/clearcareer/discovery-call",
        }}
      />

      {/* What's Included */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">
              Membership
            </p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              What&apos;s Included
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {includedItems.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-white p-6"
              >
                <div className="mb-4 text-3xl">{item.emoji}</div>
                <h3 className="text-lg font-semibold text-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-[1.0625rem] leading-[1.75] text-text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">
              Pricing
            </p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              Choose Your Plan
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-[720px] grid-cols-1 gap-8 md:grid-cols-2">
            <PricingCard
              tier="Monthly"
              price="$49/mo"
              features={[
                "Weekly group coaching calls",
                "Job search templates & tools",
                "Private community access",
                "Monthly workshops",
                "Resource library",
                "AI prompt library",
              ]}
              ctaText="Start Monthly"
              ctaHref="#"
              featured={false}
            />
            <PricingCard
              tier="Lifetime Access"
              price="$249"
              originalPrice="$588"
              features={[
                "Everything in Monthly",
                "One-time payment, access forever",
                "All future templates & tools",
                "Priority access to new features",
                "Save 58% vs monthly",
              ]}
              ctaText="Get Lifetime Access"
              ctaHref="#"
              featured={true}
              paymentPlan="One-time payment"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        heading="Not Sure Which Program Is Right?"
        body="Book a free 20-minute call. Izzy will help you figure out the best path forward."
        primaryCTA={{
          text: "Book a Free Call",
          href: "https://calendly.com/clearcareer/discovery-call",
        }}
        variant="blue"
      />
    </>
  );
}
