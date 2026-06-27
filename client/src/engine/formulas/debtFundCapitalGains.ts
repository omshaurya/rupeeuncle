import type { FormulaFn } from "../../types/calculator";

/**
 * Debt Mutual Fund Capital Gains Calculator.
 *
 * Rules depend entirely on WHEN the units were purchased — there's a hard cutoff that
 * changes the tax treatment completely, not just the rate:
 *
 *   Units purchased ON OR AFTER 1 April 2023:
 *     ALL gains (regardless of holding period) are taxed at the investor's income slab
 *     rate. No LTCG/STCG distinction exists for these units at all — this was a deliberate
 *     2023 Budget change to remove debt funds' previous tax advantage over FDs.
 *
 *   Units purchased BEFORE 1 April 2023:
 *     The OLD rules still apply to these specific units:
 *       - Held > 36 months: LTCG taxed at 20% WITH indexation benefit
 *       - Held ≤ 36 months: STCG taxed at slab rate
 *
 * This is a genuinely different shape from equity or real estate calculators — the
 * purchase date itself determines which entire rule set applies, not just the rate.
 */
export const debtFundCapitalGainsFormula: FormulaFn = (inputs) => {
  const purchasePrice = inputs.purchasePrice ?? 0;
  const salePrice = inputs.salePrice ?? 0;
  const holdingPeriodMonths = inputs.holdingPeriodMonths ?? 12;
  const purchasedAfterApril2023 = (inputs.purchasedAfterApril2023 ?? 1) === 1;
  const slabRate = inputs.slabRate ?? 30;
  const ciiAtPurchase = inputs.ciiAtPurchase ?? 317;
  const ciiAtSale = inputs.ciiAtSale ?? 363;

  const totalGain = salePrice - purchasePrice;

  let taxAmount = 0;
  let ruleApplied = "";

  if (totalGain <= 0) {
    taxAmount = 0;
    ruleApplied = "Loss — no tax";
  } else if (purchasedAfterApril2023) {
    // No LTCG/STCG distinction at all for post-April-2023 units — always slab rate
    taxAmount = totalGain * (slabRate / 100);
    ruleApplied = `Slab rate (${slabRate}%) — units purchased on/after 1 April 2023 have no LTCG benefit regardless of holding period`;
  } else if (holdingPeriodMonths > 36) {
    // Old rules: LTCG with indexation for pre-April-2023 units held > 36 months
    const indexedPurchasePrice = purchasePrice * (ciiAtSale / ciiAtPurchase);
    const indexedGain = Math.max(0, salePrice - indexedPurchasePrice);
    taxAmount = indexedGain * 0.2;
    ruleApplied = "20% with indexation (pre-April-2023 units, held > 36 months — old LTCG rule)";
  } else {
    taxAmount = totalGain * (slabRate / 100);
    ruleApplied = `Slab rate (${slabRate}%) — pre-April-2023 units held ≤ 36 months (STCG)`;
  }

  const netProceedsAfterTax = salePrice - Math.round(taxAmount);

  const pieData =
    totalGain > 0
      ? [
          { name: "Purchase Cost", value: Math.round(purchasePrice) },
          { name: "Tax Payable", value: Math.round(taxAmount) },
          { name: "Net Gain (after tax)", value: Math.round(totalGain - taxAmount) },
        ]
      : [{ name: "Capital Loss", value: Math.round(Math.abs(totalGain)) }];

  const insights: string[] = [];
  if (totalGain <= 0) {
    insights.push(`You have a capital loss of ₹${Math.abs(Math.round(totalGain)).toLocaleString("en-IN")}, which can be set off against other capital gains.`);
  } else {
    insights.push(
      `Your gain of ₹${Math.round(totalGain).toLocaleString("en-IN")} is taxed using: ${ruleApplied}, giving a tax of ₹${Math.round(taxAmount).toLocaleString("en-IN")}.`
    );
  }
  insights.push(
    "The 1 April 2023 purchase date cutoff matters enormously: units bought on or after that date never qualify for LTCG treatment, regardless of how long you hold them — this removed debt funds' previous tax edge over fixed deposits."
  );

  return {
    outputs: {
      totalGain: Math.round(totalGain),
      taxAmount: Math.round(taxAmount),
      netProceedsAfterTax: Math.round(netProceedsAfterTax),
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
