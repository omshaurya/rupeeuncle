import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Step-Up SIP Calculator.
 *
 * A regular SIP where the monthly investment amount increases periodically. Supports TWO
 * step-up modes, since real platforms (Zerodha, Groww, ET Money) all offer both:
 *   - Percentage step-up: contribution × (1 + stepUp%) every 12 months (e.g. "increase by 10% every year")
 *   - Fixed-amount step-up: contribution + ₹stepUpAmount every 12 months (e.g. "add ₹1,000 more every year")
 * There's no clean closed-form formula for either (confirmed across multiple sources —
 * Zerodha explicitly states "there is no direct formula" for the percentage version), so
 * this simulates month-by-month: each month compounds the existing balance plus that
 * month's contribution, and the contribution itself steps up every 12 months per the
 * chosen mode.
 *
 * VERIFICATION (percentage mode): matched exactly against two independent published
 * examples — Zerodha (₹10,000/mo, 12% return, 10% step-up, 15yr → ₹86,83,849 maturity) and
 * MutualFundsSahiHai (₹5,000/mo, 12% return, 10% step-up, 10yr → ₹9,56,245 invested,
 * ₹16,87,163 maturity), both exact to the rupee. A third source (Angel One) matched our
 * invested amount exactly but quoted a different maturity value for the same inputs;
 * since two independent sources agree with this implementation and the third doesn't
 * self-consistently explain its own number, this formula's convention (deposit-then-grow,
 * matching the standard SIP annuity-due convention) is treated as correct.
 *
 * VERIFICATION (fixed-amount mode): no third-party published example was available for
 * this exact mode, so it was verified for internal consistency instead — confirmed it
 * reduces to the plain (non-step-up) SIP formula when stepUpAmount = 0, and confirmed the
 * total invested amount matches a manual year-by-year hand calculation (₹10,000/mo for
 * year 1, ₹11,000/mo for year 2, etc., for a ₹1,000/year step-up).
 */
export const stepUpSipFormula: FormulaFn = (inputs) => {
  const initialMonthlyInvestment = inputs.initialMonthlyInvestment ?? 0;
  const annualReturnRate = inputs.annualReturnRate ?? 0;
  const stepUpMode = inputs.stepUpMode ?? 0; // 0 = percentage, 1 = fixed rupee amount
  const stepUpPercent = inputs.stepUpPercent ?? 10;
  const stepUpAmount = inputs.stepUpAmount ?? 1000;
  const investmentPeriodYears = inputs.investmentPeriodYears ?? 0;

  const monthlyRate = annualReturnRate / 12 / 100;
  const totalMonths = Math.round(investmentPeriodYears * 12);
  const isFixedAmountMode = stepUpMode === 1;

  const yearlyData: YearlyRow[] = [];
  let balance = 0;
  let totalInvested = 0;
  let currentMonthlyInvestment = initialMonthlyInvestment;

  for (let month = 1; month <= totalMonths; month++) {
    // Step up the contribution at the start of every new year (month 13, 25, 37, ...)
    if (month > 1 && (month - 1) % 12 === 0) {
      currentMonthlyInvestment = isFixedAmountMode
        ? currentMonthlyInvestment + stepUpAmount
        : currentMonthlyInvestment * (1 + stepUpPercent / 100);
    }

    balance = (balance + currentMonthlyInvestment) * (1 + monthlyRate);
    totalInvested += currentMonthlyInvestment;

    if (month % 12 === 0 || month === totalMonths) {
      const year = Math.ceil(month / 12);
      yearlyData.push({
        year,
        invested: Math.round(totalInvested),
        returns: Math.round(balance - totalInvested),
        balance: Math.round(balance),
      });
    }
  }

  const maturityAmount = Math.round(balance);
  const totalInvestedAmount = Math.round(totalInvested);
  const estimatedReturns = maturityAmount - totalInvestedAmount;

  const pieData = [
    { name: "Total Invested", value: totalInvestedAmount },
    { name: "Estimated Returns", value: estimatedReturns },
  ];

  const stepUpDescription = isFixedAmountMode
    ? `increasing by ₹${stepUpAmount.toLocaleString("en-IN")} every year`
    : `increasing by ${stepUpPercent}% every year`;

  const insights: string[] = [
    `Starting at ₹${initialMonthlyInvestment.toLocaleString("en-IN")}/month and ${stepUpDescription}, your SIP grows to ₹${maturityAmount.toLocaleString("en-IN")} over ${investmentPeriodYears} years.`,
    `Your final monthly contribution would be approximately ₹${Math.round(currentMonthlyInvestment).toLocaleString("en-IN")}, compared to ₹${initialMonthlyInvestment.toLocaleString("en-IN")} when you started.`,
  ];

  return {
    outputs: {
      totalInvestedAmount,
      estimatedReturns,
      maturityAmount,
    },
    yearlyData,
    pieData,
    insights,
  };
};
