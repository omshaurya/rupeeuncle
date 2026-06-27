import type { FormulaFn } from "../../types/calculator";

/**
 * Brokerage & Trading Charges Calculator — Equity Delivery and Intraday.
 *
 * DELIVERY:
 *   STT          = 0.1% × (Buy Value + Sell Value), both legs
 *   Stamp Duty   = 0.015% × Buy Value (buy side only)
 *   DP Charges   = flat fee per scrip on sell side (CDSL/NSDL, delivery only)
 * INTRADAY:
 *   STT          = 0.025% × Sell Value only
 *   Stamp Duty   = 0.003% × Buy Value
 *   No DP charges (no delivery into demat account)
 * BOTH:
 *   Transaction  = 0.00345% × Turnover (NSE rate)
 *   SEBI Charges = 0.0001% × Turnover (₹10 per crore)
 *   GST          = 18% × (Brokerage + Transaction Charges) — NOT charged on STT/SEBI/stamp duty
 *
 * VERIFICATION NOTE: initially attempted to verify against Angel One's published worked
 * example assuming it was a delivery trade — the numbers didn't match. Investigating the
 * implied STT rate (0.0167% of turnover) revealed their example was actually INTRADAY
 * (0.025% × sell value only = ₹24.50 on a ₹98,000 sell leg, which matches their stated STT
 * exactly). SEBI charges also matched exactly (₹0.15) in both interpretations since that
 * component doesn't depend on the trade type. Re-verifying against the correct trade type
 * is what caught this — assuming the wrong trade type would have produced a "verified"
 * formula that was actually checked against the wrong scenario.
 *
 * After correcting for trade type: STT matched exactly (₹24.50) and SEBI charges matched
 * exactly (₹0.15). Transaction charges were close but not exact (computed ₹5.07 vs their
 * stated ₹4.77) and stamp duty had a larger gap (computed ₹1.47 vs their stated ₹4.41) —
 * stamp duty is set by STATE governments and varies, so their example likely used a
 * different state's rate than the 0.003%/0.015% reference rates used here. Both gaps are
 * disclosed rather than hidden; treat this calculator's stamp duty output as a
 * reference-rate estimate, not your exact state's figure.
 */
export const brokerageFormula: FormulaFn = (inputs) => {
  const buyPrice = inputs.buyPrice ?? 0;
  const sellPrice = inputs.sellPrice ?? 0;
  const quantity = inputs.quantity ?? 0;
  const brokerageType = inputs.brokerageType ?? 0; // 0 = zero brokerage (Zerodha/Angel/Groww-style), 1 = traditional 0.3%
  const tradeType = inputs.tradeType ?? 0; // 0 = delivery, 1 = intraday
  const dpChargePerScrip = inputs.dpChargePerScrip ?? 15.93;

  const buyValue = buyPrice * quantity;
  const sellValue = sellPrice * quantity;
  const turnover = buyValue + sellValue;
  const isIntraday = tradeType === 1;

  const brokerage = brokerageType === 1 ? turnover * 0.003 : 0;
  const stt = isIntraday ? sellValue * 0.00025 : turnover * 0.001;
  const transactionCharges = turnover * 0.0000345;
  const sebiCharges = turnover * 0.000001;
  const stampDuty = isIntraday ? buyValue * 0.00003 : buyValue * 0.00015;
  const gst = (brokerage + transactionCharges) * 0.18;
  const dpCharges = isIntraday ? 0 : dpChargePerScrip; // no delivery into demat for intraday

  const totalCharges = brokerage + stt + transactionCharges + sebiCharges + stampDuty + gst + dpCharges;
  const grossPnl = sellValue - buyValue;
  const netPnl = grossPnl - totalCharges;

  // Breakeven sell price: the price per share at which netPnl = 0, holding charges roughly constant
  const breakEvenSellPrice = quantity > 0 ? (buyValue + totalCharges) / quantity : 0;

  const pieData = [
    { name: "Brokerage", value: Math.round(brokerage) },
    { name: "STT", value: Math.round(stt) },
    { name: "Transaction + SEBI", value: Math.round(transactionCharges + sebiCharges) },
    { name: "GST", value: Math.round(gst) },
    { name: "Stamp Duty + DP", value: Math.round(stampDuty + dpCharges) },
  ].filter((d) => d.value > 0);

  const insights: string[] = [
    `Total charges for this ${isIntraday ? "intraday" : "delivery"} trade: ₹${totalCharges.toFixed(2)} (${((totalCharges / turnover) * 100).toFixed(3)}% of turnover).`,
    `Gross P&L: ₹${grossPnl.toFixed(2)} | Net P&L after all charges: ₹${netPnl.toFixed(2)}.`,
    `You need to sell at ₹${breakEvenSellPrice.toFixed(2)} per share just to cover your costs (breakeven price).`,
    "STT, SEBI charges, and stamp duty are government-mandated and cannot be reduced regardless of broker. Brokerage is the only negotiable/avoidable component.",
  ];

  return {
    outputs: {
      totalCharges: Math.round(totalCharges * 100) / 100,
      netPnl: Math.round(netPnl * 100) / 100,
      breakEvenSellPrice: Math.round(breakEvenSellPrice * 100) / 100,
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
