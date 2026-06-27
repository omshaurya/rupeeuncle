import express from "express";
import {
  getBlogs,
  getBlogBySlug,
  getBlogSitemapData,
} from "../controllers/blogController.js";

const router = express.Router();

router.get("/sitemap-data", getBlogSitemapData);
router.get("/:slug", getBlogBySlug);
router.get("/", getBlogs);

export default router;
