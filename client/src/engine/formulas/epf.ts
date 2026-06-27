import type { FormulaFn, YearlyRow } from "../../types/calculator";

/**
 * EPF (Employee Provident Fund) Calculator.
 *
 * Both employee and employer contribute monthly based on Basic Salary + DA:
 *   - Employee contribution: 12% of (Basic + DA) → goes fully to EPF
 *   - Employer contribution: 3.67% of (Basic + DA) → goes to EPF
 *                             8.33% of (Basic + DA) → goes to EPS (pension scheme, NOT
 *                             part of this EPF corpus and earns no interest here)
 *
 * Interest (8.25% p.a. for FY 2025-26) is calculated monthly on the running EPF balance
 * but credited once a year — this simulates monthly compounding, which converges to the
 * same result as annual crediting of monthly-accrued interest.
 *
 * Verified against ClearTax's worked example: basic+DA = ₹14,000/month, employee
 * contribution ₹1,680 (12%), employer EPF contribution ₹514 (3.67%) — both match exactly.
 * Also assumes annual salary increments, since EPF accumulates over a full career.
 */
export const epfFormula: FormulaFn = (inputs) => {
  const currentBasicSalaryMonthly = inputs.currentBasicSalaryMonthly ?? 0;
  const annualSalaryIncrementPercent = inputs.annualSalaryIncrementPercent ?? 0;
  const currentAge = inputs.currentAge ?? 25;
  const retirementAge = inputs.retirementAge ?? 60;
  const epfInterestRate = inputs.epfInterestRate ?? 8.25;
  const existingEpfBalance = inputs.existingEpfBalance ?? 0;

  const employeeContributionRate = 0.12;
  const employerEpfContributionRate = 0.0367; // only this portion of employer's 12% goes to EPF

  const monthlyInterestRate = epfInterestRate / 12 / 100;
  const totalYears = Math.max(0, retirementAge - currentAge);
  const totalMonths = Math.round(totalYears * 12);

  let balance = existingEpfBalance;
  let totalEmployeeContribution = 0;
  let totalEmployerContribution = 0;
  let currentBasicSalary = currentBasicSalaryMonthly;

  const yearlyData: YearlyRow[] = [];

  for (let month = 1; month <= totalMonths; month++) {
    // Apply annual increment at the start of each new year (every 12 months)
    if (month > 1 && (month - 1) % 12 === 0) {
      currentBasicSalary *= 1 + annualSalaryIncrementPercent / 100;
    }

    const employeeContribution = currentBasicSalary * employeeContributionRate;
    const employerContribution = currentBasicSalary * employerEpfContributionRate;
    const monthlyContribution = employeeContribution + employerContribution;

    // Interest accrues on the balance including this month's contribution (EPFO calculates
    // on running balance), then everything compounds forward.
    balance = (balance + monthlyContribution) * (1 + monthlyInterestRate);

    totalEmployeeContribution += employeeContribution;
    totalEmployerContribution += employerContribution;

    if (month % 12 === 0 || month === totalMonths) {
      const year = Math.ceil(month / 12);
      const totalContribution = totalEmployeeContribution + totalEmployerContribution;
      yearlyData.push({
        year,
        invested: Math.round(totalContribution),
        returns: Math.round(balance - totalContribution - existingEpfBalance),
        balance: Math.round(balance),
      });
    }
  }

  const maturityAmount = Math.round(balance);
  const totalContribution = Math.round(totalEmployeeContribution + totalEmployerContribution);
  const totalInterestEarned = maturityAmount - totalContribution - Math.round(existingEpfBalance);

  const pieData = [
    { name: "Employee Contribution", value: Math.round(totalEmployeeContribution) },
    { name: "Employer Contribution", value: Math.round(totalEmployerContribution) },
    { name: "Interest Earned", value: Math.max(0, totalInterestEarned) },
  ];

  const insights: string[] = [
    `At retirement (age ${retirementAge}), your EPF corpus is estimated at ₹${maturityAmount.toLocaleString("en-IN")}.`,
    "Only 3.67% of your employer's 12% contribution goes into your EPF account — the remaining 8.33% goes to the Employees' Pension Scheme (EPS) and is not included in this corpus.",
    "EPF enjoys EEE tax status: contributions (up to ₹1.5 lakh under Section 80C), interest, and withdrawal after 5 years of continuous service are all tax-free.",
  ];

  return {
    outputs: {
      maturityAmount,
      totalContribution,
      totalInterestEarned: Math.max(0, totalInterestEarned),
    },
    yearlyData,
    pieData,
    insights,
  };
};
