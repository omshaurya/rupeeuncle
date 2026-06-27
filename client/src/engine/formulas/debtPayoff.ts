import type { FormulaFn, YearlyRow } from "../../types/calculator";

interface Debt {
  name: string;
  balance: number;
  annualRate: number;
  minPayment: number;
}

/**
 * Debt Payoff Calculator — Snowball vs Avalanche methods.
 *
 * Both methods make minimum payments on every debt, then direct ALL extra payment budget
 * toward ONE target debt:
 *   - Snowball: target the smallest BALANCE first (psychological quick wins)
 *   - Avalanche: target the highest INTEREST RATE first (mathematically optimal)
 * Once the target debt is paid off, its entire payment (minimum + rollover) "snowballs"
 * onto the next target debt. This is simulated month-by-month using standard monthly
 * interest accrual (same convention as the EMI calculator's amortization, already verified).
 *
 * Supports up to 4 debts for this MVP — covers the common case (credit card + 2-3 loans)
 * without needing a dynamic add/remove row UI.
 */
function simulatePayoff(
  debts: Debt[],
  extraPayment: number,
  method: "snowball" | "avalanche"
): { totalMonths: number; totalInterestPaid: number; payoffOrder: string[] } {
  const working = debts.map((d) => ({ ...d, currentBalance: d.balance }));
  let totalInterestPaid = 0;
  let month = 0;
  const payoffOrder: string[] = [];
  const maxMonths = 600; // 50-year safety cap to prevent infinite loops on under-funded plans

  while (working.some((d) => d.currentBalance > 0.01) && month < maxMonths) {
    month++;

    // Determine current target debt (smallest balance for snowball, highest rate for avalanche)
    const active = working.filter((d) => d.currentBalance > 0.01);
    const target =
      method === "snowball"
        ? active.reduce((min, d) => (d.currentBalance < min.currentBalance ? d : min))
        : active.reduce((max, d) => (d.annualRate > max.annualRate ? d : max));

    // Accrue interest and apply minimum payment to every active debt
    for (const debt of active) {
      const monthlyRate = debt.annualRate / 12 / 100;
      const interest = debt.currentBalance * monthlyRate;
      totalInterestPaid += interest;
      debt.currentBalance += interest;

      const payment =
        debt === target
          ? debt.minPayment + extraPayment
          : Math.min(debt.minPayment, debt.currentBalance);
      debt.currentBalance = Math.max(0, debt.currentBalance - payment);

      if (debt.currentBalance <= 0.01 && !payoffOrder.includes(debt.name)) {
        payoffOrder.push(debt.name);
      }
    }
  }

  return { totalMonths: month, totalInterestPaid: Math.round(totalInterestPaid), payoffOrder };
}

export const debtPayoffFormula: FormulaFn = (inputs) => {
  const debts: Debt[] = [];
  for (let i = 1; i <= 4; i++) {
    const balance = inputs[`debt${i}Balance`];
    if (balance && balance > 0) {
      debts.push({
        name: `Debt ${i}`,
        balance,
        annualRate: inputs[`debt${i}Rate`] ?? 0,
        minPayment: inputs[`debt${i}MinPayment`] ?? 0,
      });
    }
  }

  const extraPayment = inputs.extraMonthlyPayment ?? 0;
  const useSnowball = (inputs.method ?? 0) === 0; // 0 = snowball, 1 = avalanche

  if (debts.length === 0) {
    return {
      outputs: { totalMonths: 0, totalInterestPaid: 0, totalDebt: 0 },
      yearlyData: [],
      pieData: [],
      insights: ["Enter at least one debt to see your payoff plan."],
    };
  }

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const result = simulatePayoff(debts, extraPayment, useSnowball ? "snowball" : "avalanche");

  // Also compute the OTHER method for comparison in insights
  const otherResult = simulatePayoff(
    debts,
    extraPayment,
    useSnowball ? "avalanche" : "snowball"
  );

  const yearlyData: YearlyRow[] = [];
  const totalYears = Math.ceil(result.totalMonths / 12);
  for (let y = 1; y <= totalYears; y++) {
    const monthsElapsed = Math.min(y * 12, result.totalMonths);
    const progressFraction = monthsElapsed / result.totalMonths;
    yearlyData.push({
      year: y,
      invested: Math.round(totalDebt * progressFraction),
      returns: 0,
      balance: Math.round(totalDebt * (1 - progressFraction)),
    });
  }

  const pieData = [
    { name: "Principal", value: Math.round(totalDebt) },
    { name: "Total Interest Paid", value: result.totalInterestPaid },
  ];

  const methodName = useSnowball ? "Snowball" : "Avalanche";
  const otherMethodName = useSnowball ? "Avalanche" : "Snowball";
  const interestDiff = result.totalInterestPaid - otherResult.totalInterestPaid;

  const insights: string[] = [
    `Using the ${methodName} method, you'll be debt-free in ${result.totalMonths} months, paying ₹${result.totalInterestPaid.toLocaleString("en-IN")} in total interest.`,
    `Payoff order: ${result.payoffOrder.join(" → ")}.`,
  ];

  if (Math.abs(interestDiff) > 100) {
    insights.push(
      interestDiff > 0
        ? `The ${otherMethodName} method would save you ₹${Math.abs(interestDiff).toLocaleString("en-IN")} in interest, though ${methodName} may help you stay motivated with faster early wins.`
        : `${methodName} also saves you ₹${Math.abs(interestDiff).toLocaleString("en-IN")} compared to ${otherMethodName} in this case.`
    );
  }

  return {
    outputs: {
      totalMonths: result.totalMonths,
      totalInterestPaid: result.totalInterestPaid,
      totalDebt: Math.round(totalDebt),
    },
    yearlyData,
    pieData,
    insights,
  };
};
