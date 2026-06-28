import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Calculator, Menu, Search } from "lucide-react";
import CalculatorsDropdown from "./CalculatorsDropdown";
import MobileMenu from "./MobileMenu";

const CATEGORY_LINKS = [
  { label: "Investment", to: "/calculators?category=investment" },
  { label: "Loans", to: "/calculators?category=loans" },
  { label: "Banking", to: "/calculators?category=banking" },
  { label: "Tax", to: "/calculators?category=tax" },
  { label: "Insurance", to: "/calculators?category=insurance" },
  { label: "Personal Finance", to: "/calculators?category=personal-finance" },
];

/**
 * Only routes that actually exist in App.tsx are linked here. Tools/Market/Dictionary
 * will be added once those pages are built — shipping a nav link to a 404 is worse than
 * not showing the link at all.
 */
const PRIMARY_LINKS = [
  { label: "All Calculators", to: "/calculators" },
  { label: "Blog", to: "/blog" },
];

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = stored === "dark" || (!stored && prefersDark);
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 print:hidden ${
          isScrolled
            ? "glass border-b border-transparent"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-gradient text-ink-950">
              <Calculator size={18} />
            </span>
            <span className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
              Rupee<span className="text-gold-500">Uncle</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <CalculatorsDropdown />
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-ink-600 transition-colors hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Search calculators"
              className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-surface-700 md:hidden"
            >
              <Search size={18} />
            </button>
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-surface-700"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-surface-700 md:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categoryLinks={CATEGORY_LINKS}
        primaryLinks={PRIMARY_LINKS}
      />
    </>
  );
}
