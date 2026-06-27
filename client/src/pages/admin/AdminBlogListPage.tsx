import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Pencil, ExternalLink, Send, EyeOff } from "lucide-react";
import adminApiClient from "../../utils/adminApiClient";
import { useSeo } from "../../hooks/useSeo";

interface AdminBlogListItem {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  category?: { name: string };
  publishedAt?: string;
  updatedAt: string;
  views: number;
}

type StatusFilter = "all" | "draft" | "published" | "archived";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-ink-100 text-ink-600 dark:bg-surface-700 dark:text-ink-300",
  published: "bg-gain/10 text-gain dark:text-gain-dark",
  archived: "bg-loss/10 text-loss dark:text-loss-dark",
};

const FILTER_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "draft", label: "Drafts" },
  { key: "published", label: "Published" },
  { key: "archived", label: "Archived" },
];

export default function AdminBlogListPage() {
  useSeo({ title: "Manage Blog Posts", description: "Admin blog management", noindex: true });

  const [posts, setPosts] = useState<AdminBlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [publishingId, setPublishingId] = useState<string | null>(null);

  function loadPosts() {
    setLoading(true);
    adminApiClient
      .get("/blogs?limit=100")
      .then((res) => setPosts(res.data.data))
      .catch(() => setError("Couldn't load posts — your session may have expired."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handlePublish(post: AdminBlogListItem) {
    setPublishingId(post._id);
    try {
      await adminApiClient.put(`/blogs/${post._id}`, { status: "published" });
      loadPosts();
    } catch {
      setError("Couldn't publish post.");
    } finally {
      setPublishingId(null);
    }
  }

  async function handleUnpublish(post: AdminBlogListItem) {
    setPublishingId(post._id);
    try {
      await adminApiClient.put(`/blogs/${post._id}`, { status: "draft" });
      loadPosts();
    } catch {
      setError("Couldn't unpublish post.");
    } finally {
      setPublishingId(null);
    }
  }

  async function handleDelete(post: AdminBlogListItem) {
    if (!confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    try {
      await adminApiClient.delete(`/blogs/${post._id}`);
      loadPosts();
    } catch {
      setError("Couldn't delete post.");
    }
  }

  const filtered = statusFilter === "all" ? posts : posts.filter((p) => p.status === statusFilter);

  const counts = posts.reduce(
    (acc, p) => { acc[p.status] = (acc[p.status] ?? 0) + 1; return acc; },
    {} as Record<string, number>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
            Blog Posts
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {posts.length} total · {counts.published ?? 0} published · {counts.draft ?? 0} drafts
          </p>
        </div>
        <Link to="/admin/blogs/new" className="btn-primary">
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="mb-4 flex gap-1 rounded-xl border border-ink-100 bg-ink-50 p-1 dark:border-surface-600 dark:bg-surface-800 w-fit">
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === key
                ? "bg-white text-ink-900 shadow-sm dark:bg-surface-600 dark:text-ink-50"
                : "text-ink-500 hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-200"
            }`}
          >
            {label}
            {key !== "all" && counts[key] ? (
              <span className="ml-1.5 text-xs text-ink-400 dark:text-ink-500">({counts[key]})</span>
            ) : null}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-loss/10 px-4 py-2 text-sm text-loss dark:text-loss-dark">
          {error}
        </p>
      )}

      {/* Draft banner when drafts exist */}
      {!loading && (counts.draft ?? 0) > 0 && statusFilter !== "published" && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 dark:border-gold-800/40 dark:bg-gold-900/20">
          <p className="text-sm text-gold-800 dark:text-gold-300">
            <span className="font-semibold">{counts.draft} draft{counts.draft !== 1 ? "s" : ""}</span> waiting to be published.
          </p>
          <button
            onClick={() => setStatusFilter("draft")}
            className="text-xs font-medium text-gold-700 underline underline-offset-2 hover:text-gold-900 dark:text-gold-400 dark:hover:text-gold-200"
          >
            View drafts
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-16 rounded-xl2" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <p className="text-ink-500 dark:text-ink-400">
            {statusFilter === "all" ? "No blog posts yet." : `No ${statusFilter} posts.`}
          </p>
          {statusFilter === "all" && (
            <Link to="/admin/blogs/new" className="btn-primary mt-4 inline-flex">
              <Plus size={16} />
              Write your first post
            </Link>
          )}
        </div>
      ) : (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-50 text-ink-500 dark:bg-surface-700 dark:text-ink-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Views</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post._id} className="border-t border-ink-100 dark:border-surface-500/30">
                    <td className="px-4 py-3 font-medium text-ink-800 dark:text-ink-100">
                      {post.title}
                    </td>
                    <td className="px-4 py-3 text-ink-500 dark:text-ink-400">
                      {post.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[post.status]}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-500 dark:text-ink-400">{post.views}</td>
                    <td className="px-4 py-3 text-ink-500 dark:text-ink-400">
                      {new Date(post.updatedAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {post.status === "published" ? (
                          <>
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 dark:hover:bg-surface-700"
                              title="View live"
                            >
                              <ExternalLink size={15} />
                            </a>
                            <button
                              onClick={() => handleUnpublish(post)}
                              disabled={publishingId === post._id}
                              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-500 hover:bg-ink-100 disabled:opacity-50 dark:text-ink-400 dark:hover:bg-surface-700 flex items-center gap-1"
                              title="Move back to draft"
                            >
                              <EyeOff size={13} />
                              Unpublish
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handlePublish(post)}
                            disabled={publishingId === post._id}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white bg-gain hover:bg-gain/90 disabled:opacity-50 dark:bg-gain-dark dark:hover:opacity-90 flex items-center gap-1"
                            title="Publish this post"
                          >
                            <Send size={13} />
                            {publishingId === post._id ? "Publishing…" : "Publish"}
                          </button>
                        )}
                        <Link
                          to={`/admin/blogs/${post._id}/edit`}
                          className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 dark:hover:bg-surface-700"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post)}
                          className="rounded-lg p-2 text-loss hover:bg-loss/10 dark:text-loss-dark"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
