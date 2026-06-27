import express from "express";
import {
  getCalculators,
  getCalculatorBySlug,
  getCalculatorsGrouped,
} from "../controllers/calculatorController.js";

const router = express.Router();

router.get("/grouped", getCalculatorsGrouped);
router.get("/:slug", getCalculatorBySlug);
router.get("/", getCalculators);

export default router;
