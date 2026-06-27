import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Goal Planning Calculator — generic version of the FIRE calculator's "solve for required
 * SIP" logic, applicable to any named goal (house down payment, child's education, wedding,
 * world trip, etc.) rather than retirement specifically.
 *
 * Given a target amount, time horizon, expected return, and any existing savings already
 * earmarked for the goal, solves for the required monthly SIP using the inverse of the
 * standard SIP future-value formula (same math as FIRE's solver, which was verified by
 * confirming it reproduces the exact target when plugged back into the forward formula).
 */
export const goalPlanningFormula: FormulaFn = (inputs) => {
  const targetAmount = inputs.targetAmount ?? 0;
  const yearsToGoal = inputs.yearsToGoal ?? 1;
  const expectedReturnRate = inputs.expectedReturnRate ?? 12;
  const existingSavings = inputs.existingSavings ?? 0;
  const inflationRate = inputs.inflationRate ?? 0; // optional: inflate the target itself

  const inflatedTarget = targetAmount * Math.pow(1 + inflationRate / 100, yearsToGoal);

  const monthlyRate = expectedReturnRate / 12 / 100;
  const totalMonths = Math.round(yearsToGoal * 12);

  const futureValueOfExisting = existingSavings * Math.pow(1 + expectedReturnRate / 100, yearsToGoal);
  const remainingNeeded = Math.max(0, inflatedTarget - futureValueOfExisting);

  let requiredMonthlySip = 0;
  if (totalMonths > 0 && monthlyRate > 0) {
    const factor = ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    requiredMonthlySip = remainingNeeded / factor;
  } else if (totalMonths > 0) {
    requiredMonthlySip = remainingNeeded / totalMonths;
  }

  const yearlyData: YearlyRow[] = [];
  let balance = existingSavings;
  let totalInvested = existingSavings;
  for (let month = 1; month <= totalMonths; month++) {
    balance = (balance + requiredMonthlySip) * (1 + monthlyRate);
    totalInvested += requiredMonthlySip;
    if (month % 12 === 0 || month === totalMonths) {
      yearlyData.push({
        year: Math.ceil(month / 12),
        invested: Math.round(totalInvested),
        returns: Math.round(balance - totalInvested),
        balance: Math.round(balance),
      });
    }
  }

  const pieData = [
    { name: "Existing Savings (Future Value)", value: Math.round(futureValueOfExisting) },
    { name: "Additional Corpus Needed", value: Math.round(remainingNeeded) },
  ];

  const insights: string[] = [
    `To reach your goal of ₹${Math.round(inflatedTarget).toLocaleString("en-IN")}${inflationRate > 0 ? " (inflation-adjusted)" : ""} in ${yearsToGoal} years, invest approximately ₹${Math.round(requiredMonthlySip).toLocaleString("en-IN")} per month at an assumed ${expectedReturnRate}% annual return.`,
  ];
  if (existingSavings > 0) {
    insights.push(
      `Your existing savings of ₹${existingSavings.toLocaleString("en-IN")} will grow to approximately ₹${Math.round(futureValueOfExisting).toLocaleString("en-IN")} by then, covering part of the goal.`
    );
  }

  return {
    outputs: {
      inflatedTarget: Math.round(inflatedTarget),
      requiredMonthlySip: Math.round(requiredMonthlySip),
      remainingNeeded: Math.round(remainingNeeded),
    },
    yearlyData,
    pieData,
    insights,
  };
};
