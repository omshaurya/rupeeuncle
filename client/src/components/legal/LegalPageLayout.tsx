import { ReactNode } from "react";
import { useSeo } from "../../hooks/useSeo";

interface Props {
  title: string;
  description: string;
  canonicalPath: string;
  lastUpdated: string;
  children: ReactNode;
}

/**
 * Shared layout for legal/policy pages (Privacy, Terms, Disclaimer, Cookie Policy,
 * Affiliate Disclosure, DMCA). These pages share identical structure — title, last-
 * updated date, prose content — so this is the one place that defines it, rather than
 * duplicating the same header/SEO/typography wiring six times.
 */
export default function LegalPageLayout({ title, description, canonicalPath, lastUpdated, children }: Props) {
  useSeo({ title, description, canonicalPath });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">
        {title}
      </h1>
      <p className="mt-2 text-sm text-ink-400">Last updated: {lastUpdated}</p>

      <div className="prose-article mt-8 text-ink-700 dark:text-ink-200">{children}</div>
    </div>
  );
}
