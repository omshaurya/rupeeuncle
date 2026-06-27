import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * NPS (National Pension System) Calculator.
 *
 * Accumulation phase uses the same SIP future-value math as the SIP calculator (monthly
 * contributions, annuity-due convention — deposit then grow):
 *   FV = P × [((1+i)^n − 1) / i] × (1+i)
 * Then at retirement, the corpus splits per current PFRDA rules:
 *   - Up to 60% can be withdrawn tax-free as lump sum
 *   - At least 40% must purchase an annuity, which pays a monthly pension based on an
 *     assumed annuity rate (NOT guaranteed — actual annuity rates vary by provider and
 *     prevailing rates at the time of retirement, often 5-7%)
 *
 * Verified against an independently published worked example (Zoho Payroll): ₹3,000/month
 * for 35 years at 10% p.a. → total investment ₹12,60,000, interest earned ₹1,02,24,830.
 * Both figures matched exactly.
 */
export const npsFormula: FormulaFn = (inputs) => {
  const monthlyContribution = inputs.monthlyContribution ?? 0;
  const currentAge = inputs.currentAge ?? 30;
  const retirementAge = inputs.retirementAge ?? 60;
  const expectedAnnualReturn = inputs.expectedAnnualReturn ?? 10;
  const annuityPercent = inputs.annuityPercent ?? 40; // minimum mandatory is 40%
  const annuityRate = inputs.annuityRate ?? 6; // assumed annuity payout rate

  const monthlyRate = expectedAnnualReturn / 12 / 100;
  const totalYears = Math.max(0, retirementAge - currentAge);
  const totalMonths = Math.round(totalYears * 12);

  const yearlyData: YearlyRow[] = [];
  let balance = 0;
  let totalInvested = 0;

  for (let month = 1; month <= totalMonths; month++) {
    balance = (balance + monthlyContribution) * (1 + monthlyRate);
    totalInvested += monthlyContribution;

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

  const totalCorpus = Math.round(balance);
  const totalInvestedAmount = Math.round(totalInvested);
  const interestEarned = totalCorpus - totalInvestedAmount;

  const annuityCorpus = Math.round(totalCorpus * (annuityPercent / 100));
  const lumpSumWithdrawal = totalCorpus - annuityCorpus;
  const monthlyPension = Math.round((annuityCorpus * (annuityRate / 100)) / 12);

  const pieData = [
    { name: "Total Invested", value: totalInvestedAmount },
    { name: "Interest Earned", value: interestEarned },
  ];

  const insights: string[] = [
    `Your NPS corpus at retirement is estimated at ₹${totalCorpus.toLocaleString("en-IN")}.`,
    `Of this, you can withdraw ₹${lumpSumWithdrawal.toLocaleString("en-IN")} (${100 - annuityPercent}%) tax-free as a lump sum, while ₹${annuityCorpus.toLocaleString("en-IN")} (${annuityPercent}%) is used to purchase an annuity.`,
    `Assuming a ${annuityRate}% annuity rate, your estimated monthly pension is ₹${monthlyPension.toLocaleString("en-IN")}. Note: this monthly pension from the annuity is taxable as per your income slab at the time, unlike the lump sum.`,
  ];

  return {
    outputs: {
      totalCorpus,
      lumpSumWithdrawal,
      monthlyPension,
    },
    yearlyData,
    pieData,
    insights,
  };
};
