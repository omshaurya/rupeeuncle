import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { sampleCalculatorConfigs } from "../data/calculatorConfigs/sampleConfigs";
import { CATEGORY_META } from "../data/categoryMeta";
import CalculatorCard from "../components/calculators/CalculatorCard";
import { resolveIcon } from "../utils/iconResolver";
import { useSeo } from "../hooks/useSeo";

const CATEGORY_ORDER = CATEGORY_META.map((c) => c.slug);
const CATEGORY_META_BY_SLUG = Object.fromEntries(CATEGORY_META.map((c) => [c.slug, c]));

export default function CalculatorsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  useSeo({
    title: "All Financial Calculators",
    description: "Browse all free financial calculators for investment, loans, banking, tax, insurance, and business planning.",
    canonicalPath: "/calculators",
  });

  const allCalculators = useMemo(() => Object.values(sampleCalculatorConfigs), []);

  const byCategory = useMemo(() => {
    const groups: Record<string, typeof allCalculators> = {};
    for (const calc of allCalculators) {
      const slug = calc.category?.slug ?? "other";
      if (!groups[slug]) groups[slug] = [];
      groups[slug].push(calc);
    }
    return groups;
  }, [allCalculators]);

  const categorySlugsToShow = activeCategory ? [activeCategory] : CATEGORY_ORDER;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
          All Calculators
        </h1>
        <p className="mt-2 text-ink-500 dark:text-ink-400">
          {allCalculators.length} free calculators across Investment, Loans, Banking, Tax,
          Insurance, and Business — accurate, India-specific, and updated regularly.
        </p>
      </div>

      {/* Category filter chips */}
      <div className="mb-10 flex flex-wrap gap-2">
        <button
          onClick={() => setSearchParams({})}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !activeCategory
              ? "bg-ink-900 text-white dark:bg-gold-400 dark:text-ink-950"
              : "bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-surface-700 dark:text-ink-300 dark:hover:bg-surface-600"
          }`}
        >
          All ({allCalculators.length})
        </button>
        {CATEGORY_ORDER.map((slug) => {
          const calcs = byCategory[slug] ?? [];
          if (calcs.length === 0) return null;
          const name = calcs[0].category?.name ?? slug;
          return (
            <button
              key={slug}
              onClick={() => setSearchParams({ category: slug })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === slug
                  ? "bg-ink-900 text-white dark:bg-gold-400 dark:text-ink-950"
                  : "bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-surface-700 dark:text-ink-300 dark:hover:bg-surface-600"
              }`}
            >
              {name} ({calcs.length})
            </button>
          );
        })}
      </div>

      {/* Category sections */}
      <div className="space-y-14">
        {categorySlugsToShow.map((slug) => {
          const calcs = byCategory[slug];
          if (!calcs || calcs.length === 0) return null;
          const meta = CATEGORY_META_BY_SLUG[slug];
          const CategoryIcon = resolveIcon(meta?.icon);
          const categoryName = calcs[0].category?.name ?? slug;

          return (
            <section key={slug} id={slug} className="animate-fade-in">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl2 bg-gold-gradient text-ink-950 shadow-card">
                  <CategoryIcon size={22} />
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
                    {categoryName} Calculators
                  </h2>
                  {meta?.blurb && (
                    <p className="text-sm text-ink-500 dark:text-ink-400">{meta.blurb}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {calcs.map((calc) => (
                  <CalculatorCard
                    key={calc.slug}
                    slug={calc.slug}
                    name={calc.name}
                    shortDescription={calc.shortDescription}
                    icon={calc.icon}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {categorySlugsToShow.every((slug) => !byCategory[slug] || byCategory[slug].length === 0) && (
        <p className="mt-12 text-center text-ink-500 dark:text-ink-400">
          No calculators found in this category.{" "}
          <Link to="/calculators" className="font-medium text-gold-600 dark:text-gold-400">
            View all calculators
          </Link>
        </p>
      )}
    </div>
  );
}
