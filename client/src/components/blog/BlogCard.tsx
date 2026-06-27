import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import type { BlogListItem } from "../../types/blog";

interface Props {
  post: BlogListItem;
}

export default function BlogCard({ post }: Props) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="card-surface group flex flex-col overflow-hidden transition-shadow hover:shadow-card-hover"
    >
      <div className="aspect-[16/9] overflow-hidden bg-ink-100">
        <img
          src={post.featuredImage.url}
          alt={post.featuredImage.alt || post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-gold-600 dark:text-gold-400">
          {post.category.name}
        </span>
        <h3 className="mt-1.5 font-display text-base font-semibold text-ink-900 dark:text-ink-50">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-ink-500 dark:text-ink-400">{post.excerpt}</p>
        <div className="mt-4 flex items-center gap-1.5 text-xs text-ink-400">
          <Clock size={13} />
          {post.readingTimeMinutes} min read
        </div>
      </div>
    </Link>
  );
}
