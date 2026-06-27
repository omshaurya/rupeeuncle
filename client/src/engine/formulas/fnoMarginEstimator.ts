import type { FormulaFn } from "../../types/calculator";

/**
 * F&O Margin Estimator (Futures/Short Options).
 *
 * IMPORTANT — HONEST SCOPE LIMITATION: real exchange margin (SPAN margin) is computed by
 * NSE Clearing's proprietary risk-scenario engine, which models portfolio-level value-at-risk
 * across many simulated price/volatility scenarios, refreshed 6 times during the trading day.
 * It is NOT reproducible with a simple formula — every legitimate broker margin calculator
 * (Zerodha, Angel One, Samco, etc.) pulls live SPAN risk-parameter files directly from the
 * exchange rather than computing SPAN margin independently. Building a fake "SPAN formula"
 * here would silently understate or overstate real margin requirements, which could cause a
 * trader to take a position believing they have more buffer than they actually do.
 *
 * This calculator instead estimates only the EXPOSURE MARGIN component, which IS a publicly
 * documented, simple percentage-of-notional-value calculation (unlike SPAN):
 *   Index futures / short index options: 2% of contract value (Spot Price × Lot Size)
 *   Stock futures / short stock options: 3.5% of contract value (or 1.5× the standard
 *     deviation of the underlying's 6-month log returns, whichever is higher — this
 *     calculator uses the flat 3.5% reference rate since the volatility-based alternative
 *     requires historical price data this calculator doesn't have)
 *
 * Total initial margin = SPAN Margin + Exposure Margin. This calculator can only estimate
 * the exposure margin piece — for actual SPAN margin and therefore total margin required to
 * place a real trade, use your broker's margin calculator, which pulls live exchange data.
 */
export const fnoMarginEstimatorFormula: FormulaFn = (inputs) => {
  const spotPrice = inputs.spotPrice ?? 0;
  const lotSize = inputs.lotSize ?? 0;
  const isIndex = (inputs.isIndex ?? 1) === 1;
  const numberOfLots = inputs.numberOfLots ?? 1;

  const contractValuePerLot = spotPrice * lotSize;
  const totalContractValue = contractValuePerLot * numberOfLots;
  const exposureMarginRate = isIndex ? 0.02 : 0.035;
  const exposureMargin = totalContractValue * exposureMarginRate;

  const pieData = [
    { name: "Exposure Margin (estimated)", value: Math.round(exposureMargin) },
    { name: "Contract Value", value: Math.round(totalContractValue) },
  ];

  const insights: string[] = [
    `Estimated exposure margin for this position: ₹${Math.round(exposureMargin).toLocaleString("en-IN")} (${(exposureMarginRate * 100).toFixed(1)}% of the ₹${Math.round(totalContractValue).toLocaleString("en-IN")} contract value).`,
    "This is ONLY the exposure margin component. The actual total margin you need (SPAN + Exposure) will be higher and can only be calculated using live exchange risk-parameter data — check your broker's margin calculator (which pulls real-time SPAN files) before placing any trade.",
    "Never use this estimate alone to decide if you have sufficient margin for a real position — under-margining can lead to forced square-off by your broker.",
  ];

  return {
    outputs: {
      exposureMargin: Math.round(exposureMargin),
      totalContractValue: Math.round(totalContractValue),
      exposureMarginRate: exposureMarginRate * 100,
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
