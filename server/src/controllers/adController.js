import Advertisement from "../models/Advertisement.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Get active ads for a given placement (and optionally a specific page)
 * @route   GET /api/ads?placement=sidebar&page=sip-calculator
 * @access  Public
 */
export const getAdsByPlacement = asyncHandler(async (req, res) => {
  const { placement, page } = req.query;

  if (!placement) throw new ApiError(400, "placement query param is required");

  const now = new Date();
  const filter = {
    placement,
    isActive: true,
    $or: [{ startDate: null }, { startDate: { $lte: now } }],
  };

  let ads = await Advertisement.find(filter);

  // Filter further: ads with endDate in the past are excluded; ads restricted to specific
  // pages only show on those pages, ads with empty pages[] show everywhere.
  ads = ads.filter((ad) => {
    const notExpired = !ad.endDate || ad.endDate >= now;
    const pageMatches = !ad.pages?.length || (page && ad.pages.includes(page));
    return notExpired && pageMatches;
  });

  res.status(200).json({ success: true, count: ads.length, data: ads });
});

/**
 * @desc    Record an ad impression
 * @route   POST /api/ads/:id/impression
 * @access  Public
 */
export const recordImpression = asyncHandler(async (req, res) => {
  await Advertisement.updateOne({ _id: req.params.id }, { $inc: { impressions: 1 } });
  res.status(200).json({ success: true });
});

/**
 * @desc    Record an ad click
 * @route   POST /api/ads/:id/click
 * @access  Public
 */
export const recordClick = asyncHandler(async (req, res) => {
  await Advertisement.updateOne({ _id: req.params.id }, { $inc: { clicks: 1 } });
  res.status(200).json({ success: true });
});

/**
 * @desc    Get all ads (admin)
 * @route   GET /api/admin/ads
 * @access  Admin
 */
export const getAllAdsAdmin = asyncHandler(async (req, res) => {
  const ads = await Advertisement.find().sort({ placement: 1, createdAt: -1 });
  res.status(200).json({ success: true, count: ads.length, data: ads });
});

/**
 * @desc    Create ad
 * @route   POST /api/admin/ads
 * @access  Admin
 */
export const createAd = asyncHandler(async (req, res) => {
  const ad = await Advertisement.create(req.body);
  res.status(201).json({ success: true, data: ad });
});

/**
 * @desc    Update ad
 * @route   PUT /api/admin/ads/:id
 * @access  Admin
 */
export const updateAd = asyncHandler(async (req, res) => {
  const ad = await Advertisement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!ad) throw new ApiError(404, "Advertisement not found");
  res.status(200).json({ success: true, data: ad });
});

/**
 * @desc    Delete ad
 * @route   DELETE /api/admin/ads/:id
 * @access  Admin
 */
export const deleteAd = asyncHandler(async (req, res) => {
  const ad = await Advertisement.findByIdAndDelete(req.params.id);
  if (!ad) throw new ApiError(404, "Advertisement not found");
  res.status(200).json({ success: true, message: "Advertisement deleted", data: {} });
});
