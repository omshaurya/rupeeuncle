import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { sampleCalculatorConfigs } from "../data/calculatorConfigs/sampleConfigs";
import { sampleBlogPosts } from "../data/blogPosts/samplePosts";
import { useSeo } from "../hooks/useSeo";
import CalculatorRunner from "../components/calculators/CalculatorRunner";
import FaqAccordion from "../components/calculators/FaqAccordion";
import RelatedCalculators from "../components/blog/RelatedCalculators";
import RelatedPosts from "../components/blog/RelatedPosts";

export default function CalculatorPage() {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? (sampleCalculatorConfigs[slug] ?? null) : null;

  useSeo({
    title: config?.name ?? "Calculator",
    description: config?.shortDescription ?? "Free financial calculator",
    canonicalPath: `/calculators/${slug}`,
  });

  // Related calculators: same category, excluding this one — capped at 3
  const relatedCalculators = useMemo(() => {
    if (!config?.category) return [];
    return Object.values(sampleCalculatorConfigs)
      .filter((c) => c.slug !== config.slug && c.category?.slug === config.category?.slug)
      .slice(0, 3)
      .map((c) => ({ slug: c.slug, name: c.name, shortDescription: c.shortDescription, icon: c.icon }));
  }, [config]);

  // Related blog posts: match if any of the post's tags appears in the calculator's name
  // or category — an honest heuristic rather than pretending the two taxonomies align,
  // since blog categories ("Mutual Funds", "Taxation") and calculator categories
  // ("Investment", "Tax") don't share slugs.
  const relatedPosts = useMemo(() => {
    if (!config) return [];
    const haystack = `${config.name} ${config.category?.name ?? ""}`.toLowerCase();
    return sampleBlogPosts.filter((post) =>
      post.tags.some((tag) => haystack.includes(tag.toLowerCase()))
    ).slice(0, 3);
  }, [config]);

  if (!config) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
          Calculator not found
        </h1>
        <p className="mt-2 text-ink-500">
          We couldn't find a calculator at this address.
        </p>
        <Link to="/calculators" className="btn-primary mt-6 inline-flex">
          Browse all calculators
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-400 print:hidden" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink-600 dark:hover:text-ink-200">Home</Link>
        <ChevronRight size={14} />
        <Link to="/calculators" className="hover:text-ink-600 dark:hover:text-ink-200">Calculators</Link>
        {config.category && (
          <>
            <ChevronRight size={14} />
            <Link
              to={`/calculators?category=${config.category.slug}`}
              className="hover:text-ink-600 dark:hover:text-ink-200"
            >
              {config.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-ink-600 dark:text-ink-300">{config.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
          {config.name}
        </h1>
        <p className="mt-2 max-w-2xl text-ink-500 dark:text-ink-400">
          {config.shortDescription}
        </p>
      </header>

      <CalculatorRunner config={config} />

      {config.longDescription && (
        <section className="mt-10 card-surface p-6">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            About this Calculator
          </h2>
          <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            {config.longDescription}
          </p>
        </section>
      )}

      {config.faqs && config.faqs.length > 0 && (
        <section className="mt-8">
          <FaqAccordion faqs={config.faqs} />
        </section>
      )}

      {relatedCalculators.length > 0 && (
        <section className="mt-10">
          <RelatedCalculators calculators={relatedCalculators} />
        </section>
      )}

      {relatedPosts.length > 0 && (
        <section className="mt-10">
          <RelatedPosts posts={relatedPosts} />
        </section>
      )}
    </div>
  );
}
