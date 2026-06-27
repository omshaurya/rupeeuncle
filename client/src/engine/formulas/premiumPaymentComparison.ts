import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Insurance Premium Payment Mode Comparison (Single vs Regular Pay).
 *
 * This does NOT calculate what your premium should be (no public formula exists for
 * that — see termInsuranceCoverage.ts and healthInsuranceCoverage.ts for that discussion).
 * Instead, it takes premium quotes YOU ALREADY HAVE from an insurer (for single-pay and
 * regular-pay versions of the same coverage) and compares their true cost using
 * present-value discounting, since "regular pay costs more in total" is misleading
 * without accounting for the time value of money — money paid later is worth less today.
 *
 *   PV of regular premiums = Σ [Annual Premium / (1 + discount_rate)^year] for each year paid
 *   Compare against the single premium paid today (already in present-value terms by definition)
 *
 * This reuses the same present-value discounting logic already verified in
 * presentValue.ts, applied to a stream of payments rather than a single future sum.
 */
export const premiumPaymentComparisonFormula: FormulaFn = (inputs) => {
  const singlePremium = inputs.singlePremium ?? 0;
  const annualRegularPremium = inputs.annualRegularPremium ?? 0;
  const premiumPayingYears = inputs.premiumPayingYears ?? 20;
  const discountRate = inputs.discountRate ?? 7; // opportunity cost of capital / expected investment return

  const r = discountRate / 100;

  let presentValueOfRegularPremiums = 0;
  const yearlyData: YearlyRow[] = [];
  let cumulativeNominal = 0;
  let cumulativePV = 0;

  for (let year = 1; year <= premiumPayingYears; year++) {
    const pvThisYear = annualRegularPremium / Math.pow(1 + r, year);
    presentValueOfRegularPremiums += pvThisYear;
    cumulativeNominal += annualRegularPremium;
    cumulativePV += pvThisYear;

    yearlyData.push({
      year,
      invested: Math.round(cumulativeNominal),
      returns: 0,
      balance: Math.round(cumulativePV),
    });
  }

  const totalNominalRegularPremiums = annualRegularPremium * premiumPayingYears;
  const difference = presentValueOfRegularPremiums - singlePremium;
  const cheaperOption = difference > 0 ? "Single Pay" : "Regular Pay";

  const pieData = [
    { name: "Single Premium (today)", value: Math.round(singlePremium) },
    { name: "Regular Premiums (present value)", value: Math.round(presentValueOfRegularPremiums) },
  ];

  const insights: string[] = [
    `In nominal terms, you'd pay ₹${totalNominalRegularPremiums.toLocaleString("en-IN")} total under regular pay vs ₹${singlePremium.toLocaleString("en-IN")} for single pay — but nominal totals are misleading since regular-pay money is spread over time.`,
    `In present-value terms (discounting future payments at ${discountRate}%), regular pay actually costs ₹${Math.round(presentValueOfRegularPremiums).toLocaleString("en-IN")} in today's money — making ${cheaperOption} the better deal by ₹${Math.round(Math.abs(difference)).toLocaleString("en-IN")} once you account for the time value of money.`,
    "This calculator only compares cost — it doesn't account for opportunity cost of locking up a lump sum, liquidity needs, or the discipline benefit of regular payments. Use the Goal Planning calculator to see what the lump sum could earn if invested instead of paid as a single premium.",
  ];

  return {
    outputs: {
      totalNominalRegularPremiums: Math.round(totalNominalRegularPremiums),
      presentValueOfRegularPremiums: Math.round(presentValueOfRegularPremiums),
      singlePremium: Math.round(singlePremium),
    },
    yearlyData,
    pieData,
    insights,
  };
};
