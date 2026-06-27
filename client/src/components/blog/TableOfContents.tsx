import type { TocItem } from "../../types/blog";

interface Props {
  items: TocItem[];
}

export default function TableOfContents({ items }: Props) {
  if (items.length === 0) return null;

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="card-surface sticky top-20 hidden max-h-[calc(100vh-6rem)] overflow-y-auto p-5 lg:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
        On this page
      </p>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
            <button
              onClick={() => scrollToSection(item.id)}
              className="text-left text-ink-500 hover:text-gold-600 dark:text-ink-400 dark:hover:text-gold-400"
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
