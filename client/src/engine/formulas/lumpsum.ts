import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Lumpsum Investment Calculator.
 *
 * A single one-time investment grows via compound interest:
 *   FV = P × (1 + r)^n
 * where P = principal (one-time investment), r = annual rate of return (decimal),
 * n = number of years.
 *
 * This is the simplest possible compounding formula — used as the baseline reference
 * for comparing against SIP (regular contributions) in investment planning content.
 */
export const lumpsumFormula: FormulaFn = (inputs) => {
  const investmentAmount = inputs.investmentAmount ?? 0;
  const annualReturnRate = inputs.annualReturnRate ?? 0;
  const investmentPeriodYears = inputs.investmentPeriodYears ?? 0;

  const r = annualReturnRate / 100;

  const yearlyData: YearlyRow[] = [];
  const wholeYears = Math.ceil(investmentPeriodYears);

  for (let year = 1; year <= wholeYears; year++) {
    const t = Math.min(year, investmentPeriodYears);
    const balance = investmentAmount * Math.pow(1 + r, t);
    yearlyData.push({
      year,
      invested: Math.round(investmentAmount),
      returns: Math.round(balance - investmentAmount),
      balance: Math.round(balance),
    });
  }

  const maturityAmount = Math.round(
    investmentAmount * Math.pow(1 + r, investmentPeriodYears)
  );
  const estimatedReturns = maturityAmount - Math.round(investmentAmount);

  const pieData = [
    { name: "Investment Amount", value: Math.round(investmentAmount) },
    { name: "Estimated Returns", value: estimatedReturns },
  ];

  const insights: string[] = [
    `A one-time investment of ₹${investmentAmount.toLocaleString("en-IN")} at ${annualReturnRate}% annual return grows to ₹${maturityAmount.toLocaleString("en-IN")} in ${investmentPeriodYears} years.`,
    `That's ${(maturityAmount / Math.max(investmentAmount, 1)).toFixed(2)}x your original investment.`,
  ];

  return {
    outputs: {
      investmentAmount: Math.round(investmentAmount),
      estimatedReturns,
      maturityAmount,
    },
    yearlyData,
    pieData,
    insights,
  };
};
