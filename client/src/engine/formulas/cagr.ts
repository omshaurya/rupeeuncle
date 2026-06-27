import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * CAGR (Compound Annual Growth Rate) Calculator.
 *
 * Unlike most calculators here, this solves for the RATE given a known start/end value,
 * rather than solving for a future value given a rate:
 *   CAGR = (Final Value / Initial Value)^(1 / Years) − 1
 *
 * Used to compare investments with different time horizons and to find the "smoothed"
 * annual growth rate even when actual year-to-year returns were volatile.
 */
export const cagrFormula: FormulaFn = (inputs) => {
  const initialValue = inputs.initialValue ?? 0;
  const finalValue = inputs.finalValue ?? 0;
  const years = inputs.years ?? 1;

  let cagrPercent = 0;
  if (initialValue > 0 && years > 0) {
    cagrPercent = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
  }

  const absoluteReturnPercent =
    initialValue > 0 ? ((finalValue - initialValue) / initialValue) * 100 : 0;

  // Build a year-wise table showing what the value WOULD be at each year if growth had
  // been perfectly smooth at the computed CAGR — useful for visualizing what "smoothed"
  // growth means versus the actual (likely volatile) path the investment took.
  const yearlyData: YearlyRow[] = [];
  const wholeYears = Math.ceil(years);
  const rateDecimal = cagrPercent / 100;

  for (let year = 1; year <= wholeYears; year++) {
    const t = Math.min(year, years);
    const impliedValue = initialValue * Math.pow(1 + rateDecimal, t);
    yearlyData.push({
      year,
      invested: Math.round(initialValue),
      returns: Math.round(impliedValue - initialValue),
      balance: Math.round(impliedValue),
    });
  }

  const pieData = [
    { name: "Initial Value", value: Math.round(initialValue) },
    { name: "Growth", value: Math.round(finalValue - initialValue) },
  ];

  const insights: string[] = [
    `Your investment grew from ₹${initialValue.toLocaleString("en-IN")} to ₹${finalValue.toLocaleString("en-IN")} over ${years} years — a compound annual growth rate of ${cagrPercent.toFixed(2)}%.`,
    `The total absolute return over the period was ${absoluteReturnPercent.toFixed(2)}%, but CAGR smooths this into a single comparable annual figure.`,
  ];

  return {
    outputs: {
      cagrPercent: Math.round(cagrPercent * 100) / 100,
      absoluteReturnPercent: Math.round(absoluteReturnPercent * 100) / 100,
      totalGrowth: Math.round(finalValue - initialValue),
    },
    yearlyData,
    pieData,
    insights,
  };
};
