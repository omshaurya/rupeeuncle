import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, ArrowRight } from "lucide-react";
import { searchSite, type SearchResult } from "../../utils/search";
import { resolveIcon } from "../../utils/iconResolver";

interface Props {
  size?: "lg" | "md";
  placeholder?: string;
  autoFocus?: boolean;
}

export default function IntelligentSearchBar({
  size = "lg",
  placeholder = "Search calculators, articles...",
  autoFocus = false,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounced search — avoids re-running the search on every single keystroke for a
  // snappier feel without actually doing less work than instant filtering would.
  useEffect(() => {
    const handle = setTimeout(() => {
      const r = searchSite(query);
      setResults(r);
      setIsOpen(query.trim().length > 0);
      setActiveIndex(-1);
    }, 120);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goTo(href: string) {
    setIsOpen(false);
    setQuery("");
    navigate(href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      goTo(results[activeIndex].href);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  const isLarge = size === "lg";

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`glass-strong flex items-center gap-3 rounded-xl2 transition-shadow focus-within:shadow-glow-gold ${
          isLarge ? "px-5 py-4" : "px-4 py-2.5"
        }`}
      >
        <Search size={isLarge ? 20 : 17} className="shrink-0 text-ink-400 dark:text-ink-300" />
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-transparent text-ink-900 outline-none placeholder:text-ink-400 dark:text-ink-50 dark:placeholder:text-ink-400 ${
            isLarge ? "text-base" : "text-sm"
          }`}
          aria-label="Search calculators and articles"
          aria-expanded={isOpen}
          role="combobox"
        />
        {isLarge && (
          <kbd className="hidden rounded-md border border-ink-200 px-2 py-1 text-[11px] font-medium text-ink-400 dark:border-surface-500 dark:text-ink-400 sm:block">
            /
          </kbd>
        )}
      </div>

      {isOpen && (
        <div className="glass-strong absolute left-0 top-full z-50 mt-2 w-full animate-scale-in overflow-hidden rounded-xl2 p-2">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-ink-400">
              No results for "{query}" — try a different term.
            </p>
          ) : (
            <ul className="max-h-[60vh] space-y-0.5 overflow-y-auto">
              {results.map((r, i) => {
                const Icon = r.type === "calculator" ? resolveIcon(r.icon) : FileText;
                return (
                  <li key={`${r.type}-${r.href}`}>
                    <button
                      onClick={() => goTo(r.href)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        activeIndex === i
                          ? "bg-gold-100/70 dark:bg-surface-700"
                          : "hover:bg-white/50 dark:hover:bg-surface-700/60"
                      }`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gold-gradient text-ink-950">
                        <Icon size={14} />
                      </span>
                      <span className="flex-1 overflow-hidden">
                        <span className="block truncate text-sm font-medium text-ink-900 dark:text-ink-50">
                          {r.title}
                        </span>
                        <span className="block truncate text-xs text-ink-400">
                          {r.type === "calculator" ? "Calculator" : "Article"}
                          {r.categoryName ? ` · ${r.categoryName}` : ""}
                        </span>
                      </span>
                      <ArrowRight size={14} className="shrink-0 text-ink-300" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
