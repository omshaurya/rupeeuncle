import mongoose from "mongoose";

/**
 * Reusable SEO sub-schema embedded in Blog, Calculator, and other content models.
 * Centralizing this means every page type automatically supports full SEO metadata
 * without re-declaring the same fields everywhere.
 */
const seoSchema = new mongoose.Schema(
  {
    metaTitle: {
      type: String,
      maxlength: 70,
      trim: true,
    },
    metaDescription: {
      type: String,
      maxlength: 160,
      trim: true,
    },
    canonicalUrl: {
      type: String,
      trim: true,
    },
    ogTitle: { type: String, trim: true },
    ogDescription: { type: String, trim: true },
    ogImage: { type: String, trim: true },
    twitterTitle: { type: String, trim: true },
    twitterDescription: { type: String, trim: true },
    twitterImage: { type: String, trim: true },
    keywords: [{ type: String, trim: true }],
    noIndex: { type: Boolean, default: false },
  },
  { _id: false }
);

export default seoSchema;
