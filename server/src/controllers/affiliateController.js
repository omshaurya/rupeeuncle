import AffiliateProduct from "../models/AffiliateProduct.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Get affiliate products by category (for comparison pages e.g. /compare/credit-cards)
 * @route   GET /api/affiliate-products?category=credit-card
 * @access  Public
 */
export const getAffiliateProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = { status: "active" };
  if (category) filter.category = category;

  const products = await AffiliateProduct.find(filter).sort({
    isFeatured: -1,
    order: 1,
    rating: -1,
  });

  res.status(200).json({ success: true, count: products.length, data: products });
});

/**
 * @desc    Get single affiliate product by slug
 * @route   GET /api/affiliate-products/:slug
 * @access  Public
 */
export const getAffiliateProductBySlug = asyncHandler(async (req, res) => {
  const product = await AffiliateProduct.findOne({
    slug: req.params.slug,
    status: "active",
  });
  if (!product) throw new ApiError(404, "Product not found");
  res.status(200).json({ success: true, data: product });
});

/**
 * @desc    Record affiliate link click (for analytics / payout tracking)
 * @route   POST /api/affiliate-products/:id/click
 * @access  Public
 */
export const recordAffiliateClick = asyncHandler(async (req, res) => {
  await AffiliateProduct.updateOne({ _id: req.params.id }, { $inc: { clicks: 1 } });
  res.status(200).json({ success: true });
});

/**
 * @desc    Get all affiliate products (admin)
 * @route   GET /api/admin/affiliate-products
 * @access  Admin
 */
export const getAllAffiliateProductsAdmin = asyncHandler(async (req, res) => {
  const products = await AffiliateProduct.find().sort({ category: 1, order: 1 });
  res.status(200).json({ success: true, count: products.length, data: products });
});

/**
 * @desc    Create affiliate product
 * @route   POST /api/admin/affiliate-products
 * @access  Admin
 */
export const createAffiliateProduct = asyncHandler(async (req, res) => {
  const product = await AffiliateProduct.create(req.body);
  res.status(201).json({ success: true, data: product });
});

/**
 * @desc    Update affiliate product
 * @route   PUT /api/admin/affiliate-products/:id
 * @access  Admin
 */
export const updateAffiliateProduct = asyncHandler(async (req, res) => {
  const product = await AffiliateProduct.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, "Product not found");
  res.status(200).json({ success: true, data: product });
});

/**
 * @desc    Delete affiliate product
 * @route   DELETE /api/admin/affiliate-products/:id
 * @access  Admin
 */
export const deleteAffiliateProduct = asyncHandler(async (req, res) => {
  const product = await AffiliateProduct.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  res.status(200).json({ success: true, message: "Product deleted", data: {} });
});
