import Calculator from "../models/Calculator.js";
import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Get all calculators (with optional filtering by category, search, featured, trending)
 * @route   GET /api/calculators
 * @access  Public
 */
export const getCalculators = asyncHandler(async (req, res) => {
  const { category, search, featured, trending, status, page = 1, limit = 50 } = req.query;

  const filter = {};

  // Public requests should only ever see active calculators unless admin explicitly asks otherwise
  filter.status = status || "active";

  if (category) {
    const categoryDoc = await Category.findOne({ slug: category });
    if (categoryDoc) filter.category = categoryDoc._id;
  }

  if (featured === "true") filter.isFeatured = true;
  if (trending === "true") filter.isTrending = true;

  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [calculators, total] = await Promise.all([
    Calculator.find(filter)
      .populate("category", "name slug")
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Calculator.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: calculators.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: calculators,
  });
});

/**
 * @desc    Get single calculator by slug (includes full config the frontend engine needs to render)
 * @route   GET /api/calculators/:slug
 * @access  Public
 */
export const getCalculatorBySlug = asyncHandler(async (req, res) => {
  const calculator = await Calculator.findOne({
    slug: req.params.slug,
    status: "active",
  })
    .populate("category", "name slug")
    .populate("relatedCalculators", "name slug shortDescription icon");

  if (!calculator) {
    throw new ApiError(404, `Calculator not found: ${req.params.slug}`);
  }

  // Increment usage count (fire and forget - don't block the response)
  Calculator.updateOne({ _id: calculator._id }, { $inc: { usageCount: 1 } }).catch((err) =>
    console.error("Failed to increment usageCount:", err.message)
  );

  res.status(200).json({ success: true, data: calculator });
});

/**
 * @desc    Get all calculators grouped by category (used for navigation mega-menu and sitemap)
 * @route   GET /api/calculators/grouped
 * @access  Public
 */
export const getCalculatorsGrouped = asyncHandler(async (req, res) => {
  const categories = await Category.find({
    type: { $in: ["calculator", "both"] },
    isActive: true,
  }).sort({ order: 1 });

  const grouped = await Promise.all(
    categories.map(async (cat) => {
      const calculators = await Calculator.find({
        category: cat._id,
        status: "active",
      })
        .select("name slug shortDescription icon isFeatured isTrending")
        .sort({ order: 1 });

      return {
        category: { name: cat.name, slug: cat.slug, icon: cat.icon },
        calculators,
      };
    })
  );

  res.status(200).json({ success: true, data: grouped });
});

/**
 * @desc    Create a new calculator
 * @route   POST /api/admin/calculators
 * @access  Admin
 */
export const createCalculator = asyncHandler(async (req, res) => {
  const calculator = await Calculator.create(req.body);
  res.status(201).json({ success: true, data: calculator });
});

/**
 * @desc    Update a calculator
 * @route   PUT /api/admin/calculators/:id
 * @access  Admin
 */
export const updateCalculator = asyncHandler(async (req, res) => {
  const calculator = await Calculator.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!calculator) {
    throw new ApiError(404, "Calculator not found");
  }

  res.status(200).json({ success: true, data: calculator });
});

/**
 * @desc    Delete a calculator
 * @route   DELETE /api/admin/calculators/:id
 * @access  Admin
 */
export const deleteCalculator = asyncHandler(async (req, res) => {
  const calculator = await Calculator.findByIdAndDelete(req.params.id);

  if (!calculator) {
    throw new ApiError(404, "Calculator not found");
  }

  res.status(200).json({ success: true, message: "Calculator deleted", data: {} });
});

/**
 * @desc    Get single calculator by ID (admin edit form)
 * @route   GET /api/admin/calculators/:id
 * @access  Admin
 */
export const getCalculatorById = asyncHandler(async (req, res) => {
  const calculator = await Calculator.findById(req.params.id).populate("category");

  if (!calculator) {
    throw new ApiError(404, "Calculator not found");
  }

  res.status(200).json({ success: true, data: calculator });
});
