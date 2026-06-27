import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Wealth Calculator — projects total wealth from a combination of a one-time lumpsum
 * investment AND an ongoing monthly SIP, since most investors do both simultaneously
 * (e.g. investing a bonus as a lumpsum while also running a regular SIP).
 *
 * This combines the already-verified lumpsum formula (PV × (1+r)^t) and SIP formula
 * (annuity-due) additively — both components are independently verified elsewhere in this
 * codebase (lumpsum.ts, sip.ts), so combining them is just addition of two correct parts.
 */
export const wealthFormula: FormulaFn = (inputs) => {
  const initialLumpsum = inputs.initialLumpsum ?? 0;
  const monthlySip = inputs.monthlySip ?? 0;
  const annualReturnRate = inputs.annualReturnRate ?? 12;
  const investmentPeriodYears = inputs.investmentPeriodYears ?? 10;

  const monthlyRate = annualReturnRate / 12 / 100;
  const totalMonths = Math.round(investmentPeriodYears * 12);

  const yearlyData: YearlyRow[] = [];
  let sipBalance = 0;
  let totalSipInvested = 0;

  for (let month = 1; month <= totalMonths; month++) {
    sipBalance = (sipBalance + monthlySip) * (1 + monthlyRate);
    totalSipInvested += monthlySip;

    if (month % 12 === 0 || month === totalMonths) {
      const year = Math.ceil(month / 12);
      const lumpsumBalanceAtYear =
        initialLumpsum * Math.pow(1 + annualReturnRate / 100, Math.min(year, investmentPeriodYears));
      const totalBalance = sipBalance + lumpsumBalanceAtYear;
      const totalInvestedSoFar = totalSipInvested + initialLumpsum;

      yearlyData.push({
        year,
        invested: Math.round(totalInvestedSoFar),
        returns: Math.round(totalBalance - totalInvestedSoFar),
        balance: Math.round(totalBalance),
      });
    }
  }

  const lumpsumFinal = initialLumpsum * Math.pow(1 + annualReturnRate / 100, investmentPeriodYears);
  const totalWealth = Math.round(sipBalance + lumpsumFinal);
  const totalInvested = Math.round(initialLumpsum + totalSipInvested);
  const totalGrowth = totalWealth - totalInvested;

  const pieData = [
    { name: "Total Invested", value: totalInvested },
    { name: "Total Growth", value: totalGrowth },
  ];

  const insights: string[] = [
    `Combining a one-time investment of ₹${initialLumpsum.toLocaleString("en-IN")} with a monthly SIP of ₹${monthlySip.toLocaleString("en-IN")} at ${annualReturnRate}% for ${investmentPeriodYears} years builds total wealth of ₹${totalWealth.toLocaleString("en-IN")}.`,
    `Of this, ₹${totalInvested.toLocaleString("en-IN")} is your own contribution and ₹${totalGrowth.toLocaleString("en-IN")} comes from investment growth.`,
  ];

  return {
    outputs: {
      totalWealth,
      totalInvested,
      totalGrowth,
    },
    yearlyData,
    pieData,
    insights,
  };
};
