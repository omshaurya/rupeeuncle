import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../utils/apiClient";
import { sampleBlogPosts } from "../data/blogPosts/samplePosts";
import type { BlogListItem } from "../types/blog";
import { useSeo } from "../hooks/useSeo";
import BlogCard from "../components/blog/BlogCard";

export default function BlogListPage() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const [posts, setPosts] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useSeo({
    title: "Personal Finance Blog",
    description:
      "Practical, numbers-driven articles on mutual funds, taxation, loans, and personal finance for Indian readers.",
    canonicalPath: "/blog",
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = categoryFilter ? `?category=${categoryFilter}` : "";
    apiClient
      .get(`/blogs${params}`)
      .then((res) => {
        if (!cancelled) {
          setPosts(res.data.data);
          setUsingFallback(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          const filtered = categoryFilter
            ? sampleBlogPosts.filter((p) => p.category.slug === categoryFilter)
            : sampleBlogPosts;
          setPosts(filtered);
          setUsingFallback(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {usingFallback && (
        <div className="mb-4 rounded-lg border border-gold-300 bg-gold-50 px-4 py-2 text-xs text-gold-800">
          Showing local sample articles — backend API not reachable. Connect MongoDB and run the seed script for live content.
        </div>
      )}

      <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">
        RupeeUncle Blog
      </h1>
      <p className="mt-2 max-w-2xl text-ink-500">
        Practical, numbers-driven guidance on mutual funds, taxation, loans, and personal
        finance — no jargon, no sales pitch.
      </p>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-gold-500" />
        </div>
      ) : posts.length === 0 ? (
        <p className="mt-12 text-ink-500">No articles found in this category yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
