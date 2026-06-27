import Blog from "../models/Blog.js";
import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Get published blogs with filtering, search, and pagination
 * @route   GET /api/blogs
 * @access  Public
 */
export const getBlogs = asyncHandler(async (req, res) => {
  const { category, tag, search, page = 1, limit = 12 } = req.query;

  const filter = { status: "published" };

  if (category) {
    const categoryDoc = await Category.findOne({ slug: category });
    if (categoryDoc) filter.category = categoryDoc._id;
  }

  if (tag) filter.tags = tag.toLowerCase();
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate("category", "name slug")
      .select("-content") // list view doesn't need full body
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Blog.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: blogs.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: blogs,
  });
});

/**
 * @desc    Get single blog by slug, with related posts/calculators populated
 * @route   GET /api/blogs/:slug
 * @access  Public
 */
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, status: "published" })
    .populate("category", "name slug")
    .populate("relatedPosts", "title slug excerpt featuredImage")
    .populate("relatedCalculators", "name slug shortDescription icon");

  if (!blog) {
    throw new ApiError(404, `Blog not found: ${req.params.slug}`);
  }

  Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } }).catch((err) =>
    console.error("Failed to increment blog views:", err.message)
  );

  res.status(200).json({ success: true, data: blog });
});

/**
 * @desc    Get all blog slugs + updatedAt (lightweight, used for sitemap.xml generation)
 * @route   GET /api/blogs/sitemap-data
 * @access  Public
 */
export const getBlogSitemapData = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ status: "published" }).select("slug updatedAt");
  res.status(200).json({ success: true, data: blogs });
});

/**
 * @desc    Create blog post
 * @route   POST /api/admin/blogs
 * @access  Admin
 */
export const createBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(201).json({ success: true, data: blog });
});

/**
 * @desc    Update blog post
 * @route   PUT /api/admin/blogs/:id
 * @access  Admin
 */
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!blog) throw new ApiError(404, "Blog not found");

  res.status(200).json({ success: true, data: blog });
});

/**
 * @desc    Delete blog post
 * @route   DELETE /api/admin/blogs/:id
 * @access  Admin
 */
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found");
  res.status(200).json({ success: true, message: "Blog deleted", data: {} });
});

/**
 * @desc    Get all blogs for admin (includes drafts)
 * @route   GET /api/admin/blogs
 * @access  Admin
 */
export const getAdminBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Blog.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: blogs.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: blogs,
  });
});

/**
 * @desc    Get single blog by ID (admin edit form)
 * @route   GET /api/admin/blogs/:id
 * @access  Admin
 */
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("category");
  if (!blog) throw new ApiError(404, "Blog not found");
  res.status(200).json({ success: true, data: blog });
});
