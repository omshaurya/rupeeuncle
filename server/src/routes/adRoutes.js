import express from "express";
import { getAdsByPlacement, recordImpression, recordClick } from "../controllers/adController.js";

const router = express.Router();

router.get("/", getAdsByPlacement);
router.post("/:id/impression", recordImpression);
router.post("/:id/click", recordClick);

export default router;
