import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * Loan Prepayment Calculator.
 *
 * Simulates a standard EMI amortization (same verified logic as emi.ts) but allows an
 * additional one-time or recurring prepayment toward principal, then compares total
 * interest and tenure against the no-prepayment baseline.
 *
 * Reduces tenure when prepayment is applied (EMI stays the same, but the loan finishes
 * earlier) — the standard "prepay to reduce tenure" approach most Indian lenders default to.
 */
export const prepaymentFormula: FormulaFn = (inputs) => {
  const loanAmount = inputs.loanAmount ?? 0;
  const annualInterestRate = inputs.annualInterestRate ?? 0;
  const originalTenureYears = inputs.originalTenureYears ?? 0;
  const oneTimePrepayment = inputs.oneTimePrepayment ?? 0;
  const prepaymentMonth = inputs.prepaymentMonth ?? 12;
  const recurringExtraPayment = inputs.recurringExtraPayment ?? 0;

  const monthlyRate = annualInterestRate / 12 / 100;
  const originalTotalMonths = Math.round(originalTenureYears * 12);

  let emi = 0;
  if (monthlyRate === 0) {
    emi = originalTotalMonths > 0 ? loanAmount / originalTotalMonths : 0;
  } else {
    const factor = Math.pow(1 + monthlyRate, originalTotalMonths);
    emi = (loanAmount * monthlyRate * factor) / (factor - 1);
  }

  // Baseline: no prepayment
  let baselineBalance = loanAmount;
  let baselineInterest = 0;
  for (let m = 1; m <= originalTotalMonths; m++) {
    const interest = baselineBalance * monthlyRate;
    baselineInterest += interest;
    baselineBalance = Math.max(0, baselineBalance - (emi - interest));
  }

  // With prepayment: apply one-time lumpsum at prepaymentMonth, plus optional recurring extra
  const yearlyData: YearlyRow[] = [];
  let balance = loanAmount;
  let totalInterestPaid = 0;
  let actualMonths = 0;

  for (let m = 1; m <= originalTotalMonths && balance > 0.01; m++) {
    const interest = balance * monthlyRate;
    totalInterestPaid += interest;
    let principalPayment = emi - interest + recurringExtraPayment;

    if (m === prepaymentMonth) {
      principalPayment += oneTimePrepayment;
    }

    balance = Math.max(0, balance - principalPayment);
    actualMonths = m;

    if (m % 12 === 0 || balance <= 0.01) {
      yearlyData.push({
        year: Math.ceil(m / 12),
        invested: Math.round(loanAmount - balance),
        returns: Math.round(totalInterestPaid),
        balance: Math.round(balance),
      });
    }
  }

  const interestSaved = Math.round(baselineInterest - totalInterestPaid);
  const tenureReducedMonths = originalTotalMonths - actualMonths;

  const pieData = [
    { name: "Interest Without Prepayment", value: Math.round(baselineInterest) },
    { name: "Interest With Prepayment", value: Math.round(totalInterestPaid) },
  ];

  const insights: string[] = [
    `By prepaying, you save ₹${interestSaved.toLocaleString("en-IN")} in interest and finish your loan ${tenureReducedMonths} months (${(tenureReducedMonths / 12).toFixed(1)} years) earlier.`,
    `Your loan completes in ${actualMonths} months instead of the original ${originalTotalMonths} months, while your EMI stays the same at ₹${Math.round(emi).toLocaleString("en-IN")}.`,
  ];

  if (interestSaved <= 0) {
    insights[0] = "Enter a prepayment amount to see your potential interest savings.";
  }

  return {
    outputs: {
      interestSaved: Math.max(0, interestSaved),
      tenureReducedMonths: Math.max(0, tenureReducedMonths),
      newTotalMonths: actualMonths,
    },
    yearlyData,
    pieData,
    insights,
  };
};
