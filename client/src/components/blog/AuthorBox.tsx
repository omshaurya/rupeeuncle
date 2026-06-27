import type { BlogAuthor } from "../../types/blog";
import { User } from "lucide-react";

interface Props {
  author: BlogAuthor;
}

export default function AuthorBox({ author }: Props) {
  return (
    <div className="card-surface flex items-start gap-4 p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink-gradient text-white">
        {author.avatar ? (
          <img src={author.avatar} alt={author.name} className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <User size={20} />
        )}
      </div>
      <div>
        <p className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
          {author.name}
        </p>
        {author.bio && (
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{author.bio}</p>
        )}
      </div>
    </div>
  );
}
