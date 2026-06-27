import type { FormulaFn } from "../../types/calculator";

/**
 * Human Life Value (HLV) Calculator — Income Replacement Method.
 *
 * Simple (nominal) version, used by most insurer calculators for quick estimates:
 *   HLV = (Annual Income − Personal Expenses) × Remaining Working Years
 *
 * Present-value version (more accurate — accounts for the time value of money, since a
 * rupee needed in year 20 is worth less today than a rupee needed next year):
 *   HLV = (Annual Income − Personal Expenses) × [(1 − (1+r)^−n) / r]
 * where r = discount/inflation rate, n = remaining working years. This is the present
 * value of a growing-or-flat annuity — the same annuity math used elsewhere in personal
 * finance calculators, just applied to a future income stream instead of a savings goal.
 *
 * Verified the simple method against IndiaFirst Life's published example: age 35, income
 * ₹10L, retirement at 60 → (60−35) × 10,00,000 = ₹2.5 crore. Matched exactly. The
 * present-value version was cross-checked against DealPlexus's stated approach (their
 * exact worked numbers weren't independently reproducible without their precise inflation
 * assumption, but the PV-annuity formula itself is standard and already used correctly
 * elsewhere in this codebase for goal-planning calculations).
 */
export const humanLifeValueFormula: FormulaFn = (inputs) => {
  const annualIncome = inputs.annualIncome ?? 0;
  const personalExpenses = inputs.personalExpenses ?? 0;
  const currentAge = inputs.currentAge ?? 30;
  const retirementAge = inputs.retirementAge ?? 60;
  const existingSavingsAndCover = inputs.existingSavingsAndCover ?? 0;
  const outstandingLiabilities = inputs.outstandingLiabilities ?? 0;
  const discountRate = inputs.discountRate ?? 6; // 0 = use simple nominal method

  const netIncomeForFamily = Math.max(0, annualIncome - personalExpenses);
  const remainingWorkingYears = Math.max(0, retirementAge - currentAge);

  let hlvBeforeAdjustments: number;
  if (discountRate > 0 && remainingWorkingYears > 0) {
    const r = discountRate / 100;
    hlvBeforeAdjustments =
      netIncomeForFamily * ((1 - Math.pow(1 + r, -remainingWorkingYears)) / r);
  } else {
    hlvBeforeAdjustments = netIncomeForFamily * remainingWorkingYears;
  }

  const recommendedCover = Math.max(
    0,
    hlvBeforeAdjustments + outstandingLiabilities - existingSavingsAndCover
  );

  const pieData = [
    { name: "Income Replacement Need", value: Math.round(hlvBeforeAdjustments) },
    { name: "Outstanding Liabilities", value: Math.round(outstandingLiabilities) },
    { name: "Less: Existing Savings/Cover", value: -Math.round(existingSavingsAndCover) },
  ];

  const insights: string[] = [
    `Based on the income replacement method, your family would need approximately ₹${Math.round(hlvBeforeAdjustments).toLocaleString("en-IN")} to maintain their current standard of living over your remaining ${remainingWorkingYears} working years.`,
    `After adding outstanding liabilities and subtracting existing savings/cover, your recommended additional life insurance cover is ₹${Math.round(recommendedCover).toLocaleString("en-IN")}.`,
  ];

  if (discountRate > 0) {
    insights.push(
      "This uses present-value discounting, which gives a more realistic (and typically lower) number than simply multiplying income by years, since money needed decades from now is worth less in today's terms."
    );
  }

  return {
    outputs: {
      hlvBeforeAdjustments: Math.round(hlvBeforeAdjustments),
      recommendedCover: Math.round(recommendedCover),
      remainingWorkingYears,
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
