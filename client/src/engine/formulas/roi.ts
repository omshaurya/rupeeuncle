import type { FormulaFn } from "../../types/calculator";

/**
 * ROI (Return on Investment) Calculator.
 *
 * ROI (%) = (Net Profit / Cost of Investment) × 100, where Net Profit = Final Value − Cost
 * Annualized ROI = (1 + ROI)^(1/years) − 1 — converts a multi-year ROI into a comparable
 * annual rate (same CAGR-style annualization already verified in cagr.ts).
 */
export const roiFormula: FormulaFn = (inputs) => {
  const investmentCost = inputs.investmentCost ?? 0;
  const finalValue = inputs.finalValue ?? 0;
  const years = inputs.years ?? 1;

  const netProfit = finalValue - investmentCost;
  const roiPercent = investmentCost > 0 ? (netProfit / investmentCost) * 100 : 0;

  const annualizedRoiPercent =
    investmentCost > 0 && years > 0 && finalValue > 0
      ? (Math.pow(finalValue / investmentCost, 1 / years) - 1) * 100
      : 0;

  const pieData = [
    { name: "Investment Cost", value: Math.round(investmentCost) },
    { name: "Net Profit", value: Math.round(netProfit) },
  ];

  const insights: string[] = [
    `Your investment of ₹${investmentCost.toLocaleString("en-IN")} returned ₹${Math.round(netProfit).toLocaleString("en-IN")} in net profit — an ROI of ${roiPercent.toFixed(2)}% over ${years} year(s).`,
    `Annualized, that's ${annualizedRoiPercent.toFixed(2)}% per year — useful for comparing against other investments with different time horizons.`,
  ];

  return {
    outputs: {
      netProfit: Math.round(netProfit),
      roiPercent: Math.round(roiPercent * 100) / 100,
      annualizedRoiPercent: Math.round(annualizedRoiPercent * 100) / 100,
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
