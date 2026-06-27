import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Mutual Fund Comparison Calculator.
 *
 * Compares two funds' projected SIP outcomes side by side, using the same already-verified
 * SIP future-value formula (annuity-due convention) applied twice with different assumed
 * return rates and expense ratios. The expense ratio is netted out of the gross return
 * before compounding, since that's the return an investor actually receives.
 */
export const mutualFundComparisonFormula: FormulaFn = (inputs) => {
  const monthlyInvestment = inputs.monthlyInvestment ?? 0;
  const investmentPeriodYears = inputs.investmentPeriodYears ?? 10;
  const fundAReturnRate = inputs.fundAReturnRate ?? 12;
  const fundAExpenseRatio = inputs.fundAExpenseRatio ?? 1;
  const fundBReturnRate = inputs.fundBReturnRate ?? 10;
  const fundBExpenseRatio = inputs.fundBExpenseRatio ?? 0.5;

  const netReturnA = fundAReturnRate - fundAExpenseRatio;
  const netReturnB = fundBReturnRate - fundBExpenseRatio;

  function projectFund(netAnnualReturn: number) {
    const monthlyRate = netAnnualReturn / 12 / 100;
    const totalMonths = Math.round(investmentPeriodYears * 12);
    let balance = 0;
    for (let m = 1; m <= totalMonths; m++) {
      balance = (balance + monthlyInvestment) * (1 + monthlyRate);
    }
    return balance;
  }

  const fundAFinalValue = projectFund(netReturnA);
  const fundBFinalValue = projectFund(netReturnB);
  const totalInvested = monthlyInvestment * Math.round(investmentPeriodYears * 12);

  const yearlyData: YearlyRow[] = [];
  for (let year = 1; year <= investmentPeriodYears; year++) {
    const monthsAtYear = year * 12;
    const monthlyRateA = netReturnA / 12 / 100;
    const monthlyRateB = netReturnB / 12 / 100;

    let balanceA = 0;
    for (let m = 1; m <= monthsAtYear; m++) balanceA = (balanceA + monthlyInvestment) * (1 + monthlyRateA);
    let balanceB = 0;
    for (let m = 1; m <= monthsAtYear; m++) balanceB = (balanceB + monthlyInvestment) * (1 + monthlyRateB);

    yearlyData.push({
      year,
      invested: Math.round(monthlyInvestment * monthsAtYear),
      returns: Math.round(balanceA - balanceB), // difference, used as a custom column
      balance: Math.round(balanceA),
      fundBBalance: Math.round(balanceB),
    });
  }

  const difference = fundAFinalValue - fundBFinalValue;
  const betterFund = difference >= 0 ? "Fund A" : "Fund B";

  const pieData = [
    { name: "Fund A Final Value", value: Math.round(fundAFinalValue) },
    { name: "Fund B Final Value", value: Math.round(fundBFinalValue) },
  ];

  const insights: string[] = [
    `After ${investmentPeriodYears} years, Fund A (${fundAReturnRate}% gross, ${fundAExpenseRatio}% expense ratio) projects to ₹${Math.round(fundAFinalValue).toLocaleString("en-IN")}, while Fund B (${fundBReturnRate}% gross, ${fundBExpenseRatio}% expense ratio) projects to ₹${Math.round(fundBFinalValue).toLocaleString("en-IN")}.`,
    `${betterFund} is projected to perform better by ₹${Math.abs(Math.round(difference)).toLocaleString("en-IN")} based on these assumptions.`,
    "Past or assumed returns don't guarantee future performance. Expense ratio is just one factor — also compare fund manager track record, portfolio composition, and risk profile before choosing.",
  ];

  return {
    outputs: {
      fundAFinalValue: Math.round(fundAFinalValue),
      fundBFinalValue: Math.round(fundBFinalValue),
      totalInvested: Math.round(totalInvested),
    },
    yearlyData,
    pieData,
    insights,
  };
};
