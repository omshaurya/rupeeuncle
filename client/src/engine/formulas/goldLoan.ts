import type { FormulaFn } from "../../types/calculator";

/**
 * Gold Loan Eligibility Calculator.
 *
 * Loan Amount = Gold Value × LTV%
 * Gold Value = Weight (grams) × Purity Factor × Rate per gram (24K reference)
 *
 * LTV follows RBI's TIERED structure, effective 1 April 2026 (a real recent regulatory
 * change, not the older flat-75% rule still described on some unmaintained sites):
 *   - Loans up to ₹2.5 lakh: up to 85% LTV
 *   - Loans ₹2.5-5 lakh: up to 80% LTV
 *   - Loans above ₹5 lakh: up to 75% LTV (the RBI ceiling for larger loans)
 *
 * Purity factor converts the entered karat to a fraction of 24K value (e.g. 22K = 22/24).
 * The actual EMI on the resulting loan amount uses the same already-verified EMI formula.
 */
export const goldLoanFormula: FormulaFn = (inputs) => {
  const goldWeightGrams = inputs.goldWeightGrams ?? 0;
  const goldPurityKarat = inputs.goldPurityKarat ?? 22;
  const goldRatePerGram24k = inputs.goldRatePerGram24k ?? 9500; // approximate, user-editable
  const annualInterestRate = inputs.annualInterestRate ?? 9;
  const tenureMonths = inputs.tenureMonths ?? 12;

  const purityFactor = goldPurityKarat / 24;
  const goldValue = goldWeightGrams * purityFactor * goldRatePerGram24k;

  // Determine the applicable LTV tier — note this depends on the resulting loan amount,
  // so we iterate: try the highest tier first and check if the resulting loan falls within it
  let ltvPercent: number;
  let provisionalLoan = goldValue * 0.85;
  if (provisionalLoan <= 250000) {
    ltvPercent = 85;
  } else {
    provisionalLoan = goldValue * 0.8;
    if (provisionalLoan <= 500000) {
      ltvPercent = 80;
    } else {
      ltvPercent = 75;
    }
  }

  const eligibleLoanAmount = Math.round(goldValue * (ltvPercent / 100));

  const monthlyRate = annualInterestRate / 12 / 100;
  let emi = 0;
  if (monthlyRate === 0) {
    emi = eligibleLoanAmount / tenureMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    emi = (eligibleLoanAmount * monthlyRate * factor) / (factor - 1);
  }

  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - eligibleLoanAmount;

  const pieData = [
    { name: "Eligible Loan Amount", value: eligibleLoanAmount },
    { name: "Total Interest", value: Math.round(totalInterest) },
  ];

  const insights: string[] = [
    `Your gold (${goldWeightGrams}g, ${goldPurityKarat}K) is valued at approximately ₹${Math.round(goldValue).toLocaleString("en-IN")}. At a ${ltvPercent}% LTV (per RBI's tiered structure effective April 2026), you're eligible for a loan of ₹${eligibleLoanAmount.toLocaleString("en-IN")}.`,
    `Your monthly EMI would be approximately ₹${Math.round(emi).toLocaleString("en-IN")} over ${tenureMonths} months, with total interest of ₹${Math.round(totalInterest).toLocaleString("en-IN")}.`,
    "Many lenders also offer bullet repayment (pay all interest and principal at maturity) instead of EMIs for gold loans — check with your lender which structure suits your cash flow.",
  ];

  return {
    outputs: {
      eligibleLoanAmount,
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
