import mongoose from "mongoose";
import slugify from "slugify";
import seoSchema from "./schemas/seoSchema.js";
import faqItemSchema from "./schemas/faqItemSchema.js";

const financialTermSchema = new mongoose.Schema(
  {
    term: {
      type: String,
      required: [true, "Term is required"],
      trim: true,
      unique: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    letter: {
      type: String, // first letter, uppercase, used for A-Z index page grouping
      uppercase: true,
      index: true,
    },
    shortDefinition: {
      type: String,
      required: true,
      maxlength: 300,
    },
    fullExplanation: {
      type: String,
      required: true,
    },
    example: {
      type: String,
      default: "",
    },
    faqs: [faqItemSchema],
    relatedTerms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FinancialTerm",
      },
    ],
    relatedCalculators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Calculator",
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
    seo: seoSchema,
  },
  { timestamps: true }
);

financialTermSchema.pre("save", function (next) {
  if (this.isModified("term") || !this.slug) {
    this.slug = slugify(this.term, { lower: true, strict: true });
  }
  if (this.isModified("term") || !this.letter) {
    this.letter = this.term.charAt(0).toUpperCase();
  }
  next();
});

financialTermSchema.index({ slug: 1 });
financialTermSchema.index({ letter: 1, status: 1 });
financialTermSchema.index({ term: "text", shortDefinition: "text" });

export default mongoose.model("FinancialTerm", financialTermSchema);
