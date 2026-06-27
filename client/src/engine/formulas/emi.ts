import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * EMI (Equated Monthly Installment) calculator with full amortization schedule.
 *
 * Standard EMI formula:
 *   EMI = P × r × (1 + r)^n / [(1 + r)^n − 1]
 * where:
 *   P = loan principal
 *   r = monthly interest rate (annual rate / 12 / 100)
 *   n = loan tenure in months
 */
export const emiFormula: FormulaFn = (inputs) => {
  const loanAmount = inputs.loanAmount ?? 0;
  const annualInterestRate = inputs.annualInterestRate ?? 0;
  const loanTenureYears = inputs.loanTenureYears ?? 0;

  const monthlyRate = annualInterestRate / 12 / 100;
  const totalMonths = Math.round(loanTenureYears * 12);

  let emi = 0;
  if (monthlyRate === 0) {
    emi = totalMonths > 0 ? loanAmount / totalMonths : 0;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    emi = (loanAmount * monthlyRate * factor) / (factor - 1);
  }

  const yearlyData: YearlyRow[] = [];
  let outstandingPrincipal = loanAmount;
  let cumulativeInterest = 0;
  let cumulativePrincipalPaid = 0;

  for (let month = 1; month <= totalMonths; month++) {
    const interestForMonth = outstandingPrincipal * monthlyRate;
    const principalForMonth = emi - interestForMonth;

    outstandingPrincipal = Math.max(0, outstandingPrincipal - principalForMonth);
    cumulativeInterest += interestForMonth;
    cumulativePrincipalPaid += principalForMonth;

    if (month % 12 === 0 || month === totalMonths) {
      const year = Math.ceil(month / 12);
      yearlyData.push({
        year,
        invested: Math.round(cumulativePrincipalPaid), // principal repaid so far
        returns: Math.round(cumulativeInterest), // interest paid so far
        balance: Math.round(outstandingPrincipal), // remaining loan balance
        principalPaid: Math.round(cumulativePrincipalPaid),
        interestPaid: Math.round(cumulativeInterest),
        outstandingBalance: Math.round(outstandingPrincipal),
      });
    }
  }

  const totalPayment = Math.round(emi * totalMonths);
  const totalInterest = totalPayment - Math.round(loanAmount);

  const pieData = [
    { name: "Principal Amount", value: Math.round(loanAmount) },
    { name: "Total Interest", value: totalInterest },
  ];

  const insights: string[] = [
    `Your monthly EMI is ₹${Math.round(emi).toLocaleString("en-IN")} for a tenure of ${loanTenureYears} years.`,
    `Over the full tenure, you will pay ₹${totalInterest.toLocaleString("en-IN")} in interest on a principal of ₹${loanAmount.toLocaleString("en-IN")}.`,
  ];

  return {
    outputs: {
      emi: Math.round(emi),
      totalInterest,
      totalPayment,
    },
    yearlyData,
    pieData,
    insights,
  };
};
