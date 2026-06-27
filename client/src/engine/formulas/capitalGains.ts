import type { FormulaFn } from "../../types/calculator";

/**
 * Capital Gains Calculator — Listed Equity Shares & Equity-Oriented Mutual Funds.
 *
 * Current rules (Finance Act 2024, unchanged through FY 2025-26 / Budget 2025 & 2026):
 *   - Holding period > 12 months → LTCG: 12.5% on gains exceeding ₹1.25 lakh per FY
 *     (no indexation benefit), under Section 112A.
 *   - Holding period ≤ 12 months → STCG: flat 20% on the entire gain, no exemption.
 *
 * This calculator covers EQUITY shares / equity mutual funds specifically — capital gains
 * rules differ for debt funds (taxed at slab rates regardless of holding period, for units
 * bought after April 1, 2023), real estate (12.5% LTCG after 24 months, with transitional
 * indexation choice for pre-July 2024 purchases), and gold (similar real-estate-like rules).
 * Those are NOT modeled here — a general-purpose calculator would need separate formulas
 * per asset class since the rules genuinely differ, not just the rate.
 */
export const capitalGainsFormula: FormulaFn = (inputs) => {
  const purchasePrice = inputs.purchasePrice ?? 0;
  const salePrice = inputs.salePrice ?? 0;
  const holdingPeriodMonths = inputs.holdingPeriodMonths ?? 12;
  const otherLtcgThisYear = inputs.otherLtcgThisYear ?? 0; // other equity LTCG already booked this FY, reduces remaining exemption

  const totalGain = salePrice - purchasePrice;
  const isLongTerm = holdingPeriodMonths > 12;

  const LTCG_EXEMPTION = 125000;
  const LTCG_RATE = 0.125;
  const STCG_RATE = 0.2;

  let taxAmount = 0;
  let taxableGain = 0;
  let exemptGain = 0;

  if (totalGain <= 0) {
    // Loss — no tax, and the loss can be carried forward / set off (not modeled numerically here)
    taxAmount = 0;
    taxableGain = 0;
    exemptGain = 0;
  } else if (isLongTerm) {
    const remainingExemption = Math.max(0, LTCG_EXEMPTION - otherLtcgThisYear);
    exemptGain = Math.min(totalGain, remainingExemption);
    taxableGain = totalGain - exemptGain;
    taxAmount = taxableGain * LTCG_RATE;
  } else {
    // STCG has no exemption threshold — fully taxable at flat 20%
    exemptGain = 0;
    taxableGain = totalGain;
    taxAmount = totalGain * STCG_RATE;
  }

  const netProceedsAfterTax = salePrice - Math.round(taxAmount);

  const pieData =
    totalGain > 0
      ? [
          { name: "Exempt Gain", value: Math.round(exemptGain) },
          { name: "Taxable Gain", value: Math.round(taxableGain) },
          { name: "Tax Payable", value: Math.round(taxAmount) },
        ]
      : [{ name: "Capital Loss", value: Math.round(Math.abs(totalGain)) }];

  const insights: string[] = [];
  if (totalGain <= 0) {
    insights.push(
      `You have a capital loss of ₹${Math.abs(Math.round(totalGain)).toLocaleString("en-IN")}. This can be set off against other capital gains and carried forward for up to 8 assessment years if unused.`
    );
  } else if (isLongTerm) {
    insights.push(
      `Held for ${holdingPeriodMonths} months (long-term), your gain of ₹${Math.round(totalGain).toLocaleString("en-IN")} qualifies for LTCG treatment. ₹${Math.round(exemptGain).toLocaleString("en-IN")} is exempt (Section 112A, ₹1.25 lakh annual limit), and ₹${Math.round(taxableGain).toLocaleString("en-IN")} is taxed at 12.5%, giving a tax of ₹${Math.round(taxAmount).toLocaleString("en-IN")}.`
    );
  } else {
    insights.push(
      `Held for ${holdingPeriodMonths} months (short-term, ≤12 months), your entire gain of ₹${Math.round(totalGain).toLocaleString("en-IN")} is taxed at the flat STCG rate of 20%, giving a tax of ₹${Math.round(taxAmount).toLocaleString("en-IN")}. There is no exemption threshold for STCG.`
    );
  }
  insights.push(
    "This calculator covers listed equity shares and equity-oriented mutual funds only. Capital gains rules for debt funds, real estate, and gold differ — not just in rate, but in the underlying rules."
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
