export interface CategoryMeta {
  slug: string;
  icon: string;
  blurb: string;
}

/**
 * Single source of truth for calculator category display metadata (icon + blurb +
 * order). Used by both the homepage category grid and CalculatorsListPage — previously
 * this lived duplicated inside CalculatorsListPage.tsx only, which meant the homepage
 * had no way to show the same icons/blurbs without copy-pasting and risking drift.
 *
 * Category NAMES and calculator COUNTS are deliberately not stored here — those are
 * derived live from sampleConfigs.ts by whichever page needs them, so this file can
 * never silently go out of sync with the actual calculator data.
 */
export const CATEGORY_META: CategoryMeta[] = [
  { slug: "investment", icon: "trending-up", blurb: "Grow your wealth — SIP, lumpsum, goal planning, and more." },
  { slug: "loans", icon: "home", blurb: "EMI, eligibility, and prepayment planning for every loan type." },
  { slug: "banking", icon: "piggy-bank", blurb: "FD, RD, PPF, EPF, NPS, and other government-backed savings." },
  { slug: "tax", icon: "receipt", blurb: "Income tax, GST, capital gains, and every other tax calculation." },
  { slug: "personal-finance", icon: "target", blurb: "Budgeting, emergency funds, net worth, and debt payoff." },
  { slug: "insurance", icon: "shield-check", blurb: "Coverage planning for life and health insurance." },
  { slug: "business", icon: "briefcase", blurb: "Break-even, ROI, margins, and valuation for business owners." },
];
