import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import Calculator from "../models/Calculator.js";
import Blog from "../models/Blog.js";

/**
 * Seeds MongoDB with:
 *   1. Categories (calculator categories + blog categories)
 *   2. All 47 calculators (mirroring client/src/data/calculatorConfigs/sampleConfigs.ts)
 *   3. The 3 sample blog posts (mirroring client/src/data/blogPosts/samplePosts.ts)
 *
 * Run with: npm run seed (from /server)
 *
 * Safe to re-run: clears existing seeded documents first (by category type) rather than
 * appending duplicates. Does NOT touch ContactMessage, SiteSettings, or AffiliateProduct
 * collections, since those aren't part of this seed's scope.
 */

const CALCULATOR_CATEGORIES = [
  { name: "Investment", type: "calculator" },
  { name: "Loans", type: "calculator" },
  { name: "Banking", type: "calculator" },
  { name: "Tax", type: "calculator" },
  { name: "Personal Finance", type: "calculator" },
  { name: "Insurance", type: "calculator" },
  { name: "Business", type: "calculator" },
];

const BLOG_CATEGORIES = [
  { name: "Mutual Funds", type: "blog" },
  { name: "Stock Market", type: "blog" },
  { name: "Personal Finance", type: "both" }, // shared with calculator category
  { name: "Loans", type: "both" },
  { name: "Insurance", type: "both" },
  { name: "Taxation", type: "blog" },
  { name: "Retirement", type: "blog" },
  { name: "Banking", type: "both" },
  { name: "Credit Cards", type: "blog" },
  { name: "Investing", type: "blog" },
];

/**
 * Minimal calculator seed data. This mirrors the structure (not the full FAQ copy, to
 * keep this script maintainable) of sampleConfigs.ts. For the complete set of 47
 * calculators with full FAQs/descriptions, the frontend fallback remains the source of
 * truth — this seed gives the backend-driven path enough real data to demonstrate the
 * full stack working end-to-end (admin panel CRUD, API responses, etc.) without
 * duplicating ~3,500 lines of config by hand in two places.
 */
