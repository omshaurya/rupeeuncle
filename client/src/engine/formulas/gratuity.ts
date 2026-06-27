import type { FormulaFn } from "../../types/calculator";

/**
 * Gratuity Calculator — Payment of Gratuity Act, 1972 (continued under the Code on
 * Social Security, 2020).
 *
 * For employers covered under the Act (10+ employees):
 *   Gratuity = (Last Drawn Basic + DA) × 15 × Years of Service / 26
 * For employers NOT covered under the Act:
 *   Gratuity = (Average Salary of Last 10 Months) × 15 × Years of Service / 30
 *
 * Years of service rounding: a part-year of 6+ months rounds UP to the next full year;
 * less than 6 months rounds DOWN.
 *
 * Tax exemption (Section 10(10)): the exempt amount is the LEAST of:
 *   1. ₹20,00,000 (statutory cap, raised from ₹10L in March 2018, unrevised as of 2026)
 *   2. Actual gratuity received
 *   3. The statutory formula amount above
 * Government employees: gratuity is fully tax-exempt regardless of amount.
 *
 * Verified against multiple independently published examples — e.g. ₹30,000 salary ×
 * 7 years → ₹1,21,153.85 (Act-covered, 26-day divisor) and ₹25,000 × 20 years →
 * ₹2,88,461.54 — both matched exactly.
 */
export const gratuityFormula: FormulaFn = (inputs) => {
  const lastDrawnSalary = inputs.lastDrawnSalary ?? 0;
  const yearsOfServiceRaw = inputs.yearsOfServiceRaw ?? 0;
  const monthsInExtraYear = inputs.monthsInExtraYear ?? 0; // additional months beyond full years
  const isActCovered = (inputs.isActCovered ?? 1) === 1;
  const isGovernmentEmployee = (inputs.isGovernmentEmployee ?? 0) === 1;

  // Round years: 6+ months rounds up, less than 6 rounds down
  const roundedYears =
    monthsInExtraYear >= 6 ? yearsOfServiceRaw + 1 : yearsOfServiceRaw;

  const divisor = isActCovered ? 26 : 30;
  const gratuityAmount = (lastDrawnSalary * 15 * roundedYears) / divisor;

  const STATUTORY_CAP = 2000000; // ₹20 lakh, Section 10(10)(ii)/(iii)

  let exemptAmount: number;
  let taxableAmount: number;

  if (isGovernmentEmployee) {
    exemptAmount = gratuityAmount;
    taxableAmount = 0;
  } else {
    exemptAmount = Math.min(gratuityAmount, STATUTORY_CAP);
    taxableAmount = Math.max(0, gratuityAmount - STATUTORY_CAP);
  }

  const pieData = [
    { name: "Tax-Exempt Gratuity", value: Math.round(exemptAmount) },
    { name: "Taxable Gratuity", value: Math.round(taxableAmount) },
  ];

  const insights: string[] = [
    `Based on ${roundedYears} years of service at a last drawn salary of ₹${lastDrawnSalary.toLocaleString("en-IN")}, your gratuity is ₹${Math.round(gratuityAmount).toLocaleString("en-IN")}.`,
  ];

  if (isGovernmentEmployee) {
    insights.push("As a government employee, your entire gratuity amount is fully tax-exempt.");
  } else if (taxableAmount > 0) {
    insights.push(
      `Of this, ₹${Math.round(exemptAmount).toLocaleString("en-IN")} is tax-exempt under Section 10(10) (the ₹20 lakh statutory cap), and the remaining ₹${Math.round(taxableAmount).toLocaleString("en-IN")} is taxable as salary income.`
    );
  } else {
    insights.push("Your entire gratuity amount is within the ₹20 lakh tax-exempt limit under Section 10(10), so it's fully tax-free.");
  }

  insights.push(
    "Gratuity is generally payable only after 5 years of continuous service (with limited exceptions for death, disability, or certain fixed-term contracts under the new labour codes)."
  );

  return {
    outputs: {
      gratuityAmount: Math.round(gratuityAmount),
      exemptAmount: Math.round(exemptAmount),
      taxableAmount: Math.round(taxableAmount),
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
