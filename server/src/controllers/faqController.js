import FAQ from "../models/FAQ.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Get FAQs for a specific page (or general site-wide FAQs)
 * @route   GET /api/faqs?page=home
 * @access  Public
 */
export const getFaqs = asyncHandler(async (req, res) => {
  const { page = "general" } = req.query;

  const faqs = await FAQ.find({ page, isActive: true }).sort({ order: 1 });

  res.status(200).json({ success: true, count: faqs.length, data: faqs });
});

/**
 * @desc    Get all FAQs (admin)
 * @route   GET /api/admin/faqs
 * @access  Admin
 */
export const getAllFaqsAdmin = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find().sort({ page: 1, order: 1 });
  res.status(200).json({ success: true, count: faqs.length, data: faqs });
});

/**
 * @desc    Create FAQ
 * @route   POST /api/admin/faqs
 * @access  Admin
 */
export const createFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.create(req.body);
  res.status(201).json({ success: true, data: faq });
});

/**
 * @desc    Update FAQ
 * @route   PUT /api/admin/faqs/:id
 * @access  Admin
 */
export const updateFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!faq) throw new ApiError(404, "FAQ not found");
  res.status(200).json({ success: true, data: faq });
});

/**
 * @desc    Delete FAQ
 * @route   DELETE /api/admin/faqs/:id
 * @access  Admin
 */
export const deleteFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);
  if (!faq) throw new ApiError(404, "FAQ not found");
  res.status(200).json({ success: true, message: "FAQ deleted", data: {} });
});
