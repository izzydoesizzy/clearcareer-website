import Link from "next/link";

interface PricingCardProps {
  tier: string;
  price: string;
  originalPrice?: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  featured?: boolean;
  paymentPlan?: string;
}

export default function PricingCard({
  tier,
  price,
  originalPrice,
  features,
  ctaText,
  ctaHref,
  featured = false,
  paymentPlan,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-xl border p-8 transition-shadow duration-300 hover:shadow-[0_8px_40px_-4px_rgba(1,97,239,0.18)] ${
        featured
          ? "border-blue bg-white shadow-[0_4px_24px_-4px_rgba(1,97,239,0.15)] ring-2 ring-blue"
          : "border-border bg-white shadow-[0_4px_24px_-4px_rgba(1,97,239,0.10)]"
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-blue px-4 py-1 text-xs font-semibold text-white">
            Most Popular
          </span>
        </div>
      )}

      <h3 className="text-lg font-semibold text-text">{tier}</h3>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-[clamp(2rem,4vw,2.75rem)] font-bold leading-none text-navy">
          {price}
        </span>
        {originalPrice && (
          <span className="text-lg text-text-muted line-through">{originalPrice}</span>
        )}
      </div>

      {paymentPlan && (
        <p className="mt-1 text-sm text-text-muted">{paymentPlan}</p>
      )}

      <ul className="mt-8 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-text">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Link
          href={ctaHref}
          className={`block w-full rounded-lg px-6 py-3 text-center text-base font-semibold transition-colors ${
            featured
              ? "bg-blue text-white hover:bg-blue-dark"
              : "border-2 border-blue bg-white text-blue hover:bg-blue-bg"
          }`}
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
}
