import mongoose from "mongoose";
import slugify from "slugify";
import seoSchema from "./schemas/seoSchema.js";
import faqItemSchema from "./schemas/faqItemSchema.js";

/**
 * Defines a single input field for a calculator.
 * The frontend's calculator-engine reads this array and renders the form dynamically.
 */
const calculatorInputSchema = new mongoose.Schema(
  {
    key: { type: String, required: true }, // e.g. "monthlyInvestment"
    label: { type: String, required: true }, // e.g. "Monthly Investment"
    type: {
      type: String,
      enum: ["number", "percent", "slider", "select", "currency", "years"],
      default: "number",
    },
    defaultValue: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 10000000 },
    step: { type: Number, default: 1 },
    unit: { type: String, default: "" }, // "₹", "%", "yrs"
    helpText: { type: String, default: "" },
    options: [{ label: String, value: mongoose.Schema.Types.Mixed }], // for "select" type
  },
  { _id: false }
);

const calculatorOutputSchema = new mongoose.Schema(
  {
    key: { type: String, required: true }, // e.g. "maturityAmount"
    label: { type: String, required: true },
    unit: { type: String, default: "₹" },
    highlight: { type: Boolean, default: false }, // shown prominently in result card
  },
  { _id: false }
);

const calculatorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Calculator name is required"],
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    shortDescription: {
      type: String,
      maxlength: 300,
      required: true,
    },
    longDescription: {
      type: String, // shown below the calculator for SEO content
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    // The key that maps to a formula function registered in the formula-engine.
    // e.g. "sip", "emi", "fd", "incomeTaxNew"
    formulaKey: {
      type: String,
      required: true,
      index: true,
    },
    inputs: {
      type: [calculatorInputSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Calculator must have at least one input",
      },
    },
    outputs: {
      type: [calculatorOutputSchema],
      required: true,
    },
    chartTypes: {
      type: [String],
      enum: ["line", "pie", "bar"],
      default: ["line", "pie", "bar"],
    },
    generatesYearlyTable: {
      type: Boolean,
      default: true,
    },
    icon: { type: String, default: "calculator" },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    faqs: [faqItemSchema],
    relatedCalculators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Calculator",
      },
    ],
    status: {
      type: String,
      enum: ["active", "draft", "disabled"],
      default: "active",
      index: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    seo: seoSchema,
  },
  { timestamps: true }
);

calculatorSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

calculatorSchema.index({ slug: 1 });
calculatorSchema.index({ category: 1, status: 1 });
calculatorSchema.index({ isFeatured: 1, isTrending: 1 });
calculatorSchema.index({ name: "text", shortDescription: "text" });

export default mongoose.model("Calculator", calculatorSchema);
