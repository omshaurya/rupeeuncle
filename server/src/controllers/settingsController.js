import SiteSettings from "../models/SiteSettings.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    Get site settings (creates default doc on first call if none exists)
 * @route   GET /api/settings
 * @access  Public
 */
export const getSiteSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();

  if (!settings) {
    settings = await SiteSettings.create({});
  }

  res.status(200).json({ success: true, data: settings });
});

/**
 * @desc    Update site settings (admin)
 * @route   PUT /api/admin/settings
 * @access  Admin
 */
export const updateSiteSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();

  if (!settings) {
    settings = await SiteSettings.create(req.body);
  } else {
    settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, {
      new: true,
      runValidators: true,
    });
  }

  res.status(200).json({ success: true, data: settings });
});