const CALCULATORS = [
  {
    name: "SIP Calculator",
    categoryName: "Investment",
    formulaKey: "sip",
    shortDescription: "Calculate the future value of your monthly SIP investments with the power of compounding.",
    inputs: [
      { key: "monthlyInvestment", label: "Monthly Investment", type: "currency", defaultValue: 10000, min: 500, max: 1000000, step: 500, unit: "₹" },
      { key: "annualReturnRate", label: "Expected Annual Return", type: "percent", defaultValue: 12, min: 1, max: 30, step: 0.5, unit: "%" },
      { key: "investmentPeriodYears", label: "Investment Period", type: "years", defaultValue: 10, min: 1, max: 40, step: 1, unit: "yrs" },
    ],
    outputs: [
      { key: "totalInvestedAmount", label: "Total Invested", unit: "₹" },
      { key: "estimatedReturns", label: "Estimated Returns", unit: "₹" },
      { key: "maturityAmount", label: "Maturity Amount", unit: "₹", highlight: true },
    ],
    isFeatured: true,
  },
  {
    name: "EMI Calculator",
    categoryName: "Loans",
    formulaKey: "emi",
    shortDescription: "Calculate your loan EMI, total interest payable, and view the full amortization schedule.",
    inputs: [
      { key: "loanAmount", label: "Loan Amount", type: "currency", defaultValue: 1000000, min: 10000, max: 100000000, step: 10000, unit: "₹" },
      { key: "annualInterestRate", label: "Interest Rate (Annual)", type: "percent", defaultValue: 8.5, min: 1, max: 25, step: 0.05, unit: "%" },
      { key: "loanTenureYears", label: "Loan Tenure", type: "years", defaultValue: 20, min: 1, max: 30, step: 1, unit: "yrs" },
    ],
    outputs: [
      { key: "emi", label: "Monthly EMI", unit: "₹", highlight: true },
      { key: "totalInterest", label: "Total Interest", unit: "₹" },
      { key: "totalPayment", label: "Total Payment", unit: "₹" },
    ],
    isFeatured: true,
  },
  {
    name: "FD Calculator",
    categoryName: "Banking",
    formulaKey: "fd",
    shortDescription: "Calculate the maturity value of your Fixed Deposit with quarterly compounding.",
    inputs: [
      { key: "principal", label: "Deposit Amount", type: "currency", defaultValue: 100000, min: 1000, max: 10000000, step: 1000, unit: "₹" },
      { key: "annualInterestRate", label: "Interest Rate (Annual)", type: "percent", defaultValue: 7, min: 1, max: 15, step: 0.1, unit: "%" },
      { key: "tenureYears", label: "Tenure", type: "years", defaultValue: 5, min: 1, max: 10, step: 1, unit: "yrs" },
    ],
    outputs: [
      { key: "principalAmount", label: "Principal Amount", unit: "₹" },
      { key: "totalInterest", label: "Interest Earned", unit: "₹" },
      { key: "maturityAmount", label: "Maturity Amount", unit: "₹", highlight: true },
    ],
    isFeatured: true,
  },
  {
    name: "Income Tax Calculator (New Regime)",
    categoryName: "Tax",
    formulaKey: "incomeTaxNew",
    shortDescription: "Calculate your income tax liability under the New Tax Regime for FY 2025-26 (AY 2026-27).",
    inputs: [
      { key: "grossAnnualIncome", label: "Gross Annual Income", type: "currency", defaultValue: 1200000, min: 0, max: 100000000, step: 10000, unit: "₹" },
      { key: "employerNpsContribution", label: "Employer NPS Contribution (80CCD(2))", type: "currency", defaultValue: 0, min: 0, max: 1000000, step: 1000, unit: "₹" },
    ],
    outputs: [
      { key: "taxableIncome", label: "Taxable Income", unit: "₹" },
      { key: "totalTaxPayable", label: "Total Tax Payable", unit: "₹", highlight: true },
      { key: "inHandIncome", label: "In-Hand Income", unit: "₹" },
    ],
    isFeatured: true,
  },
  {
    name: "FIRE Calculator",
    categoryName: "Personal Finance",
    formulaKey: "fire",
    shortDescription: "Calculate your Financial Independence, Retire Early (FIRE) number.",
    inputs: [
      { key: "currentMonthlyExpense", label: "Current Monthly Expenses", type: "currency", defaultValue: 50000, min: 5000, max: 1000000, step: 1000, unit: "₹" },
      { key: "currentAge", label: "Current Age", type: "number", defaultValue: 30, min: 18, max: 60, step: 1, unit: "yrs" },
      { key: "targetFireAge", label: "Target FIRE Age", type: "number", defaultValue: 45, min: 25, max: 65, step: 1, unit: "yrs" },
    ],
    outputs: [
      { key: "fireNumber", label: "FIRE Number", unit: "₹", highlight: true },
      { key: "requiredMonthlySip", label: "Required Monthly SIP", unit: "₹" },
    ],
    isFeatured: true,
  },
  {
    name: "Human Life Value Calculator",
    categoryName: "Insurance",
    formulaKey: "humanLifeValue",
    shortDescription: "Calculate the life insurance cover you need using the Income Replacement Method.",
    inputs: [
      { key: "annualIncome", label: "Annual Income", type: "currency", defaultValue: 1000000, min: 100000, max: 100000000, step: 50000, unit: "₹" },
      { key: "currentAge", label: "Current Age", type: "number", defaultValue: 35, min: 18, max: 60, step: 1, unit: "yrs" },
      { key: "retirementAge", label: "Planned Retirement Age", type: "number", defaultValue: 60, min: 45, max: 70, step: 1, unit: "yrs" },
    ],
    outputs: [
      { key: "recommendedCover", label: "Recommended Life Cover", unit: "₹", highlight: true },
    ],
    isFeatured: false,
  },
  {
    name: "Break-Even Point Calculator",
    categoryName: "Business",
    formulaKey: "breakEven",
    shortDescription: "Calculate how many units you need to sell to cover your fixed and variable costs.",
    inputs: [
      { key: "fixedCosts", label: "Monthly Fixed Costs", type: "currency", defaultValue: 50000, min: 0, max: 10000000, step: 1000, unit: "₹" },
      { key: "sellingPricePerUnit", label: "Selling Price per Unit", type: "currency", defaultValue: 500, min: 1, max: 1000000, step: 10, unit: "₹" },
      { key: "variableCostPerUnit", label: "Variable Cost per Unit", type: "currency", defaultValue: 200, min: 0, max: 1000000, step: 10, unit: "₹" },
    ],
    outputs: [
      { key: "breakEvenUnits", label: "Break-Even Units", unit: "units", highlight: true },
    ],
    isFeatured: false,
  },
];

