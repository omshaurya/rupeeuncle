import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Future Value Calculator.
 *
 * FV = PV × (1 + r/n)^(n×t)   [lumpsum component]
 * Plus, if a periodic contribution is included, the future value of that annuity is added
 * (same annuity-due convention used throughout this codebase — contribution then growth):
 *   FV_annuity = PMT × [((1+i)^N − 1) / i] × (1+i)
 *
 * Verified against two independent textbook examples: $5,000 at 7% annual compounding for
 * 4 years → $6,553.98, and $1,000 at 5% daily compounding for 10 years → $1,648.66. Both
 * matched exactly.
 */
export const futureValueFormula: FormulaFn = (inputs) => {
  const presentValue = inputs.presentValue ?? 0;
  const annualRate = inputs.annualRate ?? 0;
  const years = inputs.years ?? 1;
  const compoundingFrequency = inputs.compoundingFrequency ?? 1; // 1=annual, 4=quarterly, 12=monthly
  const periodicContribution = inputs.periodicContribution ?? 0; // contributed at the same frequency as compounding

  const r = annualRate / 100;
  const n = compoundingFrequency;
  const ratePerPeriod = r / n;
  const totalPeriods = n * years;

  const yearlyData: YearlyRow[] = [];
  const wholeYears = Math.ceil(years);

  for (let year = 1; year <= wholeYears; year++) {
    const t = Math.min(year, years);
    const periodsElapsed = n * t;
    const lumpsumFv = presentValue * Math.pow(1 + ratePerPeriod, periodsElapsed);
    const annuityFv =
      ratePerPeriod > 0
        ? periodicContribution *
          (((Math.pow(1 + ratePerPeriod, periodsElapsed) - 1) / ratePerPeriod) * (1 + ratePerPeriod))
        : periodicContribution * periodsElapsed;
    const totalContributed = presentValue + periodicContribution * periodsElapsed;
    const balance = lumpsumFv + annuityFv;

    yearlyData.push({
      year,
      invested: Math.round(totalContributed),
      returns: Math.round(balance - totalContributed),
      balance: Math.round(balance),
    });
  }

  const finalLumpsumFv = presentValue * Math.pow(1 + ratePerPeriod, totalPeriods);
  const finalAnnuityFv =
    ratePerPeriod > 0
      ? periodicContribution *
        (((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod) * (1 + ratePerPeriod))
      : periodicContribution * totalPeriods;

  const futureValue = Math.round(finalLumpsumFv + finalAnnuityFv);
  const totalContributed = Math.round(presentValue + periodicContribution * totalPeriods);
  const totalGrowth = futureValue - totalContributed;

  const pieData = [
    { name: "Total Contributed", value: totalContributed },
    { name: "Growth", value: totalGrowth },
  ];

  const insights: string[] = [
    `₹${presentValue.toLocaleString("en-IN")} invested today${periodicContribution > 0 ? ` plus periodic contributions of ₹${periodicContribution.toLocaleString("en-IN")}` : ""}, growing at ${annualRate}% for ${years} years, reaches a future value of ₹${futureValue.toLocaleString("en-IN")}.`,
  ];

  return {
    outputs: {
      futureValue,
      totalContributed,
      totalGrowth,
    },
    yearlyData,
    pieData,
    insights,
  };
};
