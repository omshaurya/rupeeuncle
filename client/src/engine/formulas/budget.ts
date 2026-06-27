import type { FormulaFn } from "../../types/calculator";

/**
 * Budget Calculator — 50/30/20 Rule.
 *
 * A widely-used budgeting framework (popularized by Senator Elizabeth Warren's book
 * "All Your Worth", and commonly adapted by Indian financial advisors):
 *   50% of take-home income → Needs (rent, groceries, utilities, EMIs, insurance)
 *   30% → Wants (dining out, entertainment, shopping, travel)
 *   20% → Savings & Debt Repayment (investments, emergency fund, extra loan payments)
 *
 * This calculator shows the recommended allocation and compares it against the person's
 * actual spending across the same three categories.
 */
export const budgetFormula: FormulaFn = (inputs) => {
  const monthlyIncome = inputs.monthlyIncome ?? 0;
  const actualNeeds = inputs.actualNeeds ?? 0;
  const actualWants = inputs.actualWants ?? 0;
  const actualSavings = inputs.actualSavings ?? 0;

  const recommendedNeeds = monthlyIncome * 0.5;
  const recommendedWants = monthlyIncome * 0.3;
  const recommendedSavings = monthlyIncome * 0.2;

  const actualTotal = actualNeeds + actualWants + actualSavings;
  const unallocated = monthlyIncome - actualTotal;

  const pieData = [
    { name: "Needs (Actual)", value: Math.round(actualNeeds) },
    { name: "Wants (Actual)", value: Math.round(actualWants) },
    { name: "Savings (Actual)", value: Math.round(actualSavings) },
  ];

  const insights: string[] = [];
  const needsPercent = monthlyIncome > 0 ? (actualNeeds / monthlyIncome) * 100 : 0;
  const wantsPercent = monthlyIncome > 0 ? (actualWants / monthlyIncome) * 100 : 0;
  const savingsPercent = monthlyIncome > 0 ? (actualSavings / monthlyIncome) * 100 : 0;

  insights.push(
    `Your current split is ${needsPercent.toFixed(0)}% needs, ${wantsPercent.toFixed(0)}% wants, ${savingsPercent.toFixed(0)}% savings — compared to the recommended 50/30/20 split.`
  );

  if (savingsPercent < 20) {
    insights.push(
      `You're saving ${(20 - savingsPercent).toFixed(0)} percentage points below the recommended 20%. Consider trimming discretionary spending to close this gap.`
    );
  } else {
    insights.push("You're meeting or exceeding the recommended 20% savings rate — well done.");
  }

  if (unallocated < 0) {
    insights.push(
      `Your actual spending exceeds your income by ₹${Math.round(Math.abs(unallocated)).toLocaleString("en-IN")} per month — this is a deficit that needs attention.`
    );
  }

  return {
    outputs: {
      recommendedSavings: Math.round(recommendedSavings),
      actualSavings: Math.round(actualSavings),
      unallocated: Math.round(unallocated),
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
