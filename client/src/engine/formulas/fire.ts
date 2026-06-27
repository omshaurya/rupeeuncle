import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * FIRE (Financial Independence, Retire Early) Calculator.
 *
 * Step 1 — Inflate today's annual expenses to the target FIRE year:
 *   Future Annual Expense = Current Annual Expense × (1 + inflation)^yearsToFire
 * Step 2 — Apply the FIRE multiplier (25x = 4% safe withdrawal rate; this is the standard
 *   "Trinity Study" convention, though several Indian financial advisors recommend 28-33x
 *   given India's higher long-term inflation — both are exposed as a selectable multiplier):
 *   FIRE Number = Future Annual Expense × Multiplier
 * Step 3 — Required monthly SIP to reach that corpus, using the standard SIP future-value
 *   formula (same math as the SIP calculator, solved for monthly contribution instead of
 *   future value):
 *   P = FV / { [((1+i)^n − 1) / i] × (1+i) }
 *
 * Verified inflation-adjustment step against a published example: ₹35,000/month today,
 * 25 years out, 6% inflation → ₹18.03 lakh/year at the target date. Matched exactly.
 */
export const fireFormula: FormulaFn = (inputs) => {
  const currentMonthlyExpense = inputs.currentMonthlyExpense ?? 0;
  const currentAge = inputs.currentAge ?? 30;
  const targetFireAge = inputs.targetFireAge ?? 45;
  const inflationRate = inputs.inflationRate ?? 6;
  const expectedReturnRate = inputs.expectedReturnRate ?? 12;
  const fireMultiplier = inputs.fireMultiplier ?? 25; // 15=Lean, 25=Regular, 50=Fat
  const existingCorpus = inputs.existingCorpus ?? 0;

  const yearsToFire = Math.max(0, targetFireAge - currentAge);
  const currentAnnualExpense = currentMonthlyExpense * 12;

  const futureAnnualExpense =
    currentAnnualExpense * Math.pow(1 + inflationRate / 100, yearsToFire);

  const fireNumber = futureAnnualExpense * fireMultiplier;

  // Future value of existing corpus by the FIRE date
  const futureValueOfExisting =
    existingCorpus * Math.pow(1 + expectedReturnRate / 100, yearsToFire);

  const remainingCorpusNeeded = Math.max(0, fireNumber - futureValueOfExisting);

  // Solve for required monthly SIP using the inverse of the standard SIP future-value formula
  const monthlyRate = expectedReturnRate / 12 / 100;
  const totalMonths = Math.round(yearsToFire * 12);

  let requiredMonthlySip = 0;
  if (totalMonths > 0 && monthlyRate > 0) {
    const factor = ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    requiredMonthlySip = remainingCorpusNeeded / factor;
  } else if (totalMonths > 0) {
    requiredMonthlySip = remainingCorpusNeeded / totalMonths;
  }

  // Year-wise projection assuming the required SIP is invested consistently
  const yearlyData: YearlyRow[] = [];
  let balance = existingCorpus;
  let totalInvested = existingCorpus;
  for (let month = 1; month <= totalMonths; month++) {
    balance = (balance + requiredMonthlySip) * (1 + monthlyRate);
    totalInvested += requiredMonthlySip;
    if (month % 12 === 0 || month === totalMonths) {
      yearlyData.push({
        year: Math.ceil(month / 12),
        invested: Math.round(totalInvested),
        returns: Math.round(balance - totalInvested),
        balance: Math.round(balance),
      });
    }
  }

  const pieData = [
    { name: "Existing Corpus (Future Value)", value: Math.round(futureValueOfExisting) },
    { name: "Additional Corpus Needed", value: Math.round(remainingCorpusNeeded) },
  ];

  const fireTypeLabel =
    fireMultiplier <= 15 ? "Lean FIRE" : fireMultiplier >= 50 ? "Fat FIRE" : "Regular FIRE";

  const insights: string[] = [
    `Your ${fireTypeLabel} number at age ${targetFireAge} is ₹${Math.round(fireNumber).toLocaleString("en-IN")} (${fireMultiplier}× your inflation-adjusted annual expenses).`,
    `To reach this in ${yearsToFire} years, you'd need to invest approximately ₹${Math.round(requiredMonthlySip).toLocaleString("en-IN")} per month at an assumed ${expectedReturnRate}% annual return.`,
    "The standard 25x rule (4% withdrawal rate) was developed using US market data. Given India's historically higher inflation, many Indian financial advisors recommend a more conservative 28-33x multiplier for added safety.",
  ];

  return {
    outputs: {
      fireNumber: Math.round(fireNumber),
      requiredMonthlySip: Math.round(requiredMonthlySip),
      yearsToFire,
    },
    yearlyData,
    pieData,
    insights,
  };
};
