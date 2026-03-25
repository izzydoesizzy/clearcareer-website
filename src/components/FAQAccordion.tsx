interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details
          key={i}
          className="group rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-base font-semibold text-navy [&::-webkit-details-marker]:hidden">
            {item.question}
            <svg
              className="h-5 w-5 shrink-0 text-text-muted transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="px-6 pb-5 text-sm leading-relaxed text-text-muted">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
