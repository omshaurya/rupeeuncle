import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["adsense", "sponsored", "banner", "affiliate"],
      default: "adsense",
    },
    placement: {
      type: String,
      enum: [
        "header",
        "sidebar",
        "in-content",
        "mobile-sticky",
        "footer",
        "between-blog-paragraphs",
      ],
      required: true,
      index: true,
    },
    // For AdSense: the actual ad unit slot ID from the AdSense dashboard
    adSlotId: {
      type: String,
      default: "",
    },
    adClientId: {
      type: String,
      default: "",
    },
    // For sponsored/banner ads: direct creative + link
    imageUrl: { type: String, default: "" },
    targetUrl: { type: String, default: "" },
    altText: { type: String, default: "" },
    sponsorName: { type: String, default: "" },
    startDate: { type: Date },
    endDate: { type: Date },
    pages: [{ type: String }], // restrict to specific page slugs; empty = all pages
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

advertisementSchema.index({ placement: 1, isActive: 1 });

export default mongoose.model("Advertisement", advertisementSchema);
