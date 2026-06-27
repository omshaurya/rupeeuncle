import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Clock } from "lucide-react";
import apiClient from "../utils/apiClient";
import { sampleBlogPostsBySlug } from "../data/blogPosts/samplePosts";
import type { BlogPost } from "../types/blog";
import { useSeo } from "../hooks/useSeo";
import TableOfContents from "../components/blog/TableOfContents";
import ArticleBody from "../components/blog/ArticleBody";
import AuthorBox from "../components/blog/AuthorBox";
import FaqAccordion from "../components/calculators/FaqAccordion";
import RelatedCalculators from "../components/blog/RelatedCalculators";
import RelatedPosts from "../components/blog/RelatedPosts";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);

    apiClient
      .get(`/blogs/${slug}`)
      .then((res) => {
        if (!cancelled) {
          setPost(res.data.data);
          setUsingFallback(false);
        }
      })
      .catch(() => {
        if (!cancelled && sampleBlogPostsBySlug[slug]) {
          setPost(sampleBlogPostsBySlug[slug]);
          setUsingFallback(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useSeo({
    title: post?.title ?? "Article",
    description: post?.excerpt ?? "",
    canonicalPath: `/blog/${slug}`,
  });

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-gold-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
          Article not found
        </h1>
        <Link to="/blog" className="btn-primary mt-6 inline-flex">
          Browse all articles
        </Link>
      </div>
    );
  }

  // Article schema markup for Google rich results, per spec requirement
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage.url,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: post.author.name },
    publisher: { "@type": "Organization", name: "RupeeUncle" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
      { "@type": "ListItem", position: 3, name: post.title },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      {usingFallback && (
        <div className="mb-4 rounded-lg border border-gold-300 bg-gold-50 px-4 py-2 text-xs text-gold-800 print:hidden">
          Showing local sample data — backend API not reachable.
        </div>
      )}

      <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-400">
        <Link to="/" className="hover:text-ink-600">Home</Link>
        <ChevronRight size={14} />
        <Link to="/blog" className="hover:text-ink-600">Blog</Link>
        <ChevronRight size={14} />
        <Link to={`/blog?category=${post.category.slug}`} className="hover:text-ink-600">
          {post.category.name}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
        <article>
          <header className="mb-6">
            <span className="text-xs font-medium uppercase tracking-wide text-gold-600 dark:text-gold-400">
              {post.category.name}
            </span>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-3 flex items-center gap-4 text-sm text-ink-400">
              <span>{post.author.name}</span>
              <span>·</span>
              <span>{new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={13} /> {post.readingTimeMinutes} min read</span>
            </div>
          </header>

          <img
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            className="mb-8 aspect-[16/9] w-full rounded-xl2 object-cover"
          />

          <ArticleBody html={post.content} />

          <div className="mt-10 space-y-10">
            {post.relatedCalculators.length > 0 && (
              <RelatedCalculators calculators={post.relatedCalculators} />
            )}

            {post.faqs.length > 0 && <FaqAccordion faqs={post.faqs} />}

            <AuthorBox author={post.author} />

            {post.relatedPosts.length > 0 && <RelatedPosts posts={post.relatedPosts} />}
          </div>
        </article>

        <aside>
          <TableOfContents items={post.tableOfContents} />
        </aside>
      </div>

      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </div>
  );
}
