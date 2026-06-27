import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Loan Eligibility Calculator — FOIR (Fixed Obligation to Income Ratio) method.
 *
 * This is the method Indian banks use to determine how much loan a salaried applicant
 * qualifies for. Different calculation shape from every other loan calculator: instead of
 * "given a loan amount, find the EMI," this solves "given an affordable EMI, find the
 * maximum loan amount" — the inverse of the standard EMI formula.
 *
 * Step 1 — Maximum eligible EMI:
 *   Max EMI = (Net Monthly Income × FOIR%) − Existing EMIs
 * Step 2 — Maximum loan amount (inverse EMI / PMT formula):
 *   P = EMI × [(1+r)^n − 1] / [r × (1+r)^n]
 * where r = monthly interest rate, n = tenure in months.
 *
 * Verified the FOIR step exactly against Piramal Finance's published example (₹37,500
 * eligible EMI after FOIR, minus ₹10,000 existing EMI = ₹27,500 net eligible EMI — matches
 * exactly). Could not independently verify their final loan-amount figure (₹50L) because
 * their published example didn't state the interest rate or tenure assumption used to
 * convert EMI to loan amount — the PMT-inverse formula in Step 2 is the same one already
 * verified against the EMI calculator's reference cases, so it's trusted on that basis
 * rather than against a number that can't be reproduced without missing inputs.
 */
export const loanEligibilityFormula: FormulaFn = (inputs) => {
  const netMonthlyIncome = inputs.netMonthlyIncome ?? 0;
  const existingMonthlyEmi = inputs.existingMonthlyEmi ?? 0;
  const foirPercent = inputs.foirPercent ?? 50;
  const annualInterestRate = inputs.annualInterestRate ?? 8.5;
  const tenureYears = inputs.tenureYears ?? 20;

  const maxEligibleEmi = Math.max(
    0,
    netMonthlyIncome * (foirPercent / 100) - existingMonthlyEmi
  );

  const monthlyRate = annualInterestRate / 12 / 100;
  const totalMonths = Math.round(tenureYears * 12);

  let maxLoanAmount = 0;
  if (monthlyRate === 0) {
    maxLoanAmount = maxEligibleEmi * totalMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    maxLoanAmount = (maxEligibleEmi * (factor - 1)) / (monthlyRate * factor);
  }

  const totalInterestPayable = Math.round(maxEligibleEmi * totalMonths - maxLoanAmount);

  // Show eligibility at a few different tenure options for comparison, since tenure is
  // the lever with the biggest effect on eligible amount.
  const tenureOptions = [10, 15, 20, 25, 30].filter((t) => t <= 30);
  const yearlyData: YearlyRow[] = tenureOptions.map((years, i) => {
    const months = years * 12;
    let loanAtTenure = 0;
    if (monthlyRate === 0) {
      loanAtTenure = maxEligibleEmi * months;
    } else {
      const f = Math.pow(1 + monthlyRate, months);
      loanAtTenure = (maxEligibleEmi * (f - 1)) / (monthlyRate * f);
    }
    return {
      year: i + 1,
      invested: years, // repurposed: tenure in years, for display in comparison table
      returns: 0,
      balance: Math.round(loanAtTenure),
    };
  });

  const pieData = [
    { name: "Existing EMI Obligations", value: Math.round(existingMonthlyEmi) },
    { name: "Available for New EMI", value: Math.round(maxEligibleEmi) },
  ];

  const insights: string[] = [
    `Based on a ${foirPercent}% FOIR, you can afford a maximum EMI of ₹${Math.round(maxEligibleEmi).toLocaleString("en-IN")} per month.`,
    `At ${annualInterestRate}% interest over ${tenureYears} years, this makes you eligible for a loan of approximately ₹${Math.round(maxLoanAmount).toLocaleString("en-IN")}.`,
    "This is an estimate based on standard FOIR rules (40-60%). Actual bank eligibility also depends on your credit score, employment type, and the lender's specific policies.",
  ];

  return {
    outputs: {
      maxEligibleEmi: Math.round(maxEligibleEmi),
      maxLoanAmount: Math.round(maxLoanAmount),
      totalInterestPayable: Math.max(0, totalInterestPayable),
    },
    yearlyData,
    pieData,
    insights,
  };
};
