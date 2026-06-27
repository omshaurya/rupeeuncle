import mongoose from "mongoose";

/**
 * SiteSettings is a singleton collection (only one document should ever exist).
 * Holds global config the admin can edit: site name, social links, default SEO,
 * AdSense client ID, etc. Fetched once and cached on the frontend.
 */
const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "RupeeUncle",
    },
    tagline: {
      type: String,
      default:
        "India's Friendliest Financial Calculators, Investment Tools & Personal Finance Resource Platform",
    },
    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },
    defaultSeo: {
      metaTitle: { type: String, default: "RupeeUncle" },
      metaDescription: { type: String, default: "" },
      ogImage: { type: String, default: "" },
    },
    socialLinks: {
      twitter: { type: String, default: "" },
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    adsenseClientId: { type: String, default: "" },
    googleAnalyticsId: { type: String, default: "" },
    googleSearchConsoleVerification: { type: String, default: "" },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);
