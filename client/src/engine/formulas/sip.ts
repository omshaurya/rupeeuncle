import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * SIP (Systematic Investment Plan) future value calculator.
 *
 * Standard SIP future value formula (ordinary annuity, compounded monthly):
 *   FV = P × [ ((1 + i)^n − 1) / i ] × (1 + i)
 * where:
 *   P = monthly investment amount
 *   i = monthly rate of return (annual rate / 12 / 100)
 *   n = number of months (years × 12)
 *
 * The (1 + i) tail multiplier accounts for the fact that each SIP installment
 * is invested at the START of the month (standard convention used by Indian AMCs).
 */
export const sipFormula: FormulaFn = (inputs) => {
  const monthlyInvestment = inputs.monthlyInvestment ?? 0;
  const annualReturnRate = inputs.annualReturnRate ?? 0;
  const investmentPeriodYears = inputs.investmentPeriodYears ?? 0;

  const monthlyRate = annualReturnRate / 12 / 100;
  const totalMonths = Math.round(investmentPeriodYears * 12);

  const yearlyData: YearlyRow[] = [];
  let balance = 0;
  let totalInvested = 0;

  for (let month = 1; month <= totalMonths; month++) {
    // Invest at start of month, then it earns interest for that month
    balance = (balance + monthlyInvestment) * (1 + monthlyRate);
    totalInvested += monthlyInvestment;

    if (month % 12 === 0 || month === totalMonths) {
      const year = Math.ceil(month / 12);
      yearlyData.push({
        year,
        invested: Math.round(totalInvested),
        returns: Math.round(balance - totalInvested),
        balance: Math.round(balance),
      });
    }
  }

  const maturityAmount = Math.round(balance);
  const totalInvestedAmount = Math.round(totalInvested);
  const estimatedReturns = maturityAmount - totalInvestedAmount;

  const pieData = [
    { name: "Total Invested", value: totalInvestedAmount },
    { name: "Estimated Returns", value: estimatedReturns },
  ];

  const insights: string[] = [];
  if (estimatedReturns > totalInvestedAmount) {
    insights.push(
      `Your estimated returns (₹${estimatedReturns.toLocaleString("en-IN")}) exceed your total invested amount — the power of compounding over ${investmentPeriodYears} years.`
    );
  }
  insights.push(
    `Investing ₹${monthlyInvestment.toLocaleString("en-IN")} every month at an assumed ${annualReturnRate}% annual return grows to ₹${maturityAmount.toLocaleString("en-IN")} in ${investmentPeriodYears} years.`
  );

  return {
    outputs: {
      maturityAmount,
      totalInvestedAmount,
      estimatedReturns,
    },
    yearlyData,
    pieData,
    insights,
  };
};
