import FinancialTerm from "../models/FinancialTerm.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Get all terms, optionally filtered by letter, grouped for the A-Z index page
 * @route   GET /api/dictionary
 * @access  Public
 */
export const getTerms = asyncHandler(async (req, res) => {
  const { letter, search, page = 1, limit = 50 } = req.query;
  const filter = { status: "published" };

  if (letter) filter.letter = letter.toUpperCase();
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);

  const [terms, total] = await Promise.all([
    FinancialTerm.find(filter)
      .select("term slug shortDefinition letter")
      .sort({ term: 1 })
      .skip(skip)
      .limit(Number(limit)),
    FinancialTerm.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: terms.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: terms,
  });
});

/**
 * @desc    Get the A-Z letter index with counts (for dictionary navigation)
 * @route   GET /api/dictionary/letters
 * @access  Public
 */
export const getLetterIndex = asyncHandler(async (req, res) => {
  const counts = await FinancialTerm.aggregate([
    { $match: { status: "published" } },
    { $group: { _id: "$letter", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({ success: true, data: counts });
});

/**
 * @desc    Get single term by slug
 * @route   GET /api/dictionary/:slug
 * @access  Public
 */
export const getTermBySlug = asyncHandler(async (req, res) => {
  const term = await FinancialTerm.findOne({ slug: req.params.slug, status: "published" })
    .populate("relatedTerms", "term slug shortDefinition")
    .populate("relatedCalculators", "name slug shortDescription icon");

  if (!term) throw new ApiError(404, `Term not found: ${req.params.slug}`);

  res.status(200).json({ success: true, data: term });
});

/**
 * @desc    Create financial term
 * @route   POST /api/admin/dictionary
 * @access  Admin
 */
export const createTerm = asyncHandler(async (req, res) => {
  const term = await FinancialTerm.create(req.body);
  res.status(201).json({ success: true, data: term });
});

/**
 * @desc    Update financial term
 * @route   PUT /api/admin/dictionary/:id
 * @access  Admin
 */
export const updateTerm = asyncHandler(async (req, res) => {
  const term = await FinancialTerm.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!term) throw new ApiError(404, "Term not found");
  res.status(200).json({ success: true, data: term });
});

/**
 * @desc    Delete financial term
 * @route   DELETE /api/admin/dictionary/:id
 * @access  Admin
 */
export const deleteTerm = asyncHandler(async (req, res) => {
  const term = await FinancialTerm.findByIdAndDelete(req.params.id);
  if (!term) throw new ApiError(404, "Term not found");
  res.status(200).json({ success: true, message: "Term deleted", data: {} });
});
