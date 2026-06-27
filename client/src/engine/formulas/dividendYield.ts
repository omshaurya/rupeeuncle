import type { FormulaFn } from "../../types/calculator";

/**
 * Dividend Yield Calculator.
 *
 * Dividend Yield (%) = (Annual Dividend per Share / Current Share Price) × 100
 *
 * Standard, universally-agreed financial ratio — no India-specific variation in the
 * formula itself. Also computes total expected annual dividend income for a given
 * holding size, and the tax treatment note (dividends are taxable in the hands of the
 * investor at slab rate since the Dividend Distribution Tax was abolished in 2020).
 */
export const dividendYieldFormula: FormulaFn = (inputs) => {
  const sharePrice = inputs.sharePrice ?? 0;
  const annualDividendPerShare = inputs.annualDividendPerShare ?? 0;
  const numberOfShares = inputs.numberOfShares ?? 0;
  const slabRate = inputs.slabRate ?? 30;

  const dividendYieldPercent =
    sharePrice > 0 ? (annualDividendPerShare / sharePrice) * 100 : 0;

  const totalInvestmentValue = sharePrice * numberOfShares;
  const totalAnnualDividend = annualDividendPerShare * numberOfShares;
  const taxOnDividend = totalAnnualDividend * (slabRate / 100);
  const netDividendIncome = totalAnnualDividend - taxOnDividend;

  const pieData = [
    { name: "Net Dividend Income", value: Math.round(netDividendIncome) },
    { name: "Tax on Dividend", value: Math.round(taxOnDividend) },
  ];

  const insights: string[] = [
    `This stock's dividend yield is ${dividendYieldPercent.toFixed(2)}% at the current price of ₹${sharePrice.toLocaleString("en-IN")}.`,
    `On your holding of ${numberOfShares.toLocaleString("en-IN")} shares (₹${Math.round(totalInvestmentValue).toLocaleString("en-IN")} invested), you'd receive approximately ₹${Math.round(totalAnnualDividend).toLocaleString("en-IN")} in annual dividends before tax.`,
    "Dividends are fully taxable in your hands at your income tax slab rate (Dividend Distribution Tax was abolished in 2020) — there's no separate concessional rate or exemption threshold for dividend income.",
  ];

  return {
    outputs: {
      dividendYieldPercent: Math.round(dividendYieldPercent * 100) / 100,
      totalAnnualDividend: Math.round(totalAnnualDividend),
      netDividendIncome: Math.round(netDividendIncome),
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
