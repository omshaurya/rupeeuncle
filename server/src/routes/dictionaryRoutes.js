import express from "express";
import { getTerms, getLetterIndex, getTermBySlug } from "../controllers/dictionaryController.js";

const router = express.Router();

router.get("/letters", getLetterIndex);
router.get("/:slug", getTermBySlug);
router.get("/", getTerms);

export default router;
