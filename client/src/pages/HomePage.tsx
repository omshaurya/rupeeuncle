import { Link } from "react-router-dom";
import { ArrowRight, Calculator, FileCheck, ShieldCheck, Sparkles } from "lucide-react";
import { sampleCalculatorConfigs } from "../data/calculatorConfigs/sampleConfigs";
import { sampleBlogPosts } from "../data/blogPosts/samplePosts";
import { CATEGORY_META } from "../data/categoryMeta";
import IntelligentSearchBar from "../components/search/IntelligentSearchBar";
import CategorySection from "../components/home/CategorySection";
import BlogCard from "../components/blog/BlogCard";
import { useSeo } from "../hooks/useSeo";

const CATEGORY_NAME_BY_SLUG: Record<string, string> = {
  investment: "Investment",
  loans: "Loans",
  banking: "Banking",
  tax: "Tax",
  "personal-finance": "Personal Finance",
  insurance: "Insurance",
  business: "Business",
};

const TRUST_STATS = [
  { icon: Calculator, label: "56 Free Calculators", sub: "Investment, loans, tax & more" },
  { icon: ShieldCheck, label: "100% Free, No Signup", sub: "No login required, ever" },
  { icon: FileCheck, label: "India-Specific Rules", sub: "FY 2025-26 tax & RBI compliant" },
  { icon: Sparkles, label: "Instant Results", sub: "Live charts as you type" },
];

export default function HomePage() {
  useSeo({
    title: "Free Financial Calculators & Investment Tools for India",
    description:
      "Calculate SIP returns, EMI, FD maturity, income tax, and more with India's largest collection of free financial calculators.",
    canonicalPath: "/",
  });

  const allCalculators = Object.values(sampleCalculatorConfigs);

  const calculatorsByCategory = CATEGORY_META.map((meta) => ({
    ...meta,
    name: CATEGORY_NAME_BY_SLUG[meta.slug] ?? meta.slug,
    calculators: allCalculators.filter((c) => c.category?.slug === meta.slug),
  })).filter((c) => c.calculators.length > 0);

  return (
    <div className="overflow-hidden">
      {/* Hero — premium gradient mesh background, glass search bar */}
      <section className="relative bg-hero-gradient px-4 py-20 text-white sm:py-28 dark:bg-hero-gradient-dark">
        <div className="absolute inset-0 bg-mesh-gold opacity-60" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-medium text-gold-300">
            <Sparkles size={13} />
            India's friendliest financial calculators
          </span>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-6xl">
            Plan your money with{" "}
            <span className="text-gold-400">clarity, not guesswork</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-ink-200">
            56 free financial calculators, investment tools, and personal finance
            resources — built for India, accurate, and instant. No signup required.
          </p>

          <div className="mx-auto mt-9 max-w-2xl">
            <IntelligentSearchBar placeholder="Search SIP, EMI, FD, Income Tax, Capital Gains..." />
          </div>

          <div className="mx-auto mt-6 flex flex-wrap justify-center gap-2 text-sm text-ink-300">
            {[
              { label: "SIP Calculator", slug: "sip-calculator" },
              { label: "EMI Calculator", slug: "emi-calculator" },
              { label: "Income Tax", slug: "income-tax-calculator-new-regime" },
              { label: "PPF Calculator", slug: "ppf-calculator" },
            ].map(({ label, slug }) => (
              <Link
                key={slug}
                to={`/calculators/${slug}`}
                className="rounded-full border border-white/15 px-3 py-1 transition-colors hover:border-gold-400/50 hover:text-gold-300"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust stats strip */}
      <section className="border-b border-ink-100 bg-white px-4 py-6 dark:border-surface-500/40 dark:bg-surface-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-4">
          {TRUST_STATS.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-50 text-gold-600 dark:bg-surface-700 dark:text-gold-400">
                <Icon size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">{label}</p>
                <p className="text-xs text-ink-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category sections */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">
            Calculators for every financial decision
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-500 dark:text-ink-400">
            Organized by what you're trying to figure out — pick a category or search
            above for something specific.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {calculatorsByCategory.map((cat) => (
            <CategorySection
              key={cat.slug}
              categoryName={cat.name}
              categorySlug={cat.slug}
              icon={cat.icon}
              blurb={cat.blurb}
              calculators={cat.calculators}
            />
          ))}
        </div>
      </section>

      {/* Blog section */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
            From the Blog
          </h2>
          <Link
            to="/blog"
            className="flex items-center gap-1 text-sm font-medium text-gold-600 hover:text-gold-700 dark:text-gold-400"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sampleBlogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
