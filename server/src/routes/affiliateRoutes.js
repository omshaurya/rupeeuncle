import express from "express";
import {
  getAffiliateProducts,
  getAffiliateProductBySlug,
  recordAffiliateClick,
} from "../controllers/affiliateController.js";

const router = express.Router();

router.get("/:slug", getAffiliateProductBySlug);
router.get("/", getAffiliateProducts);
router.post("/:id/click", recordAffiliateClick);

export default router;
