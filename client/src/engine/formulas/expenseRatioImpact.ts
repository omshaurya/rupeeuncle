import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Expense Ratio Impact Calculator.
 *
 * Isolates exactly how much a fund's expense ratio costs you over time, by comparing
 * the SAME SIP investment compounding at the gross return vs the net (post-expense)
 * return. Reuses the already-verified SIP annuity-due formula for both calculations —
 * the only new logic here is computing the DIFFERENCE and expressing it as "the cost of
 * the expense ratio" rather than just two independent projections (which is what the
 * Mutual Fund Comparison calculator already does for two different funds).
 */
export const expenseRatioImpactFormula: FormulaFn = (inputs) => {
  const monthlyInvestment = inputs.monthlyInvestment ?? 0;
  const grossAnnualReturn = inputs.grossAnnualReturn ?? 12;
  const expenseRatio = inputs.expenseRatio ?? 1;
  const investmentPeriodYears = inputs.investmentPeriodYears ?? 20;

  const netAnnualReturn = grossAnnualReturn - expenseRatio;

  function projectSip(annualReturn: number) {
    const monthlyRate = annualReturn / 12 / 100;
    const totalMonths = Math.round(investmentPeriodYears * 12);
    let balance = 0;
    for (let m = 1; m <= totalMonths; m++) {
      balance = (balance + monthlyInvestment) * (1 + monthlyRate);
    }
    return balance;
  }

  const grossValue = projectSip(grossAnnualReturn);
  const netValue = projectSip(netAnnualReturn);
  const costOfExpenseRatio = grossValue - netValue;

  const yearlyData: YearlyRow[] = [];
  for (let year = 1; year <= investmentPeriodYears; year++) {
    const monthsAtYear = year * 12;
    const grossMonthlyRate = grossAnnualReturn / 12 / 100;
    const netMonthlyRate = netAnnualReturn / 12 / 100;

    let grossBalance = 0;
    for (let m = 1; m <= monthsAtYear; m++) grossBalance = (grossBalance + monthlyInvestment) * (1 + grossMonthlyRate);
    let netBalance = 0;
    for (let m = 1; m <= monthsAtYear; m++) netBalance = (netBalance + monthlyInvestment) * (1 + netMonthlyRate);

    yearlyData.push({
      year,
      invested: Math.round(monthlyInvestment * monthsAtYear),
      returns: Math.round(grossBalance - netBalance), // cumulative cost of expense ratio at this year
      balance: Math.round(netBalance),
    });
  }

  const pieData = [
    { name: "Net Value (after expense ratio)", value: Math.round(netValue) },
    { name: "Cost of Expense Ratio", value: Math.round(costOfExpenseRatio) },
  ];

  const costAsPercentOfGross = grossValue > 0 ? (costOfExpenseRatio / grossValue) * 100 : 0;

  const insights: string[] = [
    `A ${expenseRatio}% expense ratio costs you ₹${Math.round(costOfExpenseRatio).toLocaleString("en-IN")} over ${investmentPeriodYears} years — that's ${costAsPercentOfGross.toFixed(1)}% of what your corpus would have been at the gross return.`,
    `At the gross return (${grossAnnualReturn}%), your corpus would be ₹${Math.round(grossValue).toLocaleString("en-IN")}. At the net return (${netAnnualReturn.toFixed(2)}%, after the expense ratio), it's ₹${Math.round(netValue).toLocaleString("en-IN")}.`,
    "Expense ratio is charged every year regardless of fund performance, so its cost compounds the same way returns do — small annual differences become large absolute amounts over long horizons.",
  ];

  return {
    outputs: {
      grossValue: Math.round(grossValue),
      netValue: Math.round(netValue),
      costOfExpenseRatio: Math.round(costOfExpenseRatio),
    },
    yearlyData,
    pieData,
    insights,
  };
};
