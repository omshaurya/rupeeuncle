import type { FormulaFn } from "../../types/calculator";

/**
 * Net Worth Calculator.
 *
 * Net Worth = Total Assets − Total Liabilities
 *
 * This is pure arithmetic with no compounding or rate assumptions to verify — the only
 * "formula" is addition and subtraction across categories. Provided as a snapshot
 * calculator (single point in time), not a projection.
 */
export const netWorthFormula: FormulaFn = (inputs) => {
  const cashAndSavings = inputs.cashAndSavings ?? 0;
  const investments = inputs.investments ?? 0;
  const realEstateValue = inputs.realEstateValue ?? 0;
  const otherAssets = inputs.otherAssets ?? 0;

  const homeLoanOutstanding = inputs.homeLoanOutstanding ?? 0;
  const otherLoansOutstanding = inputs.otherLoansOutstanding ?? 0;
  const creditCardDues = inputs.creditCardDues ?? 0;

  const totalAssets = cashAndSavings + investments + realEstateValue + otherAssets;
  const totalLiabilities = homeLoanOutstanding + otherLoansOutstanding + creditCardDues;
  const netWorth = totalAssets - totalLiabilities;

  const pieData = [
    { name: "Cash & Savings", value: Math.round(cashAndSavings) },
    { name: "Investments", value: Math.round(investments) },
    { name: "Real Estate", value: Math.round(realEstateValue) },
    { name: "Other Assets", value: Math.round(otherAssets) },
  ].filter((d) => d.value > 0);

  const insights: string[] = [
    `Your total assets are ₹${Math.round(totalAssets).toLocaleString("en-IN")} and total liabilities are ₹${Math.round(totalLiabilities).toLocaleString("en-IN")}, giving a net worth of ₹${Math.round(netWorth).toLocaleString("en-IN")}.`,
  ];

  if (netWorth < 0) {
    insights.push(
      "Your liabilities currently exceed your assets. This is common with home loans early in repayment — focus on paying down high-interest debt and building assets over time."
    );
  } else {
    const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
    insights.push(
      `Your debt-to-asset ratio is ${debtToAssetRatio.toFixed(1)}% — generally, keeping this below 50% is considered financially healthy.`
    );
  }

  return {
    outputs: {
      totalAssets: Math.round(totalAssets),
      totalLiabilities: Math.round(totalLiabilities),
      netWorth: Math.round(netWorth),
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
