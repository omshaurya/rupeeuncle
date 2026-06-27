import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Eye, EyeOff, ArrowLeft, Plus, Upload, Link as LinkIcon } from "lucide-react";
import adminApiClient from "../../utils/adminApiClient";
import apiClient from "../../utils/apiClient";
import { useSeo } from "../../hooks/useSeo";
import ContentToolbar from "../../components/admin/ContentToolbar";
import ArticleBody from "../../components/blog/ArticleBody";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface FormState {
  title: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  category: string; // category _id
  tags: string; // comma-separated in the form, split into an array on submit
  status: "draft" | "published";
}

const EMPTY_FORM: FormState = {
  title: "",
  excerpt: "",
  content: "",
  featuredImageUrl: "",
  featuredImageAlt: "",
  category: "",
  tags: "",
  status: "draft",
};

function slugPreview(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminBlogEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  useSeo({
    title: isEditMode ? "Edit Post" : "New Post",
    description: "Admin blog editor",
    noindex: true,
  });

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imageTab, setImageTab] = useState<"upload" | "url">("upload");
  const [imageUploading, setImageUploading] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5 MB."); return; }
    setImageUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      update("featuredImageUrl", e.target?.result as string);
      if (!form.featuredImageAlt) update("featuredImageAlt", file.name.replace(/\.[^.]+$/, ""));
      setImageUploading(false);
    };
    reader.onerror = () => { setError("Failed to read image file."); setImageUploading(false); };
    reader.readAsDataURL(file);
  }

  // Load categories (public endpoint — categories aren't sensitive data)
  useEffect(() => {
    apiClient
      .get("/categories?type=blog")
      .then((res) => setCategories(res.data.data))
      .catch(() => setError("Couldn't load categories. Is the backend running?"));
  }, []);

  // Load existing post when editing
  useEffect(() => {
    if (!isEditMode) return;
    adminApiClient
      .get(`/blogs/${id}`)
      .then((res) => {
        const post = res.data.data;
        setForm({
          title: post.title ?? "",
          excerpt: post.excerpt ?? "",
          content: post.content ?? "",
          featuredImageUrl: post.featuredImage?.url ?? "",
          featuredImageAlt: post.featuredImage?.alt ?? "",
          category: post.category?._id ?? post.category ?? "",
          tags: (post.tags ?? []).join(", "),
          status: post.status === "published" ? "published" : "draft",
        });
      })
      .catch(() => setError("Couldn't load this post — it may have been deleted."))
      .finally(() => setLoading(false));
  }, [id, isEditMode]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreateCategory() {
    const name = prompt("New category name:");
    if (!name?.trim()) return;
    try {
      const res = await adminApiClient.post("/categories", { name: name.trim(), type: "blog" });
      const newCategory = res.data.data;
      setCategories((prev) => [...prev, newCategory]);
      update("category", newCategory._id);
    } catch {
      setError("Couldn't create category — it may already exist.");
    }
  }

  async function handleSubmit(e: React.FormEvent, publishOverride?: "draft" | "published") {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setError("Title, excerpt, and content are all required.");
      return;
    }
    if (!form.featuredImageUrl.trim()) {
      setError("A featured image URL is required — paste a link to a hosted image.");
      return;
    }
    if (!form.category) {
      setError("Please select or create a category.");
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content,
      featuredImage: { url: form.featuredImageUrl.trim(), alt: form.featuredImageAlt.trim() },
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
      status: publishOverride ?? form.status,
    };

    try {
      if (isEditMode) {
        await adminApiClient.put(`/blogs/${id}`, payload);
      } else {
        await adminApiClient.post("/blogs", payload);
      }
      setSuccessMessage(
        payload.status === "published"
          ? "Saved and published — live on the public blog now."
          : "Saved as draft."
      );
      setTimeout(() => navigate("/admin/blogs"), 900);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Couldn't save this post. Check required fields.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="skeleton h-96 rounded-xl2" />;
  }

  return (
    <div>
      <button
        onClick={() => navigate("/admin/blogs")}
        className="mb-4 flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
      >
        <ArrowLeft size={15} />
        Back to all posts
      </button>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
          {isEditMode ? "Edit Post" : "New Post"}
        </h1>
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="btn-secondary"
        >
          {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
          {showPreview ? "Hide Preview" : "Preview"}
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-loss/10 px-4 py-2.5 text-sm text-loss dark:text-loss-dark">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="mb-4 rounded-lg bg-gain/10 px-4 py-2.5 text-sm text-gain dark:text-gain-dark">
          {successMessage}
        </p>
      )}

      <form onSubmit={(e) => handleSubmit(e)} className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
              Title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-base font-medium text-ink-800 dark:border-surface-500 dark:bg-surface-700 dark:text-ink-50"
              placeholder="How to Choose Between SIP and Lumpsum"
            />
            {form.title && (
              <p className="mt-1 text-xs text-ink-400">
                URL: /blog/{slugPreview(form.title)}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
              Excerpt * <span className="text-ink-400">(shown in blog listing cards, max 300 chars)</span>
            </label>
            <textarea
              required
              maxLength={300}
              rows={2}
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-800 dark:border-surface-500 dark:bg-surface-700 dark:text-ink-50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
              Content * <span className="text-ink-400">(HTML — use the toolbar to insert formatting, links, and images)</span>
            </label>
            <ContentToolbar textareaRef={contentRef} value={form.content} onChange={(v) => update("content", v)} />

            {showPreview ? (
              /* Side-by-side: editor left, preview right */
              <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-b-lg border border-ink-200 dark:border-surface-500">
                <textarea
                  ref={contentRef}
                  required
                  rows={24}
                  value={form.content}
                  onChange={(e) => update("content", e.target.value)}
                  className="h-full resize-none border-r border-ink-200 bg-white px-3 py-2.5 font-mono text-sm text-ink-800 outline-none dark:border-surface-600 dark:bg-surface-700 dark:text-ink-50"
                  placeholder={'<p>Start writing...</p>'}
                />
                <div className="overflow-y-auto bg-white px-5 py-4 dark:bg-surface-800" style={{ maxHeight: "600px" }}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-400">
                    Live Preview
                  </p>
                  {form.content ? (
                    <ArticleBody html={form.content} />
                  ) : (
                    <p className="text-sm text-ink-400">Start typing on the left to see the preview here.</p>
                  )}
                </div>
              </div>
            ) : (
              <textarea
                ref={contentRef}
                required
                rows={16}
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                className="w-full rounded-b-lg border border-ink-200 bg-white px-3 py-2.5 font-mono text-sm text-ink-800 dark:border-surface-500 dark:bg-surface-700 dark:text-ink-50"
                placeholder={'<p>Start writing...</p>\n<h2 id="section-one">A Section Heading</h2>\n<p>More content with a <a href="https://example.com">link</a>.</p>'}
              />
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card-surface p-5">
            <p className="mb-3 text-sm font-semibold text-ink-900 dark:text-ink-50">Publish</p>
            <div className="space-y-2">
              <button
                type="button"
                disabled={saving}
                onClick={(e) => handleSubmit(e, "published")}
                className="btn-primary w-full disabled:opacity-60"
              >
                <Save size={15} />
                {saving ? "Saving..." : "Save & Publish"}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={(e) => handleSubmit(e, "draft")}
                className="btn-secondary w-full disabled:opacity-60"
              >
                Save as Draft
              </button>
            </div>
            {form.status === "published" && isEditMode && (
              <p className="mt-2 text-center text-xs text-gain dark:text-gain-dark">
                Currently live on the public blog
              </p>
            )}
          </div>

          <div className="card-surface p-5">
            <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
              Category *
            </label>
            <select
              required
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-surface-500 dark:bg-surface-700 dark:text-ink-50"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleCreateCategory}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-gold-600 dark:text-gold-400"
            >
              <Plus size={13} />
              Create new category
            </button>
          </div>

          <div className="card-surface p-5">
            <p className="mb-2 text-sm font-medium text-ink-700 dark:text-ink-200">
              Featured Image *
            </p>

            {/* Tab switcher */}
            <div className="mb-3 flex rounded-lg border border-ink-200 p-0.5 dark:border-surface-500">
              <button
                type="button"
                onClick={() => setImageTab("upload")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors ${
                  imageTab === "upload"
                    ? "bg-ink-800 text-white dark:bg-gold-400 dark:text-ink-950"
                    : "text-ink-500 hover:text-ink-700 dark:text-ink-400"
                }`}
              >
                <Upload size={12} /> Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageTab("url")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors ${
                  imageTab === "url"
                    ? "bg-ink-800 text-white dark:bg-gold-400 dark:text-ink-950"
                    : "text-ink-500 hover:text-ink-700 dark:text-ink-400"
                }`}
              >
                <LinkIcon size={12} /> Paste URL
              </button>
            </div>

            {imageTab === "upload" ? (
              <div
                onClick={() => imageInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImageFile(f); }}
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink-200 bg-ink-50 px-4 py-6 text-center transition-colors hover:border-gold-400 hover:bg-gold-50 dark:border-surface-500 dark:bg-surface-700 dark:hover:border-gold-500"
              >
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
                />
                {imageUploading ? (
                  <p className="text-sm text-ink-500">Reading image…</p>
                ) : (
                  <>
                    <Upload size={20} className="text-ink-400" />
                    <p className="text-sm text-ink-600 dark:text-ink-300">
                      <span className="font-medium text-gold-600 dark:text-gold-400">Click to upload</span> or drag & drop
                    </p>
                    <p className="text-xs text-ink-400">PNG, JPG, WebP — max 5 MB</p>
                  </>
                )}
              </div>
            ) : (
              <input
                value={form.featuredImageUrl.startsWith("data:") ? "" : form.featuredImageUrl}
                onChange={(e) => update("featuredImageUrl", e.target.value)}
                placeholder="https://images.example.com/photo.jpg"
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-surface-500 dark:bg-surface-700 dark:text-ink-50"
              />
            )}

            {form.featuredImageUrl && (
              <div className="mt-3">
                <img
                  src={form.featuredImageUrl}
                  alt={form.featuredImageAlt}
                  className="aspect-[16/9] w-full rounded-lg object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <button
                  type="button"
                  onClick={() => update("featuredImageUrl", "")}
                  className="mt-1.5 text-xs text-loss hover:underline dark:text-loss-dark"
                >
                  Remove image
                </button>
              </div>
            )}

            <label className="mb-1.5 mt-3 block text-sm font-medium text-ink-700 dark:text-ink-200">
              Image Alt Text
            </label>
            <input
              value={form.featuredImageAlt}
              onChange={(e) => update("featuredImageAlt", e.target.value)}
              placeholder="Describes the image for accessibility & SEO"
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-surface-500 dark:bg-surface-700 dark:text-ink-50"
            />
          </div>

          <div className="card-surface p-5">
            <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
              Tags <span className="text-ink-400">(comma-separated)</span>
            </label>
            <input
              value={form.tags}
              onChange={(e) => update("tags", e.target.value)}
              placeholder="sip, mutual funds, investing"
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-surface-500 dark:bg-surface-700 dark:text-ink-50"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
