import type { FormulaFn } from "../../types/calculator";

/**
 * Health Insurance Coverage Calculator.
 *
 * IMPORTANT — HONEST SCOPE LIMITATION: like term insurance, health insurance PREMIUMS
 * are set by each insurer's own actuarial risk models — multiple independent sources
 * confirm there is no single public formula, and identical coverage can vary 20-40% in
 * premium between insurers depending on their claims experience and risk appetite. This
 * calculator does NOT estimate premiums for that reason.
 *
 * Instead, it estimates a RECOMMENDED SUM INSURED using benchmarks that converge across
 * multiple independent sources (sum.money, Algates Insurance, Your Health Magazine):
 *   - City tier sets a base cover per adult (metro highest, tier-2 ~50% lower, tier-3 ~60-70% lower)
 *   - Income check: recommended cover should be at least 3-5x annual income (medical
 *     inflation runs 12-14% per year in India, much faster than general inflation)
 *   - Chronic conditions warrant a 50% uplift on the base recommendation
 *   - Family floater plans scale the per-adult base by family size, not by simple addition
 *     (floaters are typically priced for shared risk, not summed individual covers)
 */
export const healthInsuranceCoverageFormula: FormulaFn = (inputs) => {
  const annualIncome = inputs.annualIncome ?? 0;
  const cityTier = inputs.cityTier ?? 1; // 1 = metro, 2 = tier-2, 3 = tier-3
  const familySize = inputs.familySize ?? 1;
  const hasChronicCondition = (inputs.hasChronicCondition ?? 0) === 1;

  // Base per-adult cover by city tier (metro baseline ₹10L, scaled down for smaller cities)
  const baseCoverByTier: Record<number, number> = { 1: 1000000, 2: 500000, 3: 350000 };
  const basePerAdult = baseCoverByTier[cityTier] ?? 1000000;

  // Family floater scaling: not a simple per-person sum, since floaters pool risk —
  // common convention is base + 50% of base per additional member
  const familyFloaterBase = basePerAdult * (1 + Math.max(0, familySize - 1) * 0.5);

  const incomeBasedMinimum = annualIncome * 3;
  let recommendedCover = Math.max(familyFloaterBase, incomeBasedMinimum);

  if (hasChronicCondition) {
    recommendedCover *= 1.5;
  }

  // Cap at a practical ceiling for premium reasons, per the sum.money convention
  recommendedCover = Math.min(recommendedCover, 10000000);

  const superTopUpRecommended = recommendedCover * 2;

  const pieData = [
    { name: "Base Floater Cover", value: Math.round(familyFloaterBase) },
    { name: "Income-Based Adjustment", value: Math.round(Math.max(0, recommendedCover - familyFloaterBase)) },
  ];

  const insights: string[] = [
    `Based on your city tier and family size, your recommended base sum insured is ₹${Math.round(recommendedCover).toLocaleString("en-IN")}.`,
    `Consider a super top-up plan of ₹${Math.round(superTopUpRecommended).toLocaleString("en-IN")} on top of this base cover for protection against high-cost hospitalizations, at a fraction of the cost of an equivalent standalone policy.`,
    "This is a coverage-need estimate, not a premium quote. Actual premiums are set by each insurer's own underwriting (age, medical history, city, sum insured, add-ons) and can vary 20-40% between insurers for identical coverage — there's no universal public formula. Get actual quotes directly from insurers for premium comparison.",
  ];

  if (hasChronicCondition) {
    insights.push(
      "Cover has been increased by 50% to account for a pre-existing chronic condition, though actual premium loading for PEDs varies significantly by insurer and condition."
    );
  }

  return {
    outputs: {
      recommendedCover: Math.round(recommendedCover),
      superTopUpRecommended: Math.round(superTopUpRecommended),
      totalRecommendedProtection: Math.round(recommendedCover + superTopUpRecommended),
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
