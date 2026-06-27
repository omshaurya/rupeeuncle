import express from "express";
import { requireAdminKey } from "../middleware/adminAuth.js";

import {
  createCalculator,
  updateCalculator,
  deleteCalculator,
  getCalculatorById,
} from "../controllers/calculatorController.js";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAdminBlogs,
  getBlogById,
} from "../controllers/blogController.js";
import {
  createTerm,
  updateTerm,
  deleteTerm,
} from "../controllers/dictionaryController.js";
import {
  getAllFaqsAdmin,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../controllers/faqController.js";
import {
  getAllAdsAdmin,
  createAd,
  updateAd,
  deleteAd,
} from "../controllers/adController.js";
import {
  getAllAffiliateProductsAdmin,
  createAffiliateProduct,
  updateAffiliateProduct,
  deleteAffiliateProduct,
} from "../controllers/affiliateController.js";
import {
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../controllers/contactController.js";
import { updateSiteSettings } from "../controllers/settingsController.js";
import {
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Every route below requires the x-admin-key header to match ADMIN_API_KEY
router.use(requireAdminKey);

// Calculators
router.get("/calculators/:id", getCalculatorById);
router.post("/calculators", createCalculator);
router.put("/calculators/:id", updateCalculator);
router.delete("/calculators/:id", deleteCalculator);

// Blogs
router.get("/blogs", getAdminBlogs);
router.get("/blogs/:id", getBlogById);
router.post("/blogs", createBlog);
router.put("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);

// Financial dictionary
router.post("/dictionary", createTerm);
router.put("/dictionary/:id", updateTerm);
router.delete("/dictionary/:id", deleteTerm);

// FAQs
router.get("/faqs", getAllFaqsAdmin);
router.post("/faqs", createFaq);
router.put("/faqs/:id", updateFaq);
router.delete("/faqs/:id", deleteFaq);

// Advertisements
router.get("/ads", getAllAdsAdmin);
router.post("/ads", createAd);
router.put("/ads/:id", updateAd);
router.delete("/ads/:id", deleteAd);

// Affiliate products
router.get("/affiliate-products", getAllAffiliateProductsAdmin);
router.post("/affiliate-products", createAffiliateProduct);
router.put("/affiliate-products/:id", updateAffiliateProduct);
router.delete("/affiliate-products/:id", deleteAffiliateProduct);

// Contact messages
router.get("/contact-messages", getContactMessages);
router.put("/contact-messages/:id", updateContactMessageStatus);
router.delete("/contact-messages/:id", deleteContactMessage);

// Site settings
router.put("/settings", updateSiteSettings);

// Categories
router.get("/categories", getAllCategoriesAdmin);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

export default router;
