import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { resolveIcon } from "../../utils/iconResolver";
import type { CalculatorConfig } from "../../types/calculator";

interface Props {
  categoryName: string;
  categorySlug: string;
  icon: string;
  blurb: string;
  calculators: CalculatorConfig[];
}

/**
 * One premium category card for the homepage's category grid. Shows the category icon,
 * a live calculator count (computed by the caller from real config data, never
 * hardcoded), a short blurb, and up to 4 "quick access" calculator chips that jump
 * straight to that calculator — exactly the "category icon / count / quick access
 * buttons" structure the brief asks for.
 */
export default function CategorySection({ categoryName, categorySlug, icon, blurb, calculators }: Props) {
  const Icon = resolveIcon(icon);
  const quickAccess = calculators.slice(0, 4);

  return (
    <div className="category-card group animate-slide-up">
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl2 bg-gold-gradient text-ink-950 shadow-card transition-transform duration-300 group-hover:scale-110">
            <Icon size={24} />
          </span>
          <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-600 dark:bg-surface-700 dark:text-ink-300">
            {calculators.length} tools
          </span>
        </div>

        <h3 className="mt-4 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
          {categoryName}
        </h3>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{blurb}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {quickAccess.map((calc) => (
            <Link
              key={calc.slug}
              to={`/calculators/${calc.slug}`}
              className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:border-gold-400 hover:bg-gold-50 hover:text-gold-700 dark:border-surface-500 dark:text-ink-300 dark:hover:border-gold-400 dark:hover:bg-surface-700 dark:hover:text-gold-300"
            >
              {calc.name.replace(" Calculator", "")}
            </Link>
          ))}
        </div>

        <Link
          to={`/calculators?category=${categorySlug}`}
          className="mt-5 flex items-center gap-1 text-sm font-semibold text-gold-600 dark:text-gold-400"
        >
          View all {categoryName.toLowerCase()} calculators
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
