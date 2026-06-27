import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * XIRR (Extended Internal Rate of Return) Calculator.
 *
 * Solves for the annualized rate r such that:
 *   Σ [CFi / (1 + r)^((di − d0) / 365)] = 0
 * where CFi = cash flow amount (negative for investments/outflows, positive for
 * redemptions/current value), di = date of cash flow i, d0 = date of the first cash flow.
 *
 * There's no closed-form algebraic solution — this uses Newton-Raphson iteration,
 * matching the method used by Excel's XIRR() function and every major XIRR calculator.
 *
 * IMPORTANT — INPUT SHAPE MISMATCH: this calculator's natural input is a list of
 * (date, amount) transactions, not a handful of scalar slider values like every other
 * calculator in this engine. Rather than force a bad fit into the generic
 * CalculatorInputForm (which only renders sliders/number inputs/selects), this formula
 * expects a FIXED set of up to 6 transaction slots passed as numbered inputs:
 *   cf1Amount, cf1DaysFromStart, cf2Amount, cf2DaysFromStart, ... cf6Amount, cf6DaysFromStart
 * This is a pragmatic compromise for the MVP. A proper version needs a dedicated
 * "TransactionListInput" component (dynamic add/remove rows with date pickers) — flagged
 * as a follow-up rather than silently bolted on, since building that well is its own task.
 *
 * VERIFICATION: tested against a clean textbook case (₹1,000 invested, ₹1,100 returned
 * exactly 1 year later) — correctly solves to exactly 10.00%. Also cross-checked against a
 * published worked example with exact dates; when reconstructed precisely, this solver
 * correctly finds the rate that drives NPV to ~0, while that source's own stated answer
 * left its NPV equation far from zero — i.e. the published reference figure didn't actually
 * satisfy its own cash flows. Lesson applied here: a reference number is only trustworthy
 * once you confirm it actually zeroes the NPV equation, not just because it's published on
 * a finance site.
 */

interface CashFlow {
  amount: number;
  daysFromStart: number;
}

function npv(rate: number, cashFlows: CashFlow[]): number {
  return cashFlows.reduce(
    (sum, cf) => sum + cf.amount / Math.pow(1 + rate, cf.daysFromStart / 365),
    0
  );
}

function npvDerivative(rate: number, cashFlows: CashFlow[]): number {
  return cashFlows.reduce((sum, cf) => {
    const t = cf.daysFromStart / 365;
    if (t === 0) return sum;
    return sum - (t * cf.amount) / Math.pow(1 + rate, t + 1);
  }, 0);
}

/** Newton-Raphson root finder, matching Excel's XIRR() convergence approach. */
function solveXirr(cashFlows: CashFlow[], guess = 0.1): number | null {
  let rate = guess;
  const maxIterations = 100;
  const tolerance = 1e-7;

  for (let i = 0; i < maxIterations; i++) {
    const value = npv(rate, cashFlows);
    const derivative = npvDerivative(rate, cashFlows);

    if (Math.abs(derivative) < 1e-12) break; // avoid division by ~0

    const nextRate = rate - value / derivative;

    if (Math.abs(nextRate - rate) < tolerance) {
      return nextRate;
    }
    rate = nextRate;

    // Guard against runaway divergence (e.g. all-same-sign cash flows have no valid root)
    if (!isFinite(rate) || rate < -0.999) return null;
  }

  return Math.abs(npv(rate, cashFlows)) < 1 ? rate : null;
}

export const xirrFormula: FormulaFn = (inputs) => {
  const cashFlows: CashFlow[] = [];

  for (let i = 1; i <= 6; i++) {
    const amount = inputs[`cf${i}Amount`];
    const days = inputs[`cf${i}DaysFromStart`];
    if (amount !== undefined && amount !== 0) {
      cashFlows.push({ amount, daysFromStart: days ?? 0 });
    }
  }

  const totalInvested = cashFlows
    .filter((cf) => cf.amount < 0)
    .reduce((sum, cf) => sum + Math.abs(cf.amount), 0);
  const totalReturned = cashFlows
    .filter((cf) => cf.amount > 0)
    .reduce((sum, cf) => sum + cf.amount, 0);

  const solvedRate = cashFlows.length >= 2 ? solveXirr(cashFlows) : null;
  const xirrPercent = solvedRate !== null ? solvedRate * 100 : 0;

  const yearlyData: YearlyRow[] = cashFlows.map((cf, i) => ({
    year: i + 1,
    invested: cf.amount < 0 ? Math.abs(Math.round(cf.amount)) : 0,
    returns: cf.amount > 0 ? Math.round(cf.amount) : 0,
    balance: Math.round(cf.amount),
  }));

  const pieData = [
    { name: "Total Invested", value: Math.round(totalInvested) },
    { name: "Total Returned", value: Math.round(totalReturned) },
  ];

  const insights: string[] = [];
  if (solvedRate === null) {
    insights.push(
      "Could not compute a valid XIRR for these cash flows. Make sure you have at least one negative (investment) and one positive (return/current value) entry."
    );
  } else {
    insights.push(
      `Your investment's annualized return (XIRR) is ${xirrPercent.toFixed(2)}%, accounting for the exact timing of each cash flow.`
    );
    insights.push(
      "XIRR is the industry-standard way mutual fund houses report SIP and irregular investment returns — more accurate than simple CAGR for multiple cash flows."
    );
  }

  return {
    outputs: {
      xirrPercent: Math.round(xirrPercent * 100) / 100,
      totalInvested: Math.round(totalInvested),
      totalReturned: Math.round(totalReturned),
    },
    yearlyData,
    pieData,
    insights,
  };
};
