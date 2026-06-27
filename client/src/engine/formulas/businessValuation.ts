import type { FormulaFn } from "../../types/calculator";

/**
 * Business Valuation Calculator.
 *
 * IMPORTANT — HONEST SCOPE LIMITATION: there is no single universal formula for business
 * valuation. Multiple independent valuation-industry sources state this explicitly —
 * actual valuations require comparable transaction databases, normalized/adjusted
 * earnings, and professional judgment on company-specific risk factors (customer
 * concentration, management depth, growth durability, industry dynamics). A generic
 * online calculator "cannot account for company-specific risk factors... management
 * quality, market conditions" (Sofer Advisors) and produces "rough estimates, not
 * defensible valuations."
 *
 * This calculator therefore deliberately presents a RANGE using three common rule-of-thumb
 * methods (revenue multiple, EBITDA multiple, profit multiple) rather than a single
 * confident number, and says so in its own insights — consistent with how this codebase
 * handled the same honesty problem for Term/Health Insurance premiums (no public formula
 * exists there either).
 *
 *   Revenue-based estimate = Annual Revenue × Revenue Multiple
 *   EBITDA-based estimate  = EBITDA × EBITDA Multiple
 *   Profit-based estimate  = Net Profit × Profit Multiple
 *
 * Typical small-business multiple ranges (cross-referenced across several valuation
 * sources): Revenue 0.5x-2x, EBITDA 3x-7x, Profit 2x-4x — these are starting points for a
 * conversation with a professional, not a substitute for one.
 */
export const businessValuationFormula: FormulaFn = (inputs) => {
  const annualRevenue = inputs.annualRevenue ?? 0;
  const ebitda = inputs.ebitda ?? 0;
  const netProfit = inputs.netProfit ?? 0;
  const revenueMultiple = inputs.revenueMultiple ?? 1.5;
  const ebitdaMultiple = inputs.ebitdaMultiple ?? 5;
  const profitMultiple = inputs.profitMultiple ?? 3;

  const revenueBasedValue = annualRevenue * revenueMultiple;
  const ebitdaBasedValue = ebitda * ebitdaMultiple;
  const profitBasedValue = netProfit * profitMultiple;

  const validEstimates = [revenueBasedValue, ebitdaBasedValue, profitBasedValue].filter(
    (v) => v > 0
  );
  const lowEstimate = validEstimates.length > 0 ? Math.min(...validEstimates) : 0;
  const highEstimate = validEstimates.length > 0 ? Math.max(...validEstimates) : 0;
  const midEstimate =
    validEstimates.length > 0
      ? validEstimates.reduce((sum, v) => sum + v, 0) / validEstimates.length
      : 0;

  const pieData = [
    { name: "Revenue-Based Estimate", value: Math.round(revenueBasedValue) },
    { name: "EBITDA-Based Estimate", value: Math.round(ebitdaBasedValue) },
    { name: "Profit-Based Estimate", value: Math.round(profitBasedValue) },
  ].filter((d) => d.value > 0);

  const insights: string[] = [
    `Using three common rule-of-thumb methods, your business value estimate ranges from ₹${Math.round(lowEstimate).toLocaleString("en-IN")} to ₹${Math.round(highEstimate).toLocaleString("en-IN")}, with a midpoint around ₹${Math.round(midEstimate).toLocaleString("en-IN")}.`,
    "This is a rough estimate using generic multiples, not a defensible valuation. Real valuations require normalized earnings (adjusting for owner compensation, one-time expenses), comparable transaction data specific to your industry and size, and an assessment of company-specific risk factors like customer concentration and owner dependence.",
    "For any decision that actually matters — selling the business, raising investment, estate planning, a shareholder dispute — engage a qualified business valuation professional rather than relying on this calculator's output as a number to negotiate with.",
  ];

  return {
    outputs: {
      lowEstimate: Math.round(lowEstimate),
      midEstimate: Math.round(midEstimate),
      highEstimate: Math.round(highEstimate),
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
