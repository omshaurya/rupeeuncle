import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Get all active categories, optionally filtered by type
 * @route   GET /api/categories?type=blog
 * @access  Public
 */
export const getCategories = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const filter = { isActive: true };
  if (type) filter.type = { $in: [type, "both"] };

  const categories = await Category.find(filter).sort({ order: 1, name: 1 });
  res.status(200).json({ success: true, count: categories.length, data: categories });
});

/**
 * @desc    Get all categories (admin, includes inactive)
 * @route   GET /api/admin/categories
 * @access  Admin
 */
export const getAllCategoriesAdmin = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ order: 1, name: 1 });
  res.status(200).json({ success: true, count: categories.length, data: categories });
});

/**
 * @desc    Create category
 * @route   POST /api/admin/categories
 * @access  Admin
 */
export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

/**
 * @desc    Update category
 * @route   PUT /api/admin/categories/:id
 * @access  Admin
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError(404, "Category not found");
  res.status(200).json({ success: true, data: category });
});

/**
 * @desc    Delete category
 * @route   DELETE /api/admin/categories/:id
 * @access  Admin
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");
  res.status(200).json({ success: true, message: "Category deleted", data: {} });
});
