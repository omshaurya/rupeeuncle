import type { FormulaFn } from "../../types/calculator";

/**
 * HRA (House Rent Allowance) Exemption Calculator — Section 10(13A), Rule 2A.
 * Only available under the Old Tax Regime.
 *
 * Exempt HRA = minimum of:
 *   1. Actual HRA received from employer
 *   2. 50% of salary (metro city) or 40% of salary (non-metro city)
 *   3. Rent paid − 10% of salary
 * where "salary" = Basic Salary + Dearness Allowance (DA forming part of retirement benefits).
 *
 * Metro city rule for FY 2025-26 (AY 2026-27): only Delhi, Mumbai, Kolkata, Chennai count as
 * metro (50%). The expansion to include Bengaluru, Pune, Hyderabad, Ahmedabad applies from
 * FY 2026-27 onward, per the Income Tax Act 2025 — NOT yet applicable for FY 2025-26 filings.
 *
 * This is a single-period (annual) calculation, not a multi-year projection, so the
 * "yearlyData" output here represents the three comparison amounts rather than years.
 */
export const hraFormula: FormulaFn = (inputs) => {
  const basicSalaryAnnual = inputs.basicSalaryAnnual ?? 0;
  const dearnessAllowanceAnnual = inputs.dearnessAllowanceAnnual ?? 0;
  const hraReceivedAnnual = inputs.hraReceivedAnnual ?? 0;
  const rentPaidAnnual = inputs.rentPaidAnnual ?? 0;
  const isMetroCity = (inputs.isMetroCity ?? 1) === 1; // 1 = metro, 0 = non-metro (select input)

  const salary = basicSalaryAnnual + dearnessAllowanceAnnual;
  const salaryPercentage = isMetroCity ? 0.5 : 0.4;

  const condition1_actualHra = hraReceivedAnnual;
  const condition2_salaryPercent = salary * salaryPercentage;
  const condition3_rentMinusTenPercent = Math.max(0, rentPaidAnnual - salary * 0.1);

  const exemptHra = Math.round(
    Math.min(condition1_actualHra, condition2_salaryPercent, condition3_rentMinusTenPercent)
  );
  const taxableHra = Math.max(0, Math.round(hraReceivedAnnual - exemptHra));

  // Identify which condition was the binding (lowest) one, for the insight text
  const conditions = [
    { label: "Actual HRA Received", value: condition1_actualHra },
    {
      label: `${isMetroCity ? "50%" : "40%"} of Salary (${isMetroCity ? "Metro" : "Non-Metro"})`,
      value: condition2_salaryPercent,
    },
    { label: "Rent Paid − 10% of Salary", value: condition3_rentMinusTenPercent },
  ];
  const binding = conditions.reduce((min, c) => (c.value < min.value ? c : min));

  // HRA is a single-period calculation, not a multi-year projection. We still populate
  // yearlyData (using "year" as a row index 1-3) so the generic CSV/PDF export and any
  // bar-chart comparison can show the three Section 10(13A) conditions side by side —
  // but we deliberately do NOT stuff a string label into a numeric field here, since
  // that would corrupt CSV/PDF exports with garbage values.
  const yearlyData = conditions.map((c, i) => ({
    year: i + 1,
    invested: Math.round(c.value),
    returns: 0,
    balance: Math.round(c.value),
  }));

  const pieData = [
    { name: "Exempt HRA", value: exemptHra },
    { name: "Taxable HRA", value: taxableHra },
  ];

  const insights: string[] = [
    `Your HRA exemption is ₹${exemptHra.toLocaleString("en-IN")} per year, determined by the lowest of the three conditions: "${binding.label}".`,
    `The remaining ₹${taxableHra.toLocaleString("en-IN")} of your HRA is taxable and added to your income under the old tax regime.`,
    "HRA exemption is only available under the Old Tax Regime — it cannot be claimed under the New Tax Regime.",
  ];

  return {
    outputs: {
      exemptHra,
      taxableHra,
      actualHraReceived: Math.round(hraReceivedAnnual),
    },
    yearlyData,
    pieData,
    insights,
  };
};
