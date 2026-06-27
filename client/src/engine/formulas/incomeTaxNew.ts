import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Income Tax Calculator — New Tax Regime (Section 115BAC), FY 2025-26 (AY 2026-27).
 * Slabs confirmed unchanged for FY 2026-27 per Union Budget 2026.
 *
 * Slabs (annual taxable income, after standard deduction):
 *   ₹0 – ₹4,00,000        : Nil
 *   ₹4,00,000 – ₹8,00,000  : 5%
 *   ₹8,00,000 – ₹12,00,000 : 10%
 *   ₹12,00,000 – ₹16,00,000: 15%
 *   ₹16,00,000 – ₹20,00,000: 20%
 *   ₹20,00,000 – ₹24,00,000: 25%
 *   above ₹24,00,000       : 30%
 *
 * Standard deduction for salaried individuals: ₹75,000
 * Section 87A rebate: full tax rebate (up to ₹60,000) if taxable income ≤ ₹12,00,000,
 *   making effective tax-free threshold ₹12,75,000 gross salary for salaried taxpayers.
 * Health & education cess: 4% on tax after rebate.
 *
 * NOTE: This calculator does not model surcharge (applicable only above ₹50L) or
 * marginal relief, since the target audience (salaried individuals checking their
 * regular tax) is overwhelmingly below that threshold. A note to this effect is
 * shown in the UI disclaimer.
 */

const SLABS = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 0.05 },
  { upTo: 1200000, rate: 0.1 },
  { upTo: 1600000, rate: 0.15 },
  { upTo: 2000000, rate: 0.2 },
  { upTo: 2400000, rate: 0.25 },
  { upTo: Infinity, rate: 0.3 },
];

const STANDARD_DEDUCTION = 75000;
const REBATE_THRESHOLD = 1200000; // taxable income (after std deduction)
const REBATE_MAX_AMOUNT = 60000;
const CESS_RATE = 0.04;

function calculateSlabTax(taxableIncome: number): number {
  let tax = 0;
  let lowerBound = 0;

  for (const slab of SLABS) {
    if (taxableIncome <= lowerBound) break;
    const taxableInThisSlab = Math.min(taxableIncome, slab.upTo) - lowerBound;
    if (taxableInThisSlab > 0) {
      tax += taxableInThisSlab * slab.rate;
    }
    lowerBound = slab.upTo;
  }

  return tax;
}

export const incomeTaxNewRegimeFormula: FormulaFn = (inputs) => {
  const grossAnnualIncome = inputs.grossAnnualIncome ?? 0;
  const employerNpsContribution = inputs.employerNpsContribution ?? 0; // Sec 80CCD(2), allowed even in new regime

  const taxableIncome = Math.max(
    0,
    grossAnnualIncome - STANDARD_DEDUCTION - employerNpsContribution
  );

  let taxBeforeCess = calculateSlabTax(taxableIncome);

  // Section 87A rebate: if taxable income <= 12L, tax becomes fully nil (capped at 60,000 rebate)
  let rebateApplied = 0;
  if (taxableIncome <= REBATE_THRESHOLD) {
    rebateApplied = Math.min(taxBeforeCess, REBATE_MAX_AMOUNT);
    taxBeforeCess -= rebateApplied;
  }

  const cess = taxBeforeCess * CESS_RATE;
  const totalTaxPayable = Math.round(taxBeforeCess + cess);
  const inHandIncome = Math.round(grossAnnualIncome - totalTaxPayable);

  // "Yearly" data here represents slab-wise breakdown rather than a multi-year projection,
  // since income tax is a single-year calculation, not a compounding one.
  const yearlyData: YearlyRow[] = [];
  let lowerBound = 0;
  let cumulativeTax = 0;
  for (const slab of SLABS) {
    if (taxableIncome <= lowerBound) break;
    const taxableInThisSlab = Math.min(taxableIncome, slab.upTo) - lowerBound;
    const taxInThisSlab = taxableInThisSlab * slab.rate;
    cumulativeTax += taxInThisSlab;
    yearlyData.push({
      year: yearlyData.length + 1,
      invested: Math.round(lowerBound),
      returns: Math.round(taxInThisSlab),
      balance: Math.round(cumulativeTax),
      slabRate: slab.rate * 100,
      slabUpTo: slab.upTo === Infinity ? lowerBound + taxableInThisSlab : slab.upTo,
    });
    lowerBound = slab.upTo;
  }

  const pieData = [
    { name: "In-Hand Income", value: inHandIncome },
    { name: "Total Tax Payable", value: totalTaxPayable },
  ];

  const insights: string[] = [];
  if (rebateApplied > 0 && taxBeforeCess + rebateApplied - rebateApplied <= 0) {
    insights.push(
      `Your taxable income of ₹${taxableIncome.toLocaleString("en-IN")} qualifies for a full Section 87A rebate, making your tax liability nil.`
    );
  }
  insights.push(
    `On a gross annual income of ₹${grossAnnualIncome.toLocaleString("en-IN")}, your taxable income after standard deduction is ₹${taxableIncome.toLocaleString("en-IN")}, resulting in a total tax payable of ₹${totalTaxPayable.toLocaleString("en-IN")} (including 4% cess).`
  );

  return {
    outputs: {
      taxableIncome: Math.round(taxableIncome),
      totalTaxPayable,
      inHandIncome,
      rebateApplied: Math.round(rebateApplied),
    },
    yearlyData,
    pieData,
    insights,
  };
};
