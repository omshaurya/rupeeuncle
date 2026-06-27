import type { FormulaFn } from "../../types/calculator";

/**
 * Gold/Precious Metals Capital Gains Calculator.
 *
 * Same structural rule as real estate (confirmed identical treatment per Axis Max Life
 * and ClearTax sources): physical gold, gold coins, and jewelry held > 24 months qualify
 * for long-term treatment. For purchases before 23 July 2024, the same grandfathering
 * choice applies as real estate: 12.5% without indexation OR 20% with indexation,
 * whichever is lower. For purchases on/after 23 July 2024: flat 12.5%, no indexation, no
 * choice. Short-term (≤24 months): taxed at slab rate.
 *
 * Note: this is for physical gold, gold coins, and jewelry — NOT Sovereign Gold Bonds
 * (which have their own separate, more favorable redemption rules) or Gold ETFs/Gold
 * Mutual Funds (which follow debt-fund-style rules post-April 2023, not this calculator's
 * logic). Mixing these up would give a wrong answer for the wrong instrument.
 */
export const goldCapitalGainsFormula: FormulaFn = (inputs) => {
  const purchasePrice = inputs.purchasePrice ?? 0;
  const salePrice = inputs.salePrice ?? 0;
  const holdingPeriodMonths = inputs.holdingPeriodMonths ?? 24;
  const purchasedBeforeCutoff = (inputs.purchasedBeforeCutoff ?? 1) === 1;
  const ciiAtPurchase = inputs.ciiAtPurchase ?? 280;
  const ciiAtSale = inputs.ciiAtSale ?? 363;
  const slabRate = inputs.slabRate ?? 30;

  const totalGain = salePrice - purchasePrice;
  const isLongTerm = holdingPeriodMonths > 24;

  let taxAmount = 0;
  let methodUsed = "N/A";
  let method1Tax = 0;
  let method2Tax = 0;

  if (totalGain <= 0) {
    taxAmount = 0;
    methodUsed = "Loss — no tax";
  } else if (!isLongTerm) {
    taxAmount = totalGain * (slabRate / 100);
    methodUsed = `Short-term, taxed at ${slabRate}% slab rate`;
  } else {
    method1Tax = totalGain * 0.125;

    if (purchasedBeforeCutoff) {
      const indexedPurchasePrice = purchasePrice * (ciiAtSale / ciiAtPurchase);
      const indexedGain = Math.max(0, salePrice - indexedPurchasePrice);
      method2Tax = indexedGain * 0.2;

      if (method2Tax < method1Tax) {
        taxAmount = method2Tax;
        methodUsed = "20% with indexation (lower tax)";
      } else {
        taxAmount = method1Tax;
        methodUsed = "12.5% without indexation (lower tax)";
      }
    } else {
      taxAmount = method1Tax;
      methodUsed = "12.5% without indexation (only option — purchased after 23 Jul 2024)";
    }
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
    insights.push(`You have a capital loss of ₹${Math.abs(Math.round(totalGain)).toLocaleString("en-IN")}.`);
  } else if (!isLongTerm) {
    insights.push(
      `Held for ${holdingPeriodMonths} months (short-term, ≤24 months), your gain is taxed at your slab rate (${slabRate}%), giving a tax of ₹${Math.round(taxAmount).toLocaleString("en-IN")}.`
    );
  } else if (purchasedBeforeCutoff) {
    insights.push(
      `Purchased before 23 July 2024, you can choose: 12.5% without indexation (₹${Math.round(method1Tax).toLocaleString("en-IN")}) or 20% with indexation (₹${Math.round(method2Tax).toLocaleString("en-IN")}). Better option: ${methodUsed}.`
    );
  } else {
    insights.push(
      `Purchased on or after 23 July 2024, only the flat 12.5% rate applies — tax of ₹${Math.round(taxAmount).toLocaleString("en-IN")}.`
    );
  }
  insights.push(
    "This calculator is for physical gold, coins, and jewelry only — Sovereign Gold Bonds and Gold ETFs/Mutual Funds follow different rules and aren't covered here."
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
