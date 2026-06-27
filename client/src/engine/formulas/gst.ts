import type { FormulaFn } from "../../types/calculator";

/**
 * GST Calculator.
 *
 * GST = Taxable Value × GST Rate (for "Add GST" mode)
 * Taxable Value = Gross Amount / (1 + Rate) (for "Remove GST" / reverse calculation mode)
 *
 * IMPORTANT — rate structure updated for GST 2.0 (effective 22 September 2025): the GST
 * Council simplified the old 5-slab structure (0%, 5%, 12%, 18%, 28%) down to primarily
 * 0%, 5%, 18%, with a new 40% slab for luxury/sin goods, replacing the old 28%+cess
 * structure. The old 12% and 28% slabs no longer apply to most goods as of this reform.
 * This calculator's default rate options reflect the CURRENT (post-reform) structure —
 * not the pre-2025 slabs still described on some outdated calculator sites.
 */
export const gstFormula: FormulaFn = (inputs) => {
  const amount = inputs.amount ?? 0;
  const gstRate = inputs.gstRate ?? 18;
  const calculationMode = inputs.calculationMode ?? 0; // 0 = add GST, 1 = remove GST

  const rate = gstRate / 100;
  let taxableValue: number;
  let gstAmount: number;
  let totalAmount: number;

  if (calculationMode === 1) {
    // "Remove GST" — amount entered is GST-inclusive; back-calculate the base value
    totalAmount = amount;
    taxableValue = amount / (1 + rate);
    gstAmount = totalAmount - taxableValue;
  } else {
    // "Add GST" — amount entered is the taxable value; add GST on top
    taxableValue = amount;
    gstAmount = amount * rate;
    totalAmount = taxableValue + gstAmount;
  }

  // Split GST into CGST + SGST (each half of the total GST rate) for intra-state supply,
  // since invoices in India show this breakdown rather than a single combined GST line.
  const cgstAmount = gstAmount / 2;
  const sgstAmount = gstAmount / 2;

  const pieData = [
    { name: "Taxable Value", value: Math.round(taxableValue) },
    { name: "GST Amount", value: Math.round(gstAmount) },
  ];

  const insights: string[] = [
    calculationMode === 1
      ? `Of the total GST-inclusive amount of ₹${amount.toLocaleString("en-IN")}, the taxable value is ₹${Math.round(taxableValue).toLocaleString("en-IN")} and GST is ₹${Math.round(gstAmount).toLocaleString("en-IN")}.`
      : `On a taxable value of ₹${amount.toLocaleString("en-IN")} at ${gstRate}% GST, the total amount payable is ₹${Math.round(totalAmount).toLocaleString("en-IN")}.`,
    `For intra-state supply, this splits into CGST ₹${Math.round(cgstAmount).toLocaleString("en-IN")} + SGST ₹${Math.round(sgstAmount).toLocaleString("en-IN")}. For inter-state supply, the full amount is charged as IGST.`,
    "Note: GST rates were significantly restructured effective 22 September 2025 (GST 2.0) — most goods now fall under 5% or 18%, with the old 12% and 28% slabs largely eliminated and a new 40% slab for luxury/sin goods.",
  ];

  return {
    outputs: {
      taxableValue: Math.round(taxableValue),
      gstAmount: Math.round(gstAmount),
      totalAmount: Math.round(totalAmount),
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
