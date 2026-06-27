import { Calculator, ShieldCheck, Heart, Code2 } from "lucide-react";
import { useSeo } from "../hooks/useSeo";

const VALUES = [
  {
    icon: Calculator,
    title: "Accuracy first",
    body: "Every calculator on this site is built around a verified formula, checked against published reference examples — not approximated or guessed.",
  },
  {
    icon: ShieldCheck,
    title: "India-specific, always current",
    body: "Tax slabs, RBI rules, GST rates, and every other regulatory figure reflect current Indian rules, not generic or outdated templates.",
  },
  {
    icon: Heart,
    title: "Free, no signup",
    body: "Every calculator is free to use, with no account, login, or paywall — ever.",
  },
  {
    icon: Code2,
    title: "Honest about limits",
    body: "Where no public formula exists (like insurance premiums or business valuation), we say so plainly instead of faking precision.",
  },
];

export default function AboutUsPage() {
  useSeo({
    title: "About Us",
    description: "RupeeUncle is a free, India-specific financial calculator platform built for accuracy and clarity.",
    canonicalPath: "/about-us",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
        About RupeeUncle
      </h1>
      <p className="mt-4 text-lg text-ink-600 dark:text-ink-300">
        RupeeUncle is a free collection of financial calculators and tools, built
        specifically for the Indian market — SIP, EMI, income tax, insurance coverage, and
        56 other calculators covering investment, loans, banking, tax, personal finance,
        insurance, and business planning.
      </p>

      <div className="prose-article mt-8 text-ink-700 dark:text-ink-200">
        <h2 id="why-we-built-this">Why We Built This</h2>
        <p>
          Most financial calculators available online fall into one of two problems: they're
          generic templates not adapted for Indian tax rules and instruments (PPF, NPS,
          Sukanya Samriddhi, HRA exemption), or they're accurate but locked behind signups,
          ads-before-results, or paywalls. We wanted something different — calculators that
          are specific to how money actually works in India, free to use instantly, with no
          account required.
        </p>

        <h2 id="how-we-verify">How We Verify Every Calculator</h2>
        <p>
          Before any calculator ships, its underlying formula is checked against published
          worked examples from credible sources — RBI documentation, fund house
          illustrations, tax department rules, or multiple independent financial calculator
          sites cross-checked against each other. Where a calculator's output can't be
          independently verified (insurance premiums, business valuation — these genuinely
          have no single public formula), we say so directly on that calculator's page
          rather than presenting a guess as fact.
        </p>

        <h2 id="not-financial-advice">What This Site Is Not</h2>
        <p>
          RupeeUncle is an information and calculation tool, not a financial advisory
          service. We are not SEBI-registered investment advisors, and nothing here should
          be taken as personalized financial, tax, or legal advice. See our{" "}
          <a href="/disclaimer">Disclaimer</a> for more detail.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {VALUES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="card-surface p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-gradient text-ink-950">
              <Icon size={18} />
            </span>
            <h3 className="mt-3 font-display text-base font-semibold text-ink-900 dark:text-ink-50">
              {title}
            </h3>
            <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
