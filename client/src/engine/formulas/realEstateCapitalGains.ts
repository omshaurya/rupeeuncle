import type { FormulaFn } from "../../types/calculator";

/**
 * Real Estate Capital Gains Calculator.
 *
 * For property held > 24 months (long-term), purchased BEFORE 23 July 2024, resident
 * individuals/HUFs get a choice between two methods (Finance Act 2024 grandfathering):
 *   Method 1: 12.5% tax on (Sale Price − Purchase Price), no indexation
 *   Method 2: 20% tax on (Sale Price − Indexed Purchase Price), where
 *             Indexed Purchase Price = Purchase Price × (CII at sale / CII at purchase)
 * The taxpayer pays whichever method gives the LOWER tax.
 *
 * For property purchased ON OR AFTER 23 July 2024: only Method 1 (12.5%, no indexation)
 * applies — no choice, since the grandfathering only covers pre-cutoff purchases.
 *
 * Short-term (≤24 months): gain taxed at the taxpayer's income slab rate, no indexation.
 *
 * Verified against a published worked example: ₹40L purchase (CII 167) → ₹1.2Cr sale
 * (CII 363). Method 1: LTCG ₹80L, tax ₹10L. Method 2: indexed cost ₹86.95L, LTCG ₹33.05L,
 * tax ₹6.61L. Both figures matched exactly; the calculator correctly selects Method 2 as
 * the lower-tax option in this case.
 */
export const realEstateCapitalGainsFormula: FormulaFn = (inputs) => {
  const purchasePrice = inputs.purchasePrice ?? 0;
  const salePrice = inputs.salePrice ?? 0;
  const holdingPeriodMonths = inputs.holdingPeriodMonths ?? 24;
  const purchasedBeforeCutoff = (inputs.purchasedBeforeCutoff ?? 1) === 1;
  const ciiAtPurchase = inputs.ciiAtPurchase ?? 167;
  const ciiAtSale = inputs.ciiAtSale ?? 363;
  const slabRate = inputs.slabRate ?? 30; // for short-term gains, taxed at slab rate

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
    // Method 1: flat 12.5%, no indexation
    method1Tax = totalGain * 0.125;

    if (purchasedBeforeCutoff) {
      // Method 2: 20% with indexation — only available for pre-cutoff purchases
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
    insights.push(
      `You have a capital loss of ₹${Math.abs(Math.round(totalGain)).toLocaleString("en-IN")}. This can be set off against other long-term capital gains and carried forward for up to 8 assessment years.`
    );
  } else if (!isLongTerm) {
    insights.push(
      `Held for ${holdingPeriodMonths} months (short-term, ≤24 months), your entire gain of ₹${Math.round(totalGain).toLocaleString("en-IN")} is added to your income and taxed at your slab rate (${slabRate}% used here), giving a tax of ₹${Math.round(taxAmount).toLocaleString("en-IN")}.`
    );
  } else if (purchasedBeforeCutoff) {
    insights.push(
      `Since you purchased before 23 July 2024, you can choose between two methods. 12.5% without indexation gives ₹${Math.round(method1Tax).toLocaleString("en-IN")} tax; 20% with indexation gives ₹${Math.round(method2Tax).toLocaleString("en-IN")} tax. The better option here is ${methodUsed}, saving you ₹${Math.round(Math.abs(method1Tax - method2Tax)).toLocaleString("en-IN")}.`
    );
  } else {
    insights.push(
      `Since you purchased on or after 23 July 2024, only the 12.5% flat rate (no indexation) applies — your tax is ₹${Math.round(taxAmount).toLocaleString("en-IN")} on a gain of ₹${Math.round(totalGain).toLocaleString("en-IN")}.`
    );
  }
  insights.push(
    "Sections 54, 54EC, and 54F may let you reduce or eliminate this tax entirely by reinvesting the gains in another property or specified bonds within the prescribed timeframes — not modeled in this calculator."
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
