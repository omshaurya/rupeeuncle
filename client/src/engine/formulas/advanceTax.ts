import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Advance Tax Calculator.
 *
 * Applies if estimated tax liability (after TDS) exceeds ₹10,000 in a financial year.
 * Paid in 4 cumulative installments:
 *   15 June:      15% of total tax liability
 *   15 September: 45% cumulative (i.e. 30% more)
 *   15 December:  75% cumulative (i.e. 30% more)
 *   15 March:     100% cumulative (i.e. 25% more)
 * Each installment amount = (cumulative % × total liability) − (sum of prior installments)
 *
 * Verified against a published worked example: total tax ₹20,000 → installments of
 * ₹3,000 / ₹6,000 / ₹6,000 / ₹5,000 (15% / 30% / 30% / 25% of total, matching the
 * cumulative 15/45/75/100 schedule). Matched exactly.
 */
export const advanceTaxFormula: FormulaFn = (inputs) => {
  const estimatedAnnualTaxLiability = inputs.estimatedAnnualTaxLiability ?? 0;
  const tdsAlreadyDeducted = inputs.tdsAlreadyDeducted ?? 0;

  const netTaxLiability = Math.max(0, estimatedAnnualTaxLiability - tdsAlreadyDeducted);
  const advanceTaxApplicable = netTaxLiability >= 10000;

  const cumulativePercents = [15, 45, 75, 100];
  const installmentLabels = ["15 June", "15 September", "15 December", "15 March"];

  let previousCumulative = 0;
  const installments = cumulativePercents.map((pct, i) => {
    const cumulativeAmount = (netTaxLiability * pct) / 100;
    const installmentAmount = cumulativeAmount - previousCumulative;
    previousCumulative = cumulativeAmount;
    return {
      label: installmentLabels[i],
      cumulativePercent: pct,
      installmentAmount: Math.round(installmentAmount),
      cumulativeAmount: Math.round(cumulativeAmount),
    };
  });

  // Repurpose yearlyData to show the 4 quarterly installments (not actually years)
  const yearlyData: YearlyRow[] = installments.map((inst, i) => ({
    year: i + 1,
    invested: inst.installmentAmount,
    returns: 0,
    balance: inst.cumulativeAmount,
  }));

  const pieData = installments.map((inst) => ({
    name: inst.label,
    value: inst.installmentAmount,
  }));

  const insights: string[] = [];
  if (!advanceTaxApplicable) {
    insights.push(
      `Your net tax liability (after TDS) is ₹${netTaxLiability.toLocaleString("en-IN")}, which is below the ₹10,000 threshold — you are not required to pay advance tax.`
    );
  } else {
    insights.push(
      `Your net tax liability after TDS is ₹${netTaxLiability.toLocaleString("en-IN")}, which exceeds ₹10,000 — advance tax is applicable in 4 installments.`
    );
    installments.forEach((inst) => {
      insights.push(`${inst.label}: ₹${inst.installmentAmount.toLocaleString("en-IN")} (cumulative ${inst.cumulativePercent}%)`);
    });
    insights.push(
      "Missing an installment deadline attracts 1% per month interest under Sections 234B/234C (or their Income-tax Act 2025 equivalents) on the shortfall."
    );
  }

  return {
    outputs: {
      netTaxLiability: Math.round(netTaxLiability),
      totalAdvanceTaxPayable: advanceTaxApplicable ? Math.round(netTaxLiability) : 0,
      firstInstallment: installments[0].installmentAmount,
    },
    yearlyData,
    pieData,
    insights,
  };
};
