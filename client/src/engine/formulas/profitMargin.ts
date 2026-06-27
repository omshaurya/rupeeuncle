import type { FormulaFn } from "../../types/calculator";

/**
 * Profit Margin Calculator.
 *
 * Gross Margin (%) = (Revenue − COGS) / Revenue × 100
 * Operating Margin (%) = (Revenue − COGS − Operating Expenses) / Revenue × 100
 * Net Margin (%) = Net Profit / Revenue × 100, where Net Profit = Operating Profit − Taxes/Interest
 *
 * Standard accounting definitions — pure arithmetic, no compounding or external rates.
 */
export const profitMarginFormula: FormulaFn = (inputs) => {
  const revenue = inputs.revenue ?? 0;
  const cogs = inputs.cogs ?? 0;
  const operatingExpenses = inputs.operatingExpenses ?? 0;
  const taxesAndInterest = inputs.taxesAndInterest ?? 0;

  const grossProfit = revenue - cogs;
  const operatingProfit = grossProfit - operatingExpenses;
  const netProfit = operatingProfit - taxesAndInterest;

  const grossMarginPercent = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  const operatingMarginPercent = revenue > 0 ? (operatingProfit / revenue) * 100 : 0;
  const netMarginPercent = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  const pieData = [
    { name: "COGS", value: Math.round(cogs) },
    { name: "Operating Expenses", value: Math.round(operatingExpenses) },
    { name: "Taxes & Interest", value: Math.round(taxesAndInterest) },
    { name: "Net Profit", value: Math.round(netProfit) },
  ].filter((d) => d.value > 0);

  const insights: string[] = [
    `Gross Margin: ${grossMarginPercent.toFixed(1)}% | Operating Margin: ${operatingMarginPercent.toFixed(1)}% | Net Margin: ${netMarginPercent.toFixed(1)}%.`,
    `On revenue of ₹${revenue.toLocaleString("en-IN")}, your net profit is ₹${Math.round(netProfit).toLocaleString("en-IN")}.`,
  ];

  if (netMarginPercent < 0) {
    insights.push("Your business is currently operating at a net loss — costs exceed revenue.");
  }

  return {
    outputs: {
      grossMarginPercent: Math.round(grossMarginPercent * 100) / 100,
      operatingMarginPercent: Math.round(operatingMarginPercent * 100) / 100,
      netMarginPercent: Math.round(netMarginPercent * 100) / 100,
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
