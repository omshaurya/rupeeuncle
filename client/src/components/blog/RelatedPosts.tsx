import type { BlogListItem } from "../../types/blog";
import BlogCard from "./BlogCard";

interface Props {
  posts: BlogListItem[];
}

export default function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
        Related Articles
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
