import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Present Value Calculator.
 *
 * PV = FV / (1 + r/n)^(n×t)
 *
 * Answers: "how much do I need to invest today to reach a target future amount?" — the
 * inverse of the Future Value calculator's lumpsum component.
 *
 * Verified against a textbook example: $1,000,000 due in 1 year at 8% interest has a
 * present value of $925,925.93. Matched exactly.
 */
export const presentValueFormula: FormulaFn = (inputs) => {
  const futureValue = inputs.futureValue ?? 0;
  const annualRate = inputs.annualRate ?? 0;
  const years = inputs.years ?? 1;
  const compoundingFrequency = inputs.compoundingFrequency ?? 1;

  const r = annualRate / 100;
  const n = compoundingFrequency;
  const ratePerPeriod = r / n;
  const totalPeriods = n * years;

  const presentValue = futureValue / Math.pow(1 + ratePerPeriod, totalPeriods);
  const discountAmount = futureValue - presentValue;

  // Show how the discounted value changes if the target date moves earlier/later by year
  const yearlyData: YearlyRow[] = [];
  const wholeYears = Math.ceil(years);
  for (let year = 1; year <= wholeYears; year++) {
    const t = Math.min(year, years);
    const periodsElapsed = n * t;
    const pvAtThisYear = futureValue / Math.pow(1 + ratePerPeriod, periodsElapsed);
    yearlyData.push({
      year,
      invested: Math.round(presentValue),
      returns: Math.round(futureValue - pvAtThisYear),
      balance: Math.round(pvAtThisYear),
    });
  }

  const pieData = [
    { name: "Present Value (needed today)", value: Math.round(presentValue) },
    { name: "Discount (time value of money)", value: Math.round(discountAmount) },
  ];

  const insights: string[] = [
    `To have ₹${futureValue.toLocaleString("en-IN")} in ${years} years at a ${annualRate}% discount rate, you would need to invest ₹${Math.round(presentValue).toLocaleString("en-IN")} today.`,
    `The difference of ₹${Math.round(discountAmount).toLocaleString("en-IN")} represents the time value of money — the return your investment would need to earn to bridge that gap.`,
  ];

  return {
    outputs: {
      presentValue: Math.round(presentValue),
      discountAmount: Math.round(discountAmount),
      futureValue: Math.round(futureValue),
    },
    yearlyData,
    pieData,
    insights,
  };
};
