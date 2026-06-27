import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    page: {
      type: String, // which page this FAQ belongs to: "home", "general", a calculator slug, etc.
      default: "general",
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

faqSchema.index({ page: 1, isActive: 1, order: 1 });

export default mongoose.model("FAQ", faqSchema);
