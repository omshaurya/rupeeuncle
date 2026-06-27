import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import calculatorRoutes from "./routes/calculatorRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import dictionaryRoutes from "./routes/dictionaryRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import adRoutes from "./routes/adRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import affiliateRoutes from "./routes/affiliateRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { getRobotsTxt, getSitemapXml } from "./controllers/seoController.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// --- Security & performance middleware ---
app.use(helmet({ contentSecurityPolicy: false })); // CSP configured at CDN/host level instead
app.use(compression());

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_PROD,
  "https://www.rupeeuncle.com",
  "https://rupeeuncle.com",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : "*",
    credentials: false,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(mongoSanitize());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// Rate limiting for the public API (admin routes get their own stricter limiter below)
const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", apiLimiter);

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/admin", adminLimiter);

// --- SEO files (must be at root, not under /api) ---
app.get("/robots.txt", getRobotsTxt);
app.get("/sitemap.xml", getSitemapXml);

// --- Health check (for uptime monitors) ---
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "RupeeUncle API is running" });
});
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "RupeeUncle API is running" });
});

// --- API routes ---
app.use("/api/calculators", calculatorRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/dictionary", dictionaryRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/affiliate-products", affiliateRoutes);
app.use("/api/admin", adminRoutes);

// --- 404 + error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

export default app;
