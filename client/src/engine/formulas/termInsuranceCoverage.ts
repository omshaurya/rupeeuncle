import type { FormulaFn } from "../../types/calculator";

/**
 * Term Insurance Coverage Calculator.
 *
 * IMPORTANT — HONEST SCOPE LIMITATION: Real term insurance PREMIUMS are calculated by
 * each insurer using proprietary actuarial mortality tables, medical underwriting, and
 * risk-pricing models — there is no public formula to verify a premium against, unlike
 * every other calculator in this codebase. Every insurer's actual calculator requires
 * their own backend pricing engine. Building a fake "premium formula" here would produce
 * a number with false precision that could mislead a real insurance decision, so this
 * calculator deliberately does NOT estimate premiums.
 *
 * Instead, this calculates the RECOMMENDED SUM ASSURED (coverage amount) using the
 * industry-standard income-multiplier rule of thumb, cross-referenced across many
 * insurers (Policybazaar, Kotak, Canara HSBC, Bandhan Life, Axis Max Life all independently
 * cite the same 10-20x annual income range, adjusted for dependents and liabilities):
 *   Recommended Cover = (Annual Income × Multiplier) + Outstanding Liabilities − Existing Assets
 *
 * For an actuarially-grounded estimate (rather than a rule of thumb), use the Human Life
 * Value calculator elsewhere on this site, which models the present value of your income
 * stream directly.
 */
export const termInsuranceCoverageFormula: FormulaFn = (inputs) => {
  const annualIncome = inputs.annualIncome ?? 0;
  const incomeMultiplier = inputs.incomeMultiplier ?? 15;
  const outstandingLiabilities = inputs.outstandingLiabilities ?? 0;
  const existingCoverAndAssets = inputs.existingCoverAndAssets ?? 0;
  const numberOfDependents = inputs.numberOfDependents ?? 2;

  const baseCover = annualIncome * incomeMultiplier;
  const totalNeed = baseCover + outstandingLiabilities;
  const recommendedCover = Math.max(0, totalNeed - existingCoverAndAssets);

  const pieData = [
    { name: "Income Replacement", value: Math.round(baseCover) },
    { name: "Outstanding Liabilities", value: Math.round(outstandingLiabilities) },
  ];

  const insights: string[] = [
    `Based on a ${incomeMultiplier}x income multiplier, your recommended term insurance cover is ₹${Math.round(recommendedCover).toLocaleString("en-IN")}.`,
    `With ${numberOfDependents} dependent(s), consider whether you need to lean toward the higher end of the typical 10-20x range used across Indian insurers.`,
    "This is a rule-of-thumb estimate, not a premium quote. Actual premiums depend on each insurer's own underwriting — age, gender, health, smoking status, occupation, and policy features all affect pricing, and there's no universal public formula. Use the Human Life Value calculator for a more precise, income-based coverage estimate, and get actual premium quotes directly from insurers.",
  ];

  return {
    outputs: {
      baseCover: Math.round(baseCover),
      recommendedCover: Math.round(recommendedCover),
      totalNeed: Math.round(totalNeed),
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
