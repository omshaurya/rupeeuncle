import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { resolveIcon } from "../../utils/iconResolver";

interface Props {
  slug: string;
  name: string;
  shortDescription: string;
  icon?: string;
  categoryName?: string;
}

export default function CalculatorCard({ slug, name, shortDescription, icon, categoryName }: Props) {
  const Icon = resolveIcon(icon);

  return (
    <Link
      to={`/calculators/${slug}`}
      className="card-surface-hover group flex flex-col justify-between p-5"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-gradient text-ink-950 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Icon size={19} />
          </span>
          {categoryName && (
            <span className="rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-medium text-ink-500 dark:bg-surface-700 dark:text-ink-300">
              {categoryName}
            </span>
          )}
        </div>
        <h3 className="mt-3.5 font-display text-base font-semibold text-ink-900 dark:text-ink-50">
          {name}
        </h3>
        <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">{shortDescription}</p>
      </div>
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gold-600 dark:text-gold-400">
        Calculate now
        <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
