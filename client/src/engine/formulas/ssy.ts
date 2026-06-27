import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Sukanya Samriddhi Yojana (SSY) Calculator.
 *
 * Structurally similar to PPF (annual deposits, annual compounding) but with a key
 * difference: deposits are only allowed for the first 15 years, while the account
 * continues compounding for a full 21 years from opening. So years 16-21 have zero new
 * contributions but the existing balance keeps earning interest.
 *
 * Uses the same annuity-due convention as the PPF formula (deposit at start of year,
 * full year's interest applied) for the deposit phase, then pure compounding for the
 * remaining years with no new deposits.
 *
 * Verified against Axis Max Life's published worked example: ₹1,00,000/year for 15 years
 * at 8.2% → interest earned ₹32,88,079, maturity amount ₹47,88,079 at year 21. Both
 * figures matched exactly.
 */
export const ssyFormula: FormulaFn = (inputs) => {
  const annualDeposit = inputs.annualDeposit ?? 0;
  const interestRate = inputs.interestRate ?? 8.2;
  const girlChildCurrentAge = inputs.girlChildCurrentAge ?? 5;

  const i = interestRate / 100;
  const depositYears = 15;
  const maturityYears = 21;

  const yearlyData: YearlyRow[] = [];
  let balance = 0;
  let totalInvested = 0;

  for (let year = 1; year <= maturityYears; year++) {
    if (year <= depositYears) {
      balance = (balance + annualDeposit) * (1 + i);
      totalInvested += annualDeposit;
    } else {
      // No new deposits allowed after year 15 — balance simply continues compounding
      balance = balance * (1 + i);
    }

    yearlyData.push({
      year,
      invested: Math.round(totalInvested),
      returns: Math.round(balance - totalInvested),
      balance: Math.round(balance),
    });
  }

  const maturityAmount = Math.round(balance);
  const totalInvestedAmount = Math.round(totalInvested);
  const totalInterestEarned = maturityAmount - totalInvestedAmount;
  const maturityAge = girlChildCurrentAge + maturityYears;

  const pieData = [
    { name: "Total Invested", value: totalInvestedAmount },
    { name: "Interest Earned", value: totalInterestEarned },
  ];

  const insights: string[] = [
    `Depositing ₹${annualDeposit.toLocaleString("en-IN")} per year for 15 years grows to ₹${maturityAmount.toLocaleString("en-IN")} when your daughter turns ${maturityAge} (21 years after account opening).`,
    "Deposits are only required for the first 15 years — the balance continues earning interest for the remaining 6 years until maturity with no further contribution needed.",
    "SSY enjoys EEE tax status: contributions (up to ₹1.5 lakh under Section 80C), interest, and the maturity amount are all completely tax-free.",
  ];

  return {
    outputs: {
      totalInvestedAmount,
      totalInterestEarned,
      maturityAmount,
    },
    yearlyData,
    pieData,
    insights,
  };
};
