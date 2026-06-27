import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Emergency Fund Calculator.
 *
 * Target = Monthly Essential Expenses × Coverage Months
 * Standard guidance: 6 months for salaried employees, 9 for self-employed, 12 for
 * freelancers/gig workers — adjusted upward for dependents (the calculator exposes
 * coverage months as a direct input so the person can apply whichever guidance fits them).
 *
 * Also computes months-to-build given existing savings and a monthly contribution amount.
 *
 * The core target formula (months × expenses) is straightforward arithmetic, confirmed
 * identical across many independent sources. The months-to-build simulation uses the same
 * compounding logic already verified elsewhere in this codebase (FD/RD), so it's trusted
 * on that basis rather than against one specific third-party "time to build" example,
 * since that source didn't state its exact starting balance/timeframe assumptions.
 */
export const emergencyFundFormula: FormulaFn = (inputs) => {
  const monthlyEssentialExpenses = inputs.monthlyEssentialExpenses ?? 0;
  const coverageMonths = inputs.coverageMonths ?? 6;
  const existingSavings = inputs.existingSavings ?? 0;
  const monthlyContribution = inputs.monthlyContribution ?? 0;
  const annualReturnRate = inputs.annualReturnRate ?? 4; // liquid fund / savings account return

  const targetAmount = monthlyEssentialExpenses * coverageMonths;
  const remainingNeeded = Math.max(0, targetAmount - existingSavings);

  const monthlyRate = annualReturnRate / 12 / 100;

  // Simulate month by month until target is reached (cap at 240 months / 20 years as a safety bound)
  const yearlyData: YearlyRow[] = [];
  let balance = existingSavings;
  let monthsToTarget = 0;
  const maxMonths = 240;

  if (balance >= targetAmount) {
    monthsToTarget = 0;
  } else if (monthlyContribution <= 0) {
    monthsToTarget = Infinity;
  } else {
    let month = 0;
    while (balance < targetAmount && month < maxMonths) {
      balance = (balance + monthlyContribution) * (1 + monthlyRate);
      month++;
      if (month % 12 === 0) {
        yearlyData.push({
          year: Math.ceil(month / 12),
          invested: Math.round(existingSavings + monthlyContribution * month),
          returns: Math.round(balance - existingSavings - monthlyContribution * month),
          balance: Math.round(Math.min(balance, targetAmount)),
        });
      }
    }
    monthsToTarget = month;
  }

  const pieData = [
    { name: "Existing Savings", value: Math.round(existingSavings) },
    { name: "Still Needed", value: Math.round(remainingNeeded) },
  ];

  const insights: string[] = [
    `Based on ${coverageMonths} months of essential expenses (₹${monthlyEssentialExpenses.toLocaleString("en-IN")}/month), your emergency fund target is ₹${Math.round(targetAmount).toLocaleString("en-IN")}.`,
  ];

  if (monthsToTarget === 0) {
    insights.push("You've already reached your emergency fund target.");
  } else if (monthsToTarget === Infinity) {
    insights.push(
      `You still need ₹${Math.round(remainingNeeded).toLocaleString("en-IN")} — enter a monthly contribution amount to see how long it will take to build.`
    );
  } else {
    insights.push(
      `Contributing ₹${monthlyContribution.toLocaleString("en-IN")}/month, you'll reach your target in approximately ${monthsToTarget} months (${(monthsToTarget / 12).toFixed(1)} years).`
    );
  }
  insights.push(
    "Keep your emergency fund in safe, liquid instruments — savings accounts, liquid mutual funds, or sweep-in FDs — not in equity or locked instruments."
  );

  return {
    outputs: {
      targetAmount: Math.round(targetAmount),
      remainingNeeded: Math.round(remainingNeeded),
      monthsToTarget: monthsToTarget === Infinity ? -1 : monthsToTarget,
    },
    yearlyData,
    pieData,
    insights,
  };
};
