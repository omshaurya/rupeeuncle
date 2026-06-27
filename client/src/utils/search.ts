import { sampleCalculatorConfigs } from "../data/calculatorConfigs/sampleConfigs";
import { sampleBlogPosts } from "../data/blogPosts/samplePosts";

export interface SearchResult {
  type: "calculator" | "blog";
  title: string;
  description: string;
  href: string;
  categoryName?: string;
  icon?: string;
}

/**
 * Searches across calculators and blog posts. Dictionary and Tools are deliberately NOT
 * included yet — those pages don't exist in the app's routes, and a search result that
 * links to a 404 is worse than a search that's honestly narrower than the eventual goal.
 * Add them here once their pages + data are real (see PROJECT_STRUCTURE.md roadmap).
 *
 * Ranking: exact name/title match first, then "starts with", then "contains" — simple
 * and predictable rather than a fuzzy-match library, since the corpus here (56
 * calculators + a handful of posts) is small enough that naive substring ranking already
 * produces good results without pulling in a dependency.
 */
export function searchSite(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: { result: SearchResult; rank: number }[] = [];

  for (const calc of Object.values(sampleCalculatorConfigs)) {
    const nameLower = calc.name.toLowerCase();
    const haystack = `${nameLower} ${calc.shortDescription.toLowerCase()} ${calc.category?.name.toLowerCase() ?? ""}`;
    if (!haystack.includes(q)) continue;

    const rank = nameLower === q ? 0 : nameLower.startsWith(q) ? 1 : 2;
    results.push({
      rank,
      result: {
        type: "calculator",
        title: calc.name,
        description: calc.shortDescription,
        href: `/calculators/${calc.slug}`,
        categoryName: calc.category?.name,
        icon: calc.icon,
      },
    });
  }

  for (const post of sampleBlogPosts) {
    const titleLower = post.title.toLowerCase();
    const haystack = `${titleLower} ${post.excerpt.toLowerCase()} ${post.tags.join(" ").toLowerCase()}`;
    if (!haystack.includes(q)) continue;

    const rank = titleLower === q ? 0 : titleLower.startsWith(q) ? 1 : 3; // blog ranks slightly below a "contains" calculator match
    results.push({
      rank,
      result: {
        type: "blog",
        title: post.title,
        description: post.excerpt,
        href: `/blog/${post.slug}`,
        categoryName: post.category.name,
      },
    });
  }

  return results
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map((r) => r.result);
}
