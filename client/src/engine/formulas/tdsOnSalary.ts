import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * TDS on Salary Calculator (Section 192).
 *
 * TDS on salary is NOT a separate tax — it's the same annual income tax liability
 * (computed via slab rates, exactly like the Income Tax Calculator) divided across the
 * months of the financial year and deducted monthly by the employer.
 *
 *   Average TDS Rate = Total Annual Tax Payable / Estimated Annual Salary
 *   Monthly TDS = Average TDS Rate × Monthly Salary  (equivalently: Annual Tax / 12)
 *
 * This reuses the exact same New Regime slab logic as incomeTaxNew.ts (already verified
 * against published examples) rather than re-implementing slab math separately — the only
 * new piece here is converting the annual figure into a monthly TDS deduction schedule.
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
const REBATE_THRESHOLD = 1200000;
const REBATE_MAX_AMOUNT = 60000;
const CESS_RATE = 0.04;

function calculateSlabTax(taxableIncome: number): number {
  let tax = 0;
  let lowerBound = 0;
  for (const slab of SLABS) {
    if (taxableIncome <= lowerBound) break;
    const taxableInThisSlab = Math.min(taxableIncome, slab.upTo) - lowerBound;
    if (taxableInThisSlab > 0) tax += taxableInThisSlab * slab.rate;
    lowerBound = slab.upTo;
  }
  return tax;
}

export const tdsOnSalaryFormula: FormulaFn = (inputs) => {
  const annualGrossSalary = inputs.annualGrossSalary ?? 0;
  const remainingMonthsInYear = Math.max(1, Math.min(12, inputs.remainingMonthsInYear ?? 12));

  const taxableIncome = Math.max(0, annualGrossSalary - STANDARD_DEDUCTION);

  let taxBeforeCess = calculateSlabTax(taxableIncome);
  let rebateApplied = 0;
  if (taxableIncome <= REBATE_THRESHOLD) {
    rebateApplied = Math.min(taxBeforeCess, REBATE_MAX_AMOUNT);
    taxBeforeCess -= rebateApplied;
  }

  const cess = taxBeforeCess * CESS_RATE;
  const totalAnnualTax = Math.round(taxBeforeCess + cess);

  const monthlyTds = Math.round(totalAnnualTax / remainingMonthsInYear);
  const averageTdsRate =
    annualGrossSalary > 0 ? (totalAnnualTax / annualGrossSalary) * 100 : 0;

  // Single-period calculation — yearlyData repurposed to show the monthly deduction schedule
  const yearlyData: YearlyRow[] = [];
  let cumulativeTds = 0;
  for (let month = 1; month <= remainingMonthsInYear; month++) {
    cumulativeTds += monthlyTds;
    yearlyData.push({
      year: month,
      invested: 0,
      returns: monthlyTds,
      balance: cumulativeTds,
    });
  }

  const pieData = [
    { name: "In-Hand Salary (after TDS)", value: Math.round(annualGrossSalary - totalAnnualTax) },
    { name: "Total TDS Deducted", value: totalAnnualTax },
  ];

  const insights: string[] = [
    `Your estimated annual tax liability is ₹${totalAnnualTax.toLocaleString("en-IN")}, which works out to a monthly TDS deduction of ₹${monthlyTds.toLocaleString("en-IN")} over the remaining ${remainingMonthsInYear} month(s) of the financial year.`,
    `Your average TDS rate is ${averageTdsRate.toFixed(2)}% of your gross salary.`,
    "This calculation assumes the New Tax Regime. TDS can change mid-year if your salary changes, you receive a bonus, or you submit investment declarations late.",
  ];

  return {
    outputs: {
      totalAnnualTax,
      monthlyTds,
      averageTdsRate: Math.round(averageTdsRate * 100) / 100,
    },
    yearlyData,
    pieData,
    insights,
  };
};
