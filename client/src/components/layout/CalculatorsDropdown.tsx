import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { resolveIcon } from "../../utils/iconResolver";

const CATEGORIES = [
  { name: "Investment", slug: "investment", icon: "trending-up" },
  { name: "Loans", slug: "loans", icon: "home" },
  { name: "Banking", slug: "banking", icon: "piggy-bank" },
  { name: "Tax", slug: "tax", icon: "receipt" },
  { name: "Insurance", slug: "insurance", icon: "shield-check" },
  { name: "Personal Finance", slug: "personal-finance", icon: "target" },
];

export default function CalculatorsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
        aria-expanded={isOpen}
      >
        Calculators
        <ChevronDown size={15} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="glass-strong absolute left-1/2 top-full z-50 mt-3 w-[320px] -translate-x-1/2 animate-scale-in rounded-xl2 p-3">
          <div className="grid grid-cols-2 gap-1">
            {CATEGORIES.map((cat) => {
              const Icon = resolveIcon(cat.icon);
              return (
                <Link
                  key={cat.slug}
                  to={`/calculators?category=${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink-600 transition-colors hover:bg-white/60 dark:text-ink-200 dark:hover:bg-surface-700/60"
                >
                  <Icon size={16} className="text-gold-600 dark:text-gold-400" />
                  {cat.name}
                </Link>
              );
            })}
          </div>
          <Link
            to="/calculators"
            onClick={() => setIsOpen(false)}
            className="mt-2 block rounded-lg border-t border-ink-100 px-3 pt-3 text-center text-sm font-medium text-gold-600 dark:border-surface-500/50 dark:text-gold-400"
          >
            View all 56 calculators →
          </Link>
        </div>
      )}
    </div>
  );
}