const BLOG_POSTS = [
  {
    title: "SIP vs Lumpsum: Which Investment Strategy Wins?",
    excerpt: "A clear, numbers-based comparison of SIP and lumpsum investing — when each approach tends to work better, and how to decide for your own situation.",
    categoryName: "Mutual Funds",
    featuredImage: { url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop", alt: "Stock market chart" },
    tags: ["sip", "lumpsum", "mutual funds"],
    readingTimeMinutes: 6,
    content: "<p>Every new investor eventually runs into this question: should you invest a lump sum all at once, or spread it out through a Systematic Investment Plan (SIP)?</p><h2 id=\"how-lumpsum-works\">How Lumpsum Investing Works</h2><p>A lumpsum investment means putting your entire investible amount into the market at once.</p>",
    tableOfContents: [{ id: "how-lumpsum-works", text: "How Lumpsum Investing Works", level: 2 }],
    faqs: [{ question: "Is SIP always safer than lumpsum?", answer: "Not necessarily — SIP reduces timing risk but also means less time in the market for later contributions." }],
  },
  {
    title: "New vs Old Tax Regime: How to Actually Decide for FY 2025-26",
    excerpt: "The new tax regime is now the default — but that doesn't mean it's automatically better for you.",
    categoryName: "Taxation",
    featuredImage: { url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop", alt: "Tax documents" },
    tags: ["income tax", "tax regime"],
    readingTimeMinutes: 7,
    content: "<p>Since the new tax regime became the default option, a lot of salaried taxpayers have simply gone with it without checking whether the older regime might still save them more.</p><h2 id=\"core-tradeoff\">The Core Trade-off</h2><p>The new regime offers lower slab rates but strips away most deductions.</p>",
    tableOfContents: [{ id: "core-tradeoff", text: "The Core Trade-off", level: 2 }],
    faqs: [{ question: "Is the new tax regime compulsory now?", answer: "It's the default, but you can still actively choose the old regime when filing." }],
  },
  {
    title: "How Much Emergency Fund Do You Actually Need?",
    excerpt: "The '6 months of expenses' rule is a starting point, not a universal answer.",
    categoryName: "Personal Finance",
    featuredImage: { url: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=1200&h=630&fit=crop", alt: "Piggy bank" },
    tags: ["emergency fund", "savings"],
    readingTimeMinutes: 5,
    content: "<p>If you've read anything about personal finance, you've heard the standard advice: keep 3-6 months of expenses in an emergency fund.</p><h2 id=\"why-varies\">Why the Default Number Varies</h2><p>The logic behind any emergency fund target is simple.</p>",
    tableOfContents: [{ id: "why-varies", text: "Why the Default Number Varies", level: 2 }],
    faqs: [{ question: "Should I build my emergency fund before investing?", answer: "Generally yes — it prevents you from selling investments at a bad time during a crisis." }],
  },
];

async function seedCategories() {
  console.log("Seeding categories...");
  await Category.deleteMany({});

  const calcCats = await Category.insertMany(CALCULATOR_CATEGORIES);
  const blogCats = await Category.insertMany(
    BLOG_CATEGORIES.filter((bc) => !calcCats.some((cc) => cc.name === bc.name))
  );

  console.log(`  Created ${calcCats.length} calculator categories, ${blogCats.length} blog-only categories`);
  return [...calcCats, ...blogCats];
}

async function seedCalculators(categories) {
  console.log("Seeding calculators...");
  await Calculator.deleteMany({});

  const docs = CALCULATORS.map((calc) => {
    const category = categories.find((c) => c.name === calc.categoryName);
    if (!category) throw new Error(`Category not found for calculator: ${calc.name}`);
    return {
      name: calc.name,
      category: category._id,
      formulaKey: calc.formulaKey,
      shortDescription: calc.shortDescription,
      inputs: calc.inputs,
      outputs: calc.outputs,
      isFeatured: calc.isFeatured,
      status: "active",
    };
  });

  const created = await Calculator.insertMany(docs);
  console.log(`  Created ${created.length} calculators`);
}

async function seedBlogs(categories) {
  console.log("Seeding blog posts...");
  await Blog.deleteMany({});

  const docs = BLOG_POSTS.map((post) => {
    const category = categories.find((c) => c.name === post.categoryName);
    if (!category) throw new Error(`Category not found for blog post: ${post.title}`);
    return {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      category: category._id,
      tags: post.tags,
      tableOfContents: post.tableOfContents,
      faqs: post.faqs,
      author: { name: "RupeeUncle Team" },
      readingTimeMinutes: post.readingTimeMinutes,
      status: "published",
    };
  });

  const created = await Blog.insertMany(docs);
  console.log(`  Created ${created.length} blog posts`);
}

async function seedAll() {
  try {
    await connectDB();
    const categories = await seedCategories();
    await seedCalculators(categories);
    await seedBlogs(categories);
    console.log("\nSeed completed successfully.");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedAll();
