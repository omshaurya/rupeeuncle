import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * PPF (Public Provident Fund) maturity calculator.
 *
 * This is an APPROXIMATION using the annuity-due formula (deposit made at the start of
 * each year, full year's interest applied):
 *   F = P × [((1 + i)^n − 1) / i] × (1 + i)
 * where P = annual contribution, i = annual interest rate (decimal), n = number of years.
 *
 * IMPORTANT — this does not exactly match real PPF accounts: actual PPF interest is
 * calculated MONTHLY on the lowest balance between the 5th and last day of each month,
 * then credited annually. That means the real maturity value depends on exactly which
 * day of the month/year each deposit is made (e.g. depositing on the 4th vs the 6th of
 * April changes that year's interest). For a ₹1,50,000/year deposit at 7.1% over 15 years,
 * this formula gives a result within ~0.5% of widely-cited reference figures (~₹40.47L) —
 * close enough for planning purposes, but the calculator UI should disclose that it's an
 * estimate, not bank-grade precision. A more exact version would need a monthly-balance
 * simulation driven by an assumed deposit date.
 *
 * Current rate: 7.1% p.a. (Q1 FY 2026-27, per Ministry of Finance quarterly announcement).
 * PPF rates are revised quarterly — verify the current rate before relying on this for
 * real decisions.
 */
export const ppfFormula: FormulaFn = (inputs) => {
  const annualContribution = inputs.annualContribution ?? 0;
  const interestRate = inputs.interestRate ?? 7.1;
  const tenureYears = inputs.tenureYears ?? 15;

  const i = interestRate / 100;

  const yearlyData: YearlyRow[] = [];
  let balance = 0;
  let totalInvested = 0;

  for (let year = 1; year <= tenureYears; year++) {
    balance = (balance + annualContribution) * (1 + i);
    totalInvested += annualContribution;

    yearlyData.push({
      year,
      invested: Math.round(totalInvested),
      returns: Math.round(balance - totalInvested),
      balance: Math.round(balance),
    });
  }

  const maturityAmount = Math.round(balance);
  const totalInvestedAmount = Math.round(totalInvested);
  const totalInterestEarned = maturityAmount - totalInvestedAmount;

  const pieData = [
    { name: "Total Invested", value: totalInvestedAmount },
    { name: "Interest Earned", value: totalInterestEarned },
  ];

  const insights: string[] = [
    `An annual PPF contribution of ₹${annualContribution.toLocaleString("en-IN")} at ${interestRate}% for ${tenureYears} years grows to approximately ₹${maturityAmount.toLocaleString("en-IN")}.`,
    "PPF interest and maturity amount are fully tax-exempt under the EEE (Exempt-Exempt-Exempt) status.",
    "This is an estimate. Real PPF interest is calculated monthly on your lowest balance between the 5th and last day of each month, so your actual maturity value depends on the exact dates you deposit.",
  ];
  if (tenureYears < 15) {
    insights.push(
      "Note: PPF has a mandatory 15-year lock-in period. This projection covers a shorter period than the standard minimum tenure."
    );
  }

  return {
    outputs: {
      maturityAmount,
      totalInvestedAmount,
      totalInterestEarned,
    },
    yearlyData,
    pieData,
    insights,
  };
};
