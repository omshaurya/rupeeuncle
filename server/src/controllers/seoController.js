import Blog from "../models/Blog.js";
import Calculator from "../models/Calculator.js";
import FinancialTerm from "../models/FinancialTerm.js";
import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";

const SITE_URL = process.env.SITE_URL || "https://rupeeuncle.com";

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/calculators", priority: "0.9", changefreq: "daily" },
  { path: "/blog", priority: "0.9", changefreq: "daily" },
  { path: "/dictionary", priority: "0.7", changefreq: "weekly" },
  { path: "/tools", priority: "0.8", changefreq: "weekly" },
  { path: "/market", priority: "0.7", changefreq: "daily" },
  { path: "/about-us", priority: "0.3", changefreq: "monthly" },
  { path: "/contact-us", priority: "0.3", changefreq: "monthly" },
  { path: "/privacy-policy", priority: "0.2", changefreq: "yearly" },
  { path: "/terms-and-conditions", priority: "0.2", changefreq: "yearly" },
  { path: "/disclaimer", priority: "0.2", changefreq: "yearly" },
  { path: "/cookie-policy", priority: "0.2", changefreq: "yearly" },
  { path: "/affiliate-disclosure", priority: "0.2", changefreq: "yearly" },
  { path: "/dmca-policy", priority: "0.2", changefreq: "yearly" },
];

const urlEntry = (loc, lastmod, changefreq, priority) => `
  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

/**
 * @desc    Generate robots.txt dynamically (so the sitemap URL always matches SITE_URL)
 * @route   GET /robots.txt
 * @access  Public
 */
export const getRobotsTxt = asyncHandler(async (req, res) => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin

Sitemap: ${SITE_URL}/sitemap.xml
`;

  res.header("Content-Type", "text/plain");
  res.send(robotsTxt);
});

/**
 * @desc    Generate dynamic sitemap.xml covering static pages, calculators, blogs,
 *          dictionary terms, and category pages — pulled live from MongoDB.
 * @route   GET /sitemap.xml
 * @access  Public
 */
export const getSitemapXml = asyncHandler(async (req, res) => {
  const [calculators, blogs, terms, categories] = await Promise.all([
    Calculator.find({ status: "active" }).select("slug updatedAt"),
    Blog.find({ status: "published" }).select("slug updatedAt"),
    FinancialTerm.find({ status: "published" }).select("slug updatedAt"),
    Category.find({ isActive: true }).select("slug type updatedAt"),
  ]);

  let urls = STATIC_PAGES.map((p) =>
    urlEntry(`${SITE_URL}${p.path}`, new Date(), p.changefreq, p.priority)
  );

  urls = urls.concat(
    calculators.map((c) =>
      urlEntry(`${SITE_URL}/calculators/${c.slug}`, c.updatedAt, "weekly", "0.8")
    )
  );

  urls = urls.concat(
    blogs.map((b) => urlEntry(`${SITE_URL}/blog/${b.slug}`, b.updatedAt, "monthly", "0.7"))
  );

  urls = urls.concat(
    terms.map((t) =>
      urlEntry(`${SITE_URL}/dictionary/${t.slug}`, t.updatedAt, "monthly", "0.5")
    )
  );

  urls = urls.concat(
    categories
      .filter((c) => c.type === "calculator" || c.type === "both")
      .map((c) =>
        urlEntry(`${SITE_URL}/calculators/category/${c.slug}`, c.updatedAt, "weekly", "0.7")
      )
  );

  urls = urls.concat(
    categories
      .filter((c) => c.type === "blog" || c.type === "both")
      .map((c) =>
        urlEntry(`${SITE_URL}/blog/category/${c.slug}`, c.updatedAt, "weekly", "0.6")
      )
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(sitemap);
});
