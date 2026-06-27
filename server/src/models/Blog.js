import mongoose from "mongoose";
import slugify from "slugify";
import seoSchema from "./schemas/seoSchema.js";
import faqItemSchema from "./schemas/faqItemSchema.js";

const tocItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // anchor id e.g. "what-is-sip"
    text: { type: String, required: true },
    level: { type: Number, default: 2 }, // h2, h3 etc.
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      maxlength: 300,
      required: true,
    },
    content: {
      type: String, // rendered HTML or Markdown body
      required: true,
    },
    featuredImage: {
      url: { type: String, required: true },
      alt: { type: String, default: "" },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [{ type: String, trim: true, lowercase: true, index: true }],
    tableOfContents: [tocItemSchema],
    faqs: [faqItemSchema],
    relatedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    relatedCalculators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Calculator",
      },
    ],
    author: {
      name: { type: String, default: "RupeeUncle Team" },
      bio: { type: String, default: "" },
      avatar: { type: String, default: "" },
    },
    readingTimeMinutes: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    seo: seoSchema,
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Indexes for fast querying and SEO sitemap generation
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ title: "text", excerpt: "text" });

export default mongoose.model("Blog", blogSchema);
