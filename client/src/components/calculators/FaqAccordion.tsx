import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "../../types/calculator";

interface Props {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  // FAQ schema markup for Google rich snippets, as required by the spec.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="card-surface p-6">
      <h2 className="mb-4 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-ink-100 dark:divide-ink-800">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-medium text-ink-800 dark:text-ink-100">
                  {faq.question}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-ink-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <p className="pb-4 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </div>
  );
}
