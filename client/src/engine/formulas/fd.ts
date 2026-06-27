import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Fixed Deposit (FD) maturity calculator.
 *
 * Standard compound interest formula for FDs (quarterly compounding, the convention
 * most Indian banks use):
 *   A = P × (1 + r/n)^(n×t)
 * where:
 *   P = principal deposit
 *   r = annual interest rate (decimal)
 *   n = compounding frequency per year (4 for quarterly)
 *   t = tenure in years
 */
export const fdFormula: FormulaFn = (inputs) => {
  const principal = inputs.principal ?? 0;
  const annualInterestRate = inputs.annualInterestRate ?? 0;
  const tenureYears = inputs.tenureYears ?? 0;
  const compoundingFrequency = inputs.compoundingFrequency ?? 4; // quarterly default

  const r = annualInterestRate / 100;
  const n = compoundingFrequency;

  const yearlyData: YearlyRow[] = [];
  const wholeYears = Math.ceil(tenureYears);

  for (let year = 1; year <= wholeYears; year++) {
    const t = Math.min(year, tenureYears);
    const balance = principal * Math.pow(1 + r / n, n * t);
    yearlyData.push({
      year,
      invested: Math.round(principal),
      returns: Math.round(balance - principal),
      balance: Math.round(balance),
    });
  }

  const maturityAmount = Math.round(
    principal * Math.pow(1 + r / n, n * tenureYears)
  );
  const totalInterest = maturityAmount - Math.round(principal);

  const pieData = [
    { name: "Principal Amount", value: Math.round(principal) },
    { name: "Interest Earned", value: totalInterest },
  ];

  const insights: string[] = [
    `A deposit of ₹${principal.toLocaleString("en-IN")} at ${annualInterestRate}% per annum (compounded quarterly) grows to ₹${maturityAmount.toLocaleString("en-IN")} in ${tenureYears} years.`,
    `Total interest earned: ₹${totalInterest.toLocaleString("en-IN")}.`,
  ];

  return {
    outputs: {
      maturityAmount,
      totalInterest,
      principalAmount: Math.round(principal),
    },
    yearlyData,
    pieData,
    insights,
  };
};
