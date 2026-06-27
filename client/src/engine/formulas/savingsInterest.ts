import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Savings Account Interest Calculator.
 *
 * Real banks calculate interest daily on closing balance and credit it quarterly. This
 * calculator simplifies that to standard quarterly compounding on a constant average
 * balance (the same convention used by most public-facing savings interest calculators
 * and consistent with the FD calculator's compounding approach) — full daily-balance
 * simulation would require day-by-day transaction history, which this MVP doesn't model.
 *
 *   A = P × (1 + r/4)^(4×t)
 *
 * Also computes the taxable portion under Section 80TTA (₹10,000 exemption for non-seniors)
 * or Section 80TTB (₹50,000 exemption for senior citizens) — interest beyond that
 * threshold is added to taxable income at the individual's slab rate.
 */
export const savingsInterestFormula: FormulaFn = (inputs) => {
  const averageBalance = inputs.averageBalance ?? 0;
  const annualInterestRate = inputs.annualInterestRate ?? 3;
  const tenureYears = inputs.tenureYears ?? 1;
  const isSeniorCitizen = (inputs.isSeniorCitizen ?? 0) === 1;

  const r = annualInterestRate / 100;
  const n = 4; // quarterly compounding

  const yearlyData: YearlyRow[] = [];
  const wholeYears = Math.ceil(tenureYears);

  for (let year = 1; year <= wholeYears; year++) {
    const t = Math.min(year, tenureYears);
    const balance = averageBalance * Math.pow(1 + r / n, n * t);
    yearlyData.push({
      year,
      invested: Math.round(averageBalance),
      returns: Math.round(balance - averageBalance),
      balance: Math.round(balance),
    });
  }

  const finalBalance = averageBalance * Math.pow(1 + r / n, n * tenureYears);
  const totalInterestEarned = Math.round(finalBalance - averageBalance);

  const exemptionLimit = isSeniorCitizen ? 50000 : 10000;
  const taxableInterest = Math.max(0, totalInterestEarned - exemptionLimit);
  const exemptInterest = totalInterestEarned - taxableInterest;

  const pieData = [
    { name: "Exempt Interest", value: exemptInterest },
    { name: "Taxable Interest", value: taxableInterest },
  ];

  const insights: string[] = [
    `On an average balance of ₹${averageBalance.toLocaleString("en-IN")} at ${annualInterestRate}% for ${tenureYears} year(s), you'd earn approximately ₹${totalInterestEarned.toLocaleString("en-IN")} in interest.`,
    `Under Section ${isSeniorCitizen ? "80TTB" : "80TTA"}, the first ₹${exemptionLimit.toLocaleString("en-IN")} of savings interest is tax-exempt${taxableInterest > 0 ? `; the remaining ₹${taxableInterest.toLocaleString("en-IN")} is added to your taxable income` : ""}.`,
    "This is a simplified estimate using quarterly compounding on a constant average balance. Real banks calculate interest daily on your actual closing balance each day, so your real returns will vary based on how your balance fluctuates.",
  ];

  return {
    outputs: {
      totalInterestEarned,
      taxableInterest,
      maturityAmount: Math.round(finalBalance),
    },
    yearlyData,
    pieData,
    insights,
  };
};
