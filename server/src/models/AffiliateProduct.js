import mongoose from "mongoose";
import slugify from "slugify";

const affiliateProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: String,
      enum: [
        "credit-card",
        "demat-account",
        "personal-loan",
        "home-loan",
        "health-insurance",
        "life-insurance",
        "investment-platform",
      ],
      required: true,
      index: true,
    },
    providerName: {
      type: String, // e.g. "HDFC Bank", "Zerodha", "Policybazaar"
      required: true,
    },
    logoUrl: {
      type: String,
      default: "",
    },
    shortDescription: {
      type: String,
      maxlength: 300,
      required: true,
    },
    features: [{ type: String }],
    pros: [{ type: String }],
    cons: [{ type: String }],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    fees: {
      type: String, // free text e.g. "Joining: ₹500, Annual: ₹500 (waived on spends > ₹1L)"
      default: "",
    },
    affiliateLink: {
      type: String,
      required: true,
    },
    isSponsored: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

affiliateProductSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(`${this.providerName}-${this.name}`, {
      lower: true,
      strict: true,
    });
  }
  next();
});

affiliateProductSchema.index({ category: 1, status: 1, order: 1 });

export default mongoose.model("AffiliateProduct", affiliateProductSchema);
