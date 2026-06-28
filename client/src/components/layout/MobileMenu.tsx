import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useEffect } from "react";
import IntelligentSearchBar from "../search/IntelligentSearchBar";

interface NavLink {
  label: string;
  to: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categoryLinks: NavLink[];
  primaryLinks: NavLink[];
}

export default function MobileMenu({ isOpen, onClose, categoryLinks, primaryLinks }: Props) {
  // Lock body scroll while the drawer is open, restore on close/unmount
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in"
      />
      <nav className="glass-strong absolute right-0 top-0 h-full w-[85%] max-w-sm animate-slide-up overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            Menu
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-surface-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-5">
          <IntelligentSearchBar size="md" placeholder="Search calculators, articles..." />
        </div>

        <div className="space-y-1">
          {primaryLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="block rounded-lg px-3 py-2.5 text-base font-medium text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-surface-700"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
          Calculator Categories
        </p>
        <div className="space-y-1">
          {categoryLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="block rounded-lg px-3 py-2.5 text-sm text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-surface-700"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
