import type { CalculatorConfig } from "../../types/calculator";
import { FORMULA_TEXT } from "../formulaText";

/**
 * These configs mirror exactly what will live in MongoDB (Calculator collection)
 * once you run the seed script. They're kept here as local fallbacks so the
 * frontend works standalone during development, before the backend/DB is connected.
 * Once connected, CalculatorPage fetches the live version from /api/calculators/:slug
 * and these are only used if that request fails.
 */
export const sipConfig: CalculatorConfig = {
  slug: "sip-calculator",
  name: "SIP Calculator",
  shortDescription:
    "Calculate the future value of your monthly SIP investments with the power of compounding.",
  longDescription:
    "A Systematic Investment Plan (SIP) lets you invest a fixed amount in mutual funds every month. This calculator shows how your monthly investment can grow over time based on an assumed annual rate of return, using the standard SIP future value formula used by Indian mutual fund houses.",
  formulaKey: "sip",
  inputs: [
    {
      key: "monthlyInvestment",
      label: "Monthly Investment",
      type: "currency",
      defaultValue: 10000,
      min: 500,
      max: 1000000,
      step: 500,
      unit: "₹",
    },
    {
      key: "annualReturnRate",
      label: "Expected Annual Return",
      type: "percent",
      defaultValue: 12,
      min: 1,
      max: 30,
      step: 0.5,
      unit: "%",
      helpText: "Equity mutual funds in India have historically returned 10-14% annually over the long term.",
    },
    {
      key: "investmentPeriodYears",
      label: "Investment Period",
      type: "years",
      defaultValue: 10,
      min: 1,
      max: 40,
      step: 1,
      unit: "yrs",
    },
  ],
  outputs: [
    { key: "totalInvestedAmount", label: "Total Invested", unit: "₹" },
    { key: "estimatedReturns", label: "Estimated Returns", unit: "₹" },
    { key: "maturityAmount", label: "Maturity Amount", unit: "₹", highlight: true },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "trending-up",
  faqs: [
    {
      question: "What is a SIP?",
      answer:
        "A Systematic Investment Plan (SIP) is a method of investing a fixed amount in a mutual fund scheme at regular intervals, typically monthly, rather than investing a lump sum at once.",
    },
    {
      question: "Is the SIP calculator result guaranteed?",
      answer:
        "No. The calculator shows an estimate based on the annual return rate you enter. Actual mutual fund returns are market-linked and not guaranteed.",
    },
    {
      question: "Does this calculator account for SIP step-up?",
      answer:
        "No, this calculator assumes a constant monthly investment. Use the Step-Up SIP Calculator if you plan to increase your SIP amount each year.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};

export const emiConfig: CalculatorConfig = {
  slug: "emi-calculator",
  name: "EMI Calculator",
  shortDescription:
    "Calculate your loan EMI, total interest payable, and view the full amortization schedule.",
  longDescription:
    "An EMI (Equated Monthly Installment) is the fixed payment amount made by a borrower to a lender each month. This calculator works for home loans, personal loans, car loans, and any other amortizing loan, using the standard EMI formula.",
  formulaKey: "emi",
  inputs: [
    {
      key: "loanAmount",
      label: "Loan Amount",
      type: "currency",
      defaultValue: 1000000,
      min: 10000,
      max: 100000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "annualInterestRate",
      label: "Interest Rate (Annual)",
      type: "percent",
      defaultValue: 8.5,
      min: 1,
      max: 25,
      step: 0.05,
      unit: "%",
    },
    {
      key: "loanTenureYears",
      label: "Loan Tenure",
      type: "years",
      defaultValue: 20,
      min: 1,
      max: 30,
      step: 1,
      unit: "yrs",
    },
  ],
  outputs: [
    { key: "emi", label: "Monthly EMI", unit: "₹", highlight: true },
    { key: "totalInterest", label: "Total Interest", unit: "₹" },
    { key: "totalPayment", label: "Total Payment", unit: "₹" },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "home",
  faqs: [
    {
      question: "How is EMI calculated?",
      answer:
        "EMI is calculated using the formula EMI = P × r × (1+r)^n / [(1+r)^n − 1], where P is the loan amount, r is the monthly interest rate, and n is the number of monthly installments.",
    },
    {
      question: "Does EMI stay the same throughout the loan tenure?",
      answer:
        "For fixed-rate loans, yes — the EMI amount remains constant, though the split between principal and interest changes each month. For floating-rate loans, EMI can change if the interest rate changes.",
    },
  ],
  category: { name: "Loans", slug: "loans" },
};

export const fdConfig: CalculatorConfig = {
  slug: "fd-calculator",
  name: "FD Calculator",
  shortDescription:
    "Calculate the maturity value of your Fixed Deposit with quarterly compounding.",
  longDescription:
    "A Fixed Deposit (FD) is a financial instrument offered by banks where you deposit a lump sum for a fixed tenure at a fixed interest rate. This calculator uses quarterly compounding, the convention most Indian banks follow.",
  formulaKey: "fd",
  inputs: [
    {
      key: "principal",
      label: "Deposit Amount",
      type: "currency",
      defaultValue: 100000,
      min: 1000,
      max: 10000000,
      step: 1000,
      unit: "₹",
    },
    {
      key: "annualInterestRate",
      label: "Interest Rate (Annual)",
      type: "percent",
      defaultValue: 7,
      min: 1,
      max: 15,
      step: 0.1,
      unit: "%",
    },
    {
      key: "tenureYears",
      label: "Tenure",
      type: "years",
      defaultValue: 5,
      min: 1,
      max: 10,
      step: 1,
      unit: "yrs",
    },
  ],
  outputs: [
    { key: "principalAmount", label: "Principal Amount", unit: "₹" },
    { key: "totalInterest", label: "Interest Earned", unit: "₹" },
    { key: "maturityAmount", label: "Maturity Amount", unit: "₹", highlight: true },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "landmark",
  faqs: [
    {
      question: "Is FD interest taxable?",
      answer:
        "Yes, interest earned on FDs is fully taxable as per your income tax slab. Banks deduct TDS if interest exceeds the threshold specified by the Income Tax Department.",
    },
    {
      question: "What compounding frequency does this calculator use?",
      answer:
        "This calculator uses quarterly compounding by default, which is the standard convention used by most Indian banks for fixed deposits.",
    },
  ],
  category: { name: "Banking", slug: "banking" },
};

export const incomeTaxNewConfig: CalculatorConfig = {
  slug: "income-tax-calculator-new-regime",
  name: "Income Tax Calculator (New Regime)",
  shortDescription:
    "Calculate your income tax liability under the New Tax Regime for FY 2025-26 (AY 2026-27).",
  longDescription:
    "This calculator computes your income tax under the New Tax Regime (Section 115BAC) using the slabs applicable for FY 2025-26, including the standard deduction, Section 87A rebate, and 4% health & education cess.",
  formulaKey: "incomeTaxNew",
  inputs: [
    {
      key: "grossAnnualIncome",
      label: "Gross Annual Income",
      type: "currency",
      defaultValue: 1200000,
      min: 0,
      max: 100000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "employerNpsContribution",
      label: "Employer NPS Contribution (80CCD(2))",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 1000000,
      step: 1000,
      unit: "₹",
      helpText: "This is the only major deduction allowed under the new regime besides the standard deduction.",
    },
  ],
  outputs: [
    { key: "taxableIncome", label: "Taxable Income", unit: "₹" },
    { key: "totalTaxPayable", label: "Total Tax Payable", unit: "₹", highlight: true },
    { key: "inHandIncome", label: "In-Hand Income", unit: "₹" },
  ],
  chartTypes: ["pie", "bar"],
  generatesYearlyTable: true,
  icon: "receipt",
  faqs: [
    {
      question: "What is the tax-free income limit under the new regime for FY 2025-26?",
      answer:
        "Income up to ₹12,00,000 (taxable, after standard deduction) is effectively tax-free due to the Section 87A rebate, which covers tax liability up to ₹60,000. For salaried individuals, this means gross salary up to ₹12,75,000 can be tax-free after the ₹75,000 standard deduction.",
    },
    {
      question: "Does this calculator include surcharge?",
      answer:
        "No. Surcharge only applies to incomes above ₹50 lakh and is not modeled in this calculator, which is designed for typical salaried income ranges. Consult a tax professional for high-income surcharge and marginal relief calculations.",
    },
  ],
  category: { name: "Tax", slug: "tax" },
};

export const ppfConfig: CalculatorConfig = {
  slug: "ppf-calculator",
  name: "PPF Calculator",
  shortDescription:
    "Estimate the maturity value of your Public Provident Fund (PPF) account with tax-free compounding.",
  longDescription:
    "The Public Provident Fund (PPF) is a government-backed, long-term savings scheme offering tax-free interest under Section 10 and tax deduction under Section 80C. This calculator estimates your maturity value based on a fixed annual contribution. Note: this is an approximation — real PPF interest is calculated monthly on your lowest balance between the 5th and last day of each month, so your actual maturity value depends on exact deposit dates.",
  formulaKey: "ppf",
  inputs: [
    {
      key: "annualContribution",
      label: "Annual Contribution",
      type: "currency",
      defaultValue: 150000,
      min: 500,
      max: 150000,
      step: 500,
      unit: "₹",
      helpText: "Maximum ₹1,50,000 per financial year as per PPF rules.",
    },
    {
      key: "interestRate",
      label: "Interest Rate (Annual)",
      type: "percent",
      defaultValue: 7.1,
      min: 5,
      max: 10,
      step: 0.1,
      unit: "%",
      helpText: "Current PPF rate is 7.1% p.a. (Q1 FY 2026-27). Rates are revised quarterly by the government.",
    },
    {
      key: "tenureYears",
      label: "Tenure",
      type: "years",
      defaultValue: 15,
      min: 15,
      max: 50,
      step: 5,
      unit: "yrs",
      helpText: "PPF has a mandatory 15-year lock-in, extendable in blocks of 5 years.",
    },
  ],
  outputs: [
    { key: "totalInvestedAmount", label: "Total Invested", unit: "₹" },
    { key: "totalInterestEarned", label: "Interest Earned", unit: "₹" },
    { key: "maturityAmount", label: "Maturity Amount", unit: "₹", highlight: true },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "shield-check",
  faqs: [
    {
      question: "What is the current PPF interest rate?",
      answer:
        "The PPF interest rate is 7.1% per annum as of Q1 FY 2026-27. The government reviews and announces the rate every quarter, so it can change.",
    },
    {
      question: "Is PPF interest taxable?",
      answer:
        "No. PPF enjoys EEE (Exempt-Exempt-Exempt) tax status — your contribution (up to ₹1.5 lakh under Section 80C), the interest earned, and the maturity amount are all completely tax-free.",
    },
    {
      question: "Can I withdraw from PPF before 15 years?",
      answer:
        "Partial withdrawals are allowed from the 7th financial year onwards, subject to limits. The account can also be extended in blocks of 5 years after the initial 15-year lock-in.",
    },
  ],
  category: { name: "Banking", slug: "banking" },
};

export const rdConfig: CalculatorConfig = {
  slug: "rd-calculator",
  name: "RD Calculator",
  shortDescription:
    "Calculate the maturity amount of your Recurring Deposit with monthly installments and quarterly compounding.",
  longDescription:
    "A Recurring Deposit (RD) lets you build savings through fixed monthly deposits, compounded quarterly like a Fixed Deposit. This calculator computes the exact maturity value by tracking each monthly installment's individual growth period.",
  formulaKey: "rd",
  inputs: [
    {
      key: "monthlyInstallment",
      label: "Monthly Deposit",
      type: "currency",
      defaultValue: 5000,
      min: 100,
      max: 500000,
      step: 100,
      unit: "₹",
    },
    {
      key: "annualInterestRate",
      label: "Interest Rate (Annual)",
      type: "percent",
      defaultValue: 6.5,
      min: 1,
      max: 12,
      step: 0.1,
      unit: "%",
    },
    {
      key: "tenureMonths",
      label: "Tenure",
      type: "number",
      defaultValue: 36,
      min: 6,
      max: 120,
      step: 3,
      unit: "months",
      helpText: "RD tenure typically ranges from 6 months to 10 years, in multiples of 3 months.",
    },
  ],
  outputs: [
    { key: "totalDeposited", label: "Total Deposited", unit: "₹" },
    { key: "interestEarned", label: "Interest Earned", unit: "₹" },
    { key: "maturityAmount", label: "Maturity Amount", unit: "₹", highlight: true },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "piggy-bank",
  faqs: [
    {
      question: "How is RD interest different from FD interest?",
      answer:
        "In an FD, the full principal earns interest for the entire tenure. In an RD, each monthly installment earns interest only from the date it's deposited, so the first installment earns the most interest and the last installment earns the least.",
    },
    {
      question: "Is RD interest taxable?",
      answer:
        "Yes, RD interest is fully taxable as 'income from other sources'. Banks deduct 10% TDS if your total RD interest exceeds ₹50,000 in a financial year (₹1,00,000 for senior citizens), unless you submit Form 15G/15H.",
    },
  ],
  category: { name: "Banking", slug: "banking" },
};

export const hraConfig: CalculatorConfig = {
  slug: "hra-exemption-calculator",
  name: "HRA Exemption Calculator",
  shortDescription:
    "Calculate your House Rent Allowance (HRA) tax exemption under Section 10(13A) — Old Tax Regime only.",
  longDescription:
    "HRA exemption under Section 10(13A) is available only to salaried employees under the Old Tax Regime who live in rented accommodation. The exempt amount is the lowest of three conditions: actual HRA received, 50%/40% of salary for metro/non-metro cities, and rent paid minus 10% of salary.",
  formulaKey: "hra",
  inputs: [
    {
      key: "basicSalaryAnnual",
      label: "Basic Salary (Annual)",
      type: "currency",
      defaultValue: 600000,
      min: 0,
      max: 50000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "dearnessAllowanceAnnual",
      label: "Dearness Allowance (Annual)",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 10000000,
      step: 5000,
      unit: "₹",
      helpText: "Leave as 0 if you don't receive DA — most private-sector salaries don't include it.",
    },
    {
      key: "hraReceivedAnnual",
      label: "HRA Received (Annual)",
      type: "currency",
      defaultValue: 240000,
      min: 0,
      max: 10000000,
      step: 5000,
      unit: "₹",
    },
    {
      key: "rentPaidAnnual",
      label: "Rent Paid (Annual)",
      type: "currency",
      defaultValue: 216000,
      min: 0,
      max: 10000000,
      step: 5000,
      unit: "₹",
    },
    {
      key: "isMetroCity",
      label: "City Type",
      type: "select",
      defaultValue: 1,
      options: [
        { label: "Metro (Delhi, Mumbai, Kolkata, Chennai)", value: 1 },
        { label: "Non-Metro (all other cities)", value: 0 },
      ],
      helpText: "For FY 2025-26: only these 4 cities qualify for the 50% metro rate. The 8-city expansion applies from FY 2026-27.",
    },
  ],
  outputs: [
    { key: "exemptHra", label: "Exempt HRA", unit: "₹", highlight: true },
    { key: "taxableHra", label: "Taxable HRA", unit: "₹" },
    { key: "actualHraReceived", label: "Actual HRA Received", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "home",
  faqs: [
    {
      question: "Can I claim HRA exemption under the New Tax Regime?",
      answer:
        "No. HRA exemption under Section 10(13A) is available only under the Old Tax Regime. If you opt for the New Tax Regime, your entire HRA is taxable.",
    },
    {
      question: "Which cities count as metro cities for HRA?",
      answer:
        "For FY 2025-26, only Delhi, Mumbai, Kolkata, and Chennai qualify for the 50% metro rate. Bengaluru, Hyderabad, Pune, and Ahmedabad are classified as non-metro (40%) for FY 2025-26, though this changes from FY 2026-27 onward.",
    },
    {
      question: "What if I pay rent to my parents?",
      answer:
        "You can claim HRA exemption on rent paid to parents, provided the property is owned by them (not jointly with you) and you have a valid rent agreement and payment trail. The landlord's PAN is required if annual rent exceeds ₹1 lakh.",
    },
  ],
  category: { name: "Tax", slug: "tax" },
};

export const lumpsumConfig: CalculatorConfig = {
  slug: "lumpsum-calculator",
  name: "Lumpsum Calculator",
  shortDescription:
    "Calculate the future value of a one-time mutual fund investment with compound growth.",
  longDescription:
    "A lumpsum investment is a single, one-time investment rather than regular monthly contributions. This calculator shows how your one-time investment grows over time based on an assumed annual rate of return, using standard compound interest.",
  formulaKey: "lumpsum",
  inputs: [
    {
      key: "investmentAmount",
      label: "Investment Amount",
      type: "currency",
      defaultValue: 100000,
      min: 1000,
      max: 100000000,
      step: 1000,
      unit: "₹",
    },
    {
      key: "annualReturnRate",
      label: "Expected Annual Return",
      type: "percent",
      defaultValue: 12,
      min: 1,
      max: 30,
      step: 0.5,
      unit: "%",
    },
    {
      key: "investmentPeriodYears",
      label: "Investment Period",
      type: "years",
      defaultValue: 10,
      min: 1,
      max: 40,
      step: 1,
      unit: "yrs",
    },
  ],
  outputs: [
    { key: "investmentAmount", label: "Investment Amount", unit: "₹" },
    { key: "estimatedReturns", label: "Estimated Returns", unit: "₹" },
    { key: "maturityAmount", label: "Maturity Amount", unit: "₹", highlight: true },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "trending-up",
  faqs: [
    {
      question: "What's the difference between Lumpsum and SIP investing?",
      answer:
        "A lumpsum investment puts all your money in at once, so it has the longest possible time to compound. SIP spreads your investment over time, which reduces the impact of market timing through rupee-cost averaging but means later installments have less time to grow.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};

export const cagrConfig: CalculatorConfig = {
  slug: "cagr-calculator",
  name: "CAGR Calculator",
  shortDescription:
    "Calculate the Compound Annual Growth Rate of any investment given its starting and ending value.",
  longDescription:
    "CAGR (Compound Annual Growth Rate) tells you the smoothed annual rate at which an investment grew, even if its actual year-to-year returns were volatile. It's the standard way to compare investments held over different time periods.",
  formulaKey: "cagr",
  inputs: [
    {
      key: "initialValue",
      label: "Initial Value",
      type: "currency",
      defaultValue: 100000,
      min: 1,
      max: 100000000,
      step: 1000,
      unit: "₹",
    },
    {
      key: "finalValue",
      label: "Final Value",
      type: "currency",
      defaultValue: 150000,
      min: 1,
      max: 100000000,
      step: 1000,
      unit: "₹",
    },
    {
      key: "years",
      label: "Number of Years",
      type: "years",
      defaultValue: 3,
      min: 1,
      max: 40,
      step: 1,
      unit: "yrs",
    },
  ],
  outputs: [
    { key: "cagrPercent", label: "CAGR", unit: "%", highlight: true },
    { key: "absoluteReturnPercent", label: "Absolute Return", unit: "%" },
    { key: "totalGrowth", label: "Total Growth", unit: "₹" },
  ],
  chartTypes: ["line", "pie"],
  generatesYearlyTable: true,
  icon: "bar-chart-2",
  faqs: [
    {
      question: "What's the difference between CAGR and absolute return?",
      answer:
        "Absolute return is simply the total percentage gain over the entire period, with no regard for time. CAGR annualizes that growth, making it possible to fairly compare investments held for different lengths of time.",
    },
    {
      question: "Can I use CAGR for SIP investments?",
      answer:
        "No. CAGR only works for a single lumpsum investment with one start and one end value. For SIPs or any investment with multiple installments, use the XIRR Calculator instead.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};

export const stepUpSipConfig: CalculatorConfig = {
  slug: "step-up-sip-calculator",
  name: "Step-Up SIP Calculator",
  shortDescription:
    "Calculate SIP returns when you increase your monthly investment every year — by a fixed percentage or a fixed rupee amount.",
  longDescription:
    "A Step-Up (or Top-Up) SIP lets you increase your monthly investment amount automatically each year — typically in line with salary increments — rather than keeping it fixed for the entire tenure. Choose whether your SIP steps up by a percentage (e.g. 10% more each year) or a fixed rupee amount (e.g. ₹1,000 more each year). This calculator simulates month-by-month growth to show the exact maturity value.",
  formulaKey: "stepUpSip",
  inputs: [
    {
      key: "initialMonthlyInvestment",
      label: "Initial Monthly Investment",
      type: "currency",
      defaultValue: 10000,
      min: 500,
      max: 1000000,
      step: 500,
      unit: "₹",
    },
    {
      key: "stepUpMode",
      label: "Step-Up Type",
      type: "select",
      defaultValue: 0,
      options: [
        { label: "Percentage (%)", value: 0 },
        { label: "Fixed Amount (₹)", value: 1 },
      ],
      helpText: "Choose whether your SIP increases by a percentage or a fixed rupee amount each year.",
    },
    {
      key: "stepUpPercent",
      label: "Annual Step-Up",
      type: "percent",
      defaultValue: 10,
      min: 1,
      max: 50,
      step: 1,
      unit: "%",
      helpText: "Your monthly investment increases by this percentage every 12 months.",
      showIf: { key: "stepUpMode", equals: [0] },
    },
    {
      key: "stepUpAmount",
      label: "Annual Step-Up",
      type: "currency",
      defaultValue: 1000,
      min: 100,
      max: 100000,
      step: 100,
      unit: "₹",
      helpText: "Your monthly investment increases by this fixed amount every 12 months.",
      showIf: { key: "stepUpMode", equals: [1] },
    },
    {
      key: "annualReturnRate",
      label: "Expected Annual Return",
      type: "percent",
      defaultValue: 12,
      min: 1,
      max: 30,
      step: 0.5,
      unit: "%",
    },
    {
      key: "investmentPeriodYears",
      label: "Investment Period",
      type: "years",
      defaultValue: 15,
      min: 1,
      max: 40,
      step: 1,
      unit: "yrs",
    },
  ],
  outputs: [
    { key: "totalInvestedAmount", label: "Total Invested", unit: "₹" },
    { key: "estimatedReturns", label: "Estimated Returns", unit: "₹" },
    { key: "maturityAmount", label: "Maturity Amount", unit: "₹", highlight: true },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "trending-up",
  faqs: [
    {
      question: "Should I step up by a percentage or a fixed rupee amount?",
      answer:
        "Percentage step-up keeps pace proportionally with typical salary increments (e.g. a 10% annual raise matching a 10% SIP step-up) and is the more common choice. A fixed rupee step-up is simpler to plan around and works well if you expect a consistent rupee increase in disposable income each year rather than a percentage-based raise.",
    },
    {
      question: "Why use a Step-Up SIP instead of a regular SIP?",
      answer:
        "As your income grows, a fixed SIP amount represents a shrinking share of your earnings. Stepping up your SIP in line with salary increments lets you invest more without feeling the pinch, and can significantly increase your final corpus compared to a flat SIP of the same starting amount.",
    },
    {
      question: "Can I reduce my Step-Up SIP later if needed?",
      answer:
        "Yes — Step-Up SIPs are typically set up with your fund house or platform and can usually be modified, paused, or reverted to a fixed amount, subject to your specific platform's terms.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};

export const xirrConfig: CalculatorConfig = {
  slug: "xirr-calculator",
  name: "XIRR Calculator",
  shortDescription:
    "Calculate the true annualized return on investments with irregular cash flows — deposits, withdrawals, and redemptions at different dates.",
  longDescription:
    "XIRR (Extended Internal Rate of Return) is the industry-standard way mutual fund houses report SIP and irregular investment returns. Unlike CAGR, which only handles a single start and end value, XIRR accounts for the exact amount and timing of every cash flow. This calculator supports up to 4 transactions — enter negative amounts for money invested and positive amounts for money received (redemptions or current value), along with the number of days from your first transaction.",
  formulaKey: "xirr",
  inputs: [
    { key: "cf1Amount", label: "Cash Flow 1 (Amount)", type: "number", defaultValue: -100000, min: -10000000, max: 10000000, step: 1000, unit: "₹", helpText: "Negative = money invested, positive = money received." },
    { key: "cf1DaysFromStart", label: "Cash Flow 1 (Days from start)", type: "number", defaultValue: 0, min: 0, max: 10000, step: 1, unit: "days" },
    { key: "cf2Amount", label: "Cash Flow 2 (Amount)", type: "number", defaultValue: -50000, min: -10000000, max: 10000000, step: 1000, unit: "₹" },
    { key: "cf2DaysFromStart", label: "Cash Flow 2 (Days from start)", type: "number", defaultValue: 180, min: 0, max: 10000, step: 1, unit: "days" },
    { key: "cf3Amount", label: "Cash Flow 3 (Amount, optional)", type: "number", defaultValue: 0, min: -10000000, max: 10000000, step: 1000, unit: "₹" },
    { key: "cf3DaysFromStart", label: "Cash Flow 3 (Days from start)", type: "number", defaultValue: 0, min: 0, max: 10000, step: 1, unit: "days" },
    { key: "cf4Amount", label: "Final Cash Flow (Current Value)", type: "number", defaultValue: 180000, min: -10000000, max: 10000000, step: 1000, unit: "₹", helpText: "Enter your current investment value as a positive amount." },
    { key: "cf4DaysFromStart", label: "Final Cash Flow (Days from start)", type: "number", defaultValue: 365, min: 0, max: 10000, step: 1, unit: "days" },
  ],
  outputs: [
    { key: "xirrPercent", label: "XIRR", unit: "%", highlight: true },
    { key: "totalInvested", label: "Total Invested", unit: "₹" },
    { key: "totalReturned", label: "Total Returned", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "percent",
  faqs: [
    {
      question: "Why does this calculator ask for 'days from start' instead of dates?",
      answer:
        "This simplified version uses day-offsets from your first transaction rather than a full date picker, to keep the MVP build straightforward. A future update will add a proper transaction list with real date pickers and unlimited entries.",
    },
    {
      question: "Why is XIRR better than CAGR for SIP returns?",
      answer:
        "CAGR only works for a single lump-sum investment with one start and end point. XIRR accounts for the exact timing and amount of every individual SIP installment, withdrawal, and redemption — which is how mutual fund houses actually calculate and report your returns.",
    },
    {
      question: "What if the calculator shows no result?",
      answer:
        "XIRR requires at least one negative (investment) and one positive (return) cash flow to solve. If your entries are all the same sign, or too irregular, the calculation cannot converge.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};


export const homeLoanConfig: CalculatorConfig = {
  slug: "home-loan-calculator",
  name: "Home Loan EMI Calculator",
  shortDescription:
    "Calculate your home loan EMI, total interest, and view the full amortization schedule.",
  longDescription:
    "Home loan interest rates in India currently start around 7.1-9% p.a. depending on your credit score and lender, with tenures up to 30 years. This calculator uses the standard EMI formula to show your monthly payment and how it splits between principal and interest over time.",
  formulaKey: "emi",
  inputs: [
    {
      key: "loanAmount",
      label: "Home Loan Amount",
      type: "currency",
      defaultValue: 5000000,
      min: 100000,
      max: 200000000,
      step: 50000,
      unit: "₹",
    },
    {
      key: "annualInterestRate",
      label: "Interest Rate (Annual)",
      type: "percent",
      defaultValue: 8.5,
      min: 6,
      max: 15,
      step: 0.05,
      unit: "%",
      helpText: "Home loan rates in India currently range from about 7.1% to 9% depending on your credit profile.",
    },
    {
      key: "loanTenureYears",
      label: "Loan Tenure",
      type: "years",
      defaultValue: 20,
      min: 5,
      max: 30,
      step: 1,
      unit: "yrs",
    },
  ],
  outputs: [
    { key: "emi", label: "Monthly EMI", unit: "₹", highlight: true },
    { key: "totalInterest", label: "Total Interest", unit: "₹" },
    { key: "totalPayment", label: "Total Payment", unit: "₹" },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "home",
  faqs: [
    {
      question: "Can I claim tax benefits on my home loan?",
      answer:
        "Under the Old Tax Regime, you can claim up to ₹2 lakh per year on home loan interest (Section 24b) and up to ₹1.5 lakh on principal repayment (Section 80C). These benefits are not available under the New Tax Regime.",
    },
    {
      question: "What's the maximum Loan-to-Value (LTV) ratio for home loans?",
      answer:
        "RBI norms allow up to 90% LTV for loans up to ₹30 lakh, up to 80% for loans between ₹30-75 lakh, and up to 75% for loans above ₹75 lakh — meaning you'll need a larger down payment for bigger loans.",
    },
  ],
  category: { name: "Loans", slug: "loans" },
};

export const carLoanConfig: CalculatorConfig = {
  slug: "car-loan-calculator",
  name: "Car Loan EMI Calculator",
  shortDescription:
    "Calculate your car loan EMI and total interest for new or used vehicle financing.",
  longDescription:
    "Car loan interest rates in India typically range from about 7.4% to 10% for new cars, with tenures up to 7-8 years. Some lenders finance up to 100% of the on-road price.",
  formulaKey: "emi",
  inputs: [
    {
      key: "loanAmount",
      label: "Car Loan Amount",
      type: "currency",
      defaultValue: 700000,
      min: 50000,
      max: 10000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "annualInterestRate",
      label: "Interest Rate (Annual)",
      type: "percent",
      defaultValue: 9,
      min: 6,
      max: 16,
      step: 0.05,
      unit: "%",
      helpText: "New car loan rates currently start around 7.4%; used car loans are typically higher.",
    },
    {
      key: "loanTenureYears",
      label: "Loan Tenure",
      type: "years",
      defaultValue: 5,
      min: 1,
      max: 8,
      step: 1,
      unit: "yrs",
    },
  ],
  outputs: [
    { key: "emi", label: "Monthly EMI", unit: "₹", highlight: true },
    { key: "totalInterest", label: "Total Interest", unit: "₹" },
    { key: "totalPayment", label: "Total Payment", unit: "₹" },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "car",
  faqs: [
    {
      question: "Do used car loans have different terms?",
      answer:
        "Yes — used car loans typically have shorter maximum tenures (often 5 years), lower loan-to-value ratios (80-85% of the car's value vs up to 100% for new cars), and somewhat higher interest rates than new car loans.",
    },
    {
      question: "Does a higher down payment reduce my interest rate?",
      answer:
        "A larger down payment lowers your loan-to-value ratio, which reduces the lender's risk and can help you qualify for a better rate, in addition to reducing your total interest paid.",
    },
  ],
  category: { name: "Loans", slug: "loans" },
};

export const personalLoanConfig: CalculatorConfig = {
  slug: "personal-loan-calculator",
  name: "Personal Loan EMI Calculator",
  shortDescription:
    "Calculate your personal loan EMI and total interest for unsecured personal financing.",
  longDescription:
    "Personal loans are unsecured (no collateral required), so they typically carry higher interest rates than home or car loans — generally starting around 9-11% and going up depending on your credit profile, with tenures usually capped at 5 years.",
  formulaKey: "emi",
  inputs: [
    {
      key: "loanAmount",
      label: "Personal Loan Amount",
      type: "currency",
      defaultValue: 300000,
      min: 10000,
      max: 5000000,
      step: 5000,
      unit: "₹",
    },
    {
      key: "annualInterestRate",
      label: "Interest Rate (Annual)",
      type: "percent",
      defaultValue: 12,
      min: 8,
      max: 28,
      step: 0.1,
      unit: "%",
      helpText: "Personal loan rates in India typically start around 8.75-11% for well-qualified borrowers and can go much higher for others.",
    },
    {
      key: "loanTenureYears",
      label: "Loan Tenure",
      type: "years",
      defaultValue: 3,
      min: 1,
      max: 5,
      step: 1,
      unit: "yrs",
    },
  ],
  outputs: [
    { key: "emi", label: "Monthly EMI", unit: "₹", highlight: true },
    { key: "totalInterest", label: "Total Interest", unit: "₹" },
    { key: "totalPayment", label: "Total Payment", unit: "₹" },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "wallet",
  faqs: [
    {
      question: "Why are personal loan interest rates higher than home loans?",
      answer:
        "Personal loans are unsecured — there's no asset (like a house or car) for the lender to claim if you default, so lenders charge a higher rate to compensate for that added risk.",
    },
    {
      question: "Are there any tax benefits on personal loans?",
      answer:
        "Generally no, unless the loan is used for specific purposes like home renovation or business, in which case some interest may be deductible. Personal loans used for personal expenses (weddings, travel, etc.) don't qualify for tax deductions.",
    },
  ],
  category: { name: "Loans", slug: "loans" },
};

export const educationLoanConfig: CalculatorConfig = {
  slug: "education-loan-calculator",
  name: "Education Loan EMI Calculator",
  shortDescription:
    "Calculate your education loan EMI for funding higher studies in India or abroad.",
  longDescription:
    "Education loans often come with a moratorium period (no EMI payments during the course plus a grace period after), though this calculator shows the standard EMI assuming repayment starts immediately — useful for comparing lenders before factoring in your specific moratorium terms.",
  formulaKey: "emi",
  inputs: [
    {
      key: "loanAmount",
      label: "Education Loan Amount",
      type: "currency",
      defaultValue: 1000000,
      min: 50000,
      max: 15000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "annualInterestRate",
      label: "Interest Rate (Annual)",
      type: "percent",
      defaultValue: 10.5,
      min: 7,
      max: 16,
      step: 0.1,
      unit: "%",
      helpText: "Education loan rates vary by lender and whether you're studying in India or abroad, typically 8-13%.",
    },
    {
      key: "loanTenureYears",
      label: "Repayment Tenure",
      type: "years",
      defaultValue: 10,
      min: 1,
      max: 15,
      step: 1,
      unit: "yrs",
      helpText: "Tenure typically starts after your course ends plus a moratorium/grace period.",
    },
  ],
  outputs: [
    { key: "emi", label: "Monthly EMI", unit: "₹", highlight: true },
    { key: "totalInterest", label: "Total Interest", unit: "₹" },
    { key: "totalPayment", label: "Total Payment", unit: "₹" },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "graduation-cap",
  faqs: [
    {
      question: "What is a moratorium period?",
      answer:
        "Most education loans don't require EMI payments while you're studying, plus an additional grace period (often 6-12 months) after course completion to find a job. Interest typically still accrues during this time, even though you're not making payments — this calculator doesn't model that separately.",
    },
    {
      question: "Are education loan interest payments tax deductible?",
      answer:
        "Yes, under Section 80E of the Income Tax Act, the entire interest paid on an education loan is deductible (no upper limit) for up to 8 years, available under both old and new tax regimes for individual borrowers, regardless of who studies.",
    },
  ],
  category: { name: "Loans", slug: "loans" },
};

export const loanEligibilityConfig: CalculatorConfig = {
  slug: "loan-eligibility-calculator",
  name: "Loan Eligibility Calculator",
  shortDescription:
    "Find out the maximum loan amount you're eligible for based on your income and existing EMIs.",
  longDescription:
    "Indian banks use the FOIR (Fixed Obligation to Income Ratio) method to determine how much loan you qualify for — typically allowing 40-60% of your net monthly income toward all EMI obligations combined. This calculator shows your maximum eligible EMI and corresponding loan amount.",
  formulaKey: "loanEligibility",
  inputs: [
    {
      key: "netMonthlyIncome",
      label: "Net Monthly Income",
      type: "currency",
      defaultValue: 75000,
      min: 10000,
      max: 10000000,
      step: 5000,
      unit: "₹",
      helpText: "Your take-home income after tax and deductions, not gross CTC.",
    },
    {
      key: "existingMonthlyEmi",
      label: "Existing Monthly EMIs",
      type: "currency",
      defaultValue: 10000,
      min: 0,
      max: 5000000,
      step: 1000,
      unit: "₹",
      helpText: "Total of all current loan EMIs and credit card minimum payments.",
    },
    {
      key: "foirPercent",
      label: "FOIR Limit",
      type: "select",
      defaultValue: 50,
      options: [
        { label: "40% (Conservative)", value: 40 },
        { label: "50% (Standard)", value: 50 },
        { label: "60% (Liberal, premium profiles)", value: 60 },
      ],
    },
    {
      key: "annualInterestRate",
      label: "Expected Interest Rate",
      type: "percent",
      defaultValue: 8.5,
      min: 6,
      max: 20,
      step: 0.1,
      unit: "%",
    },
    {
      key: "tenureYears",
      label: "Loan Tenure",
      type: "years",
      defaultValue: 20,
      min: 1,
      max: 30,
      step: 1,
      unit: "yrs",
    },
  ],
  outputs: [
    { key: "maxEligibleEmi", label: "Max Eligible EMI", unit: "₹" },
    { key: "maxLoanAmount", label: "Max Loan Amount", unit: "₹", highlight: true },
    { key: "totalInterestPayable", label: "Total Interest (at max loan)", unit: "₹" },
  ],
  chartTypes: ["pie", "bar"],
  generatesYearlyTable: false,
  icon: "calculator",
  faqs: [
    {
      question: "What is FOIR?",
      answer:
        "FOIR (Fixed Obligation to Income Ratio) is the percentage of your net monthly income that banks allow for all EMI obligations combined — old and new. Most lenders cap this at 40-60% depending on your income level and credit profile.",
    },
    {
      question: "How can I increase my loan eligibility?",
      answer:
        "Three main levers: pay off or reduce existing EMIs before applying, add a co-applicant with independent income (can increase eligibility by 40-70%), or choose a longer tenure (lowers the required EMI, though you'll pay more total interest).",
    },
    {
      question: "Does a good credit score affect FOIR?",
      answer:
        "Not directly, but some banks offer a higher FOIR limit (55-60%) to applicants with strong credit scores (750+), effectively increasing their eligible loan amount.",
    },
  ],
  category: { name: "Loans", slug: "loans" },
};

export const epfConfig: CalculatorConfig = {
  slug: "epf-calculator",
  name: "EPF Calculator",
  shortDescription:
    "Estimate your Employee Provident Fund retirement corpus from monthly employer and employee contributions.",
  longDescription:
    "EPF is a mandatory retirement savings scheme for salaried employees in India's organised sector. Both you and your employer contribute 12% of your basic salary plus DA each month, though only 3.67% of the employer's share goes to EPF (the rest funds the EPS pension scheme separately). The EPF interest rate for FY 2025-26 is 8.25% p.a.",
  formulaKey: "epf",
  inputs: [
    {
      key: "currentBasicSalaryMonthly",
      label: "Current Basic Salary + DA (Monthly)",
      type: "currency",
      defaultValue: 30000,
      min: 1000,
      max: 1000000,
      step: 1000,
      unit: "₹",
    },
    {
      key: "annualSalaryIncrementPercent",
      label: "Expected Annual Salary Increment",
      type: "percent",
      defaultValue: 5,
      min: 0,
      max: 25,
      step: 1,
      unit: "%",
    },
    {
      key: "currentAge",
      label: "Current Age",
      type: "number",
      defaultValue: 28,
      min: 18,
      max: 59,
      step: 1,
      unit: "yrs",
    },
    {
      key: "retirementAge",
      label: "Retirement Age",
      type: "number",
      defaultValue: 60,
      min: 50,
      max: 65,
      step: 1,
      unit: "yrs",
    },
    {
      key: "epfInterestRate",
      label: "EPF Interest Rate",
      type: "percent",
      defaultValue: 8.25,
      min: 6,
      max: 10,
      step: 0.05,
      unit: "%",
      helpText: "Current EPF rate for FY 2025-26 is 8.25%, declared annually by EPFO.",
    },
    {
      key: "existingEpfBalance",
      label: "Existing EPF Balance",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 50000000,
      step: 10000,
      unit: "₹",
    },
  ],
  outputs: [
    { key: "totalContribution", label: "Total Contribution", unit: "₹" },
    { key: "totalInterestEarned", label: "Interest Earned", unit: "₹" },
    { key: "maturityAmount", label: "Maturity Amount", unit: "₹", highlight: true },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "briefcase",
  faqs: [
    {
      question: "What's the difference between EPF and EPS?",
      answer:
        "Of your employer's 12% contribution, only 3.67% goes to your EPF account (which earns interest and is included in this calculator). The remaining 8.33% goes to the Employees' Pension Scheme (EPS), which provides a separate monthly pension after retirement but doesn't earn the EPF interest rate.",
    },
    {
      question: "Can I withdraw my EPF before retirement?",
      answer:
        "Yes, under specific conditions like unemployment for 2+ months, medical emergencies, home purchase, or marriage — subject to EPFO rules on the percentage and timing of withdrawal.",
    },
  ],
  category: { name: "Banking", slug: "banking" },
};

export const npsConfig: CalculatorConfig = {
  slug: "nps-calculator",
  name: "NPS Calculator",
  shortDescription:
    "Estimate your National Pension System retirement corpus, tax-free lump sum, and monthly pension.",
  longDescription:
    "NPS is a market-linked, government-regulated retirement scheme open to all Indian citizens, not just salaried employees. At retirement, up to 60% of your corpus can be withdrawn tax-free, while at least 40% must purchase an annuity for a monthly pension (which is taxable).",
  formulaKey: "nps",
  inputs: [
    {
      key: "monthlyContribution",
      label: "Monthly Contribution",
      type: "currency",
      defaultValue: 5000,
      min: 500,
      max: 500000,
      step: 500,
      unit: "₹",
    },
    {
      key: "currentAge",
      label: "Current Age",
      type: "number",
      defaultValue: 30,
      min: 18,
      max: 59,
      step: 1,
      unit: "yrs",
    },
    {
      key: "retirementAge",
      label: "Retirement Age",
      type: "number",
      defaultValue: 60,
      min: 60,
      max: 70,
      step: 1,
      unit: "yrs",
    },
    {
      key: "expectedAnnualReturn",
      label: "Expected Annual Return",
      type: "percent",
      defaultValue: 10,
      min: 5,
      max: 15,
      step: 0.5,
      unit: "%",
      helpText: "NPS returns are market-linked (equity + debt mix), not fixed. 9-12% is a common long-term planning assumption.",
    },
    {
      key: "annuityPercent",
      label: "Annuity Allocation",
      type: "select",
      defaultValue: 40,
      options: [
        { label: "40% (Minimum mandatory)", value: 40 },
        { label: "50%", value: 50 },
        { label: "60%", value: 60 },
        { label: "100% (Maximum pension)", value: 100 },
      ],
    },
    {
      key: "annuityRate",
      label: "Assumed Annuity Rate",
      type: "percent",
      defaultValue: 6,
      min: 4,
      max: 9,
      step: 0.5,
      unit: "%",
      helpText: "The rate insurance companies pay on the annuity portion — varies by provider and market conditions at retirement.",
    },
  ],
  outputs: [
    { key: "totalCorpus", label: "Total Corpus", unit: "₹", highlight: true },
    { key: "lumpSumWithdrawal", label: "Tax-Free Lump Sum", unit: "₹" },
    { key: "monthlyPension", label: "Estimated Monthly Pension", unit: "₹" },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "landmark",
  faqs: [
    {
      question: "Is the NPS lump sum withdrawal taxable?",
      answer:
        "No, the lump sum withdrawal (up to 60% of corpus) is completely tax-free. However, the monthly pension you receive from the annuity portion is taxable as per your income tax slab at that time.",
    },
    {
      question: "What tax benefits does NPS offer?",
      answer:
        "Under the Old Tax Regime: up to ₹1.5 lakh under Section 80C, plus an additional ₹50,000 under Section 80CCD(1B) — exclusively for NPS, over and above the 80C limit. Employer contributions under Section 80CCD(2) have no upper limit and are available under both tax regimes.",
    },
  ],
  category: { name: "Banking", slug: "banking" },
};

export const ssyConfig: CalculatorConfig = {
  slug: "sukanya-samriddhi-yojana-calculator",
  name: "Sukanya Samriddhi Yojana Calculator",
  shortDescription:
    "Calculate the maturity value of your Sukanya Samriddhi Yojana account for your daughter's future.",
  longDescription:
    "SSY is a government-backed savings scheme exclusively for a girl child under 10, offering 8.2% p.a. (Q1/Q2 FY 2026-27) — the highest rate among small savings schemes. Deposits are required only for the first 15 years, but the account matures after 21 years, with your balance continuing to earn interest in between.",
  formulaKey: "ssy",
  inputs: [
    {
      key: "annualDeposit",
      label: "Annual Deposit",
      type: "currency",
      defaultValue: 100000,
      min: 250,
      max: 150000,
      step: 5000,
      unit: "₹",
      helpText: "Minimum ₹250, maximum ₹1.5 lakh per financial year.",
    },
    {
      key: "interestRate",
      label: "Interest Rate (Annual)",
      type: "percent",
      defaultValue: 8.2,
      min: 6,
      max: 10,
      step: 0.1,
      unit: "%",
      helpText: "Current rate is 8.2% (Q1/Q2 FY 2026-27), reviewed quarterly by the government.",
    },
    {
      key: "girlChildCurrentAge",
      label: "Girl Child's Current Age",
      type: "number",
      defaultValue: 5,
      min: 0,
      max: 9,
      step: 1,
      unit: "yrs",
      helpText: "Account can only be opened before the girl child turns 10.",
    },
  ],
  outputs: [
    { key: "totalInvestedAmount", label: "Total Invested", unit: "₹" },
    { key: "totalInterestEarned", label: "Interest Earned", unit: "₹" },
    { key: "maturityAmount", label: "Maturity Amount", unit: "₹", highlight: true },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "shield-check",
  faqs: [
    {
      question: "Do I need to keep depositing for all 21 years?",
      answer:
        "No — deposits are required only for the first 15 years from account opening. After that, your existing balance continues to earn interest with no further deposits needed, until the account matures at 21 years.",
    },
    {
      question: "Can I withdraw money before maturity?",
      answer:
        "Partial withdrawal (up to 50% of the previous year's balance) is allowed once the girl turns 18, for higher education or marriage expenses, subject to documentation requirements.",
    },
  ],
  category: { name: "Banking", slug: "banking" },
};

export const savingsInterestConfig: CalculatorConfig = {
  slug: "savings-interest-calculator",
  name: "Savings Account Interest Calculator",
  shortDescription:
    "Estimate the interest you'll earn on your savings account balance and the tax-exempt portion under Section 80TTA/80TTB.",
  longDescription:
    "Savings account interest is calculated daily on your closing balance and credited quarterly. This calculator simplifies that to quarterly compounding on your average balance, and shows how much of your interest is tax-exempt under Section 80TTA (₹10,000 for regular taxpayers) or Section 80TTB (₹50,000 for senior citizens).",
  formulaKey: "savingsInterest",
  inputs: [
    {
      key: "averageBalance",
      label: "Average Account Balance",
      type: "currency",
      defaultValue: 100000,
      min: 1000,
      max: 50000000,
      step: 5000,
      unit: "₹",
    },
    {
      key: "annualInterestRate",
      label: "Interest Rate (Annual)",
      type: "percent",
      defaultValue: 3.5,
      min: 2.5,
      max: 8,
      step: 0.1,
      unit: "%",
      helpText: "Traditional banks typically offer 2.5-4%; small finance banks may offer 6-7%.",
    },
    {
      key: "tenureYears",
      label: "Time Period",
      type: "years",
      defaultValue: 1,
      min: 1,
      max: 10,
      step: 1,
      unit: "yrs",
    },
    {
      key: "isSeniorCitizen",
      label: "Senior Citizen?",
      type: "select",
      defaultValue: 0,
      options: [
        { label: "No (Section 80TTA: ₹10,000 exemption)", value: 0 },
        { label: "Yes (Section 80TTB: ₹50,000 exemption)", value: 1 },
      ],
    },
  ],
  outputs: [
    { key: "totalInterestEarned", label: "Total Interest Earned", unit: "₹", highlight: true },
    { key: "taxableInterest", label: "Taxable Interest", unit: "₹" },
    { key: "maturityAmount", label: "Final Balance", unit: "₹" },
  ],
  chartTypes: ["pie", "bar"],
  generatesYearlyTable: true,
  icon: "wallet",
  faqs: [
    {
      question: "How is savings account interest actually calculated?",
      answer:
        "Banks calculate interest daily based on your closing balance each day, then credit the accumulated interest to your account quarterly. This calculator simplifies that into quarterly compounding on a constant average balance — your real returns will differ slightly based on how your balance actually fluctuates day to day.",
    },
    {
      question: "What is Section 80TTA?",
      answer:
        "Section 80TTA allows individuals (non-senior citizens) to claim a deduction of up to ₹10,000 on interest earned from savings accounts. Senior citizens get a higher ₹50,000 exemption under Section 80TTB, which also covers FD and RD interest.",
    },
  ],
  category: { name: "Banking", slug: "banking" },
};

export const gratuityConfig: CalculatorConfig = {
  slug: "gratuity-calculator",
  name: "Gratuity Calculator",
  shortDescription:
    "Calculate your gratuity amount under the Payment of Gratuity Act, 1972, and its tax-exempt portion.",
  longDescription:
    "Gratuity is a statutory lump-sum benefit paid by employers for long service, generally after 5 years of continuous service. The amount and tax exemption depend on your last drawn salary, years of service, and whether your employer is covered under the Payment of Gratuity Act.",
  formulaKey: "gratuity",
  inputs: [
    {
      key: "lastDrawnSalary",
      label: "Last Drawn Basic Salary + DA (Monthly)",
      type: "currency",
      defaultValue: 50000,
      min: 1000,
      max: 5000000,
      step: 1000,
      unit: "₹",
    },
    {
      key: "yearsOfServiceRaw",
      label: "Completed Years of Service",
      type: "number",
      defaultValue: 10,
      min: 0,
      max: 45,
      step: 1,
      unit: "yrs",
    },
    {
      key: "monthsInExtraYear",
      label: "Additional Months (beyond completed years)",
      type: "number",
      defaultValue: 0,
      min: 0,
      max: 11,
      step: 1,
      unit: "months",
      helpText: "6 or more months rounds up to the next full year; less than 6 rounds down.",
    },
    {
      key: "isActCovered",
      label: "Employer Coverage",
      type: "select",
      defaultValue: 1,
      options: [
        { label: "Covered under Gratuity Act (10+ employees)", value: 1 },
        { label: "Not covered (fewer than 10 employees)", value: 0 },
      ],
    },
    {
      key: "isGovernmentEmployee",
      label: "Employee Type",
      type: "select",
      defaultValue: 0,
      options: [
        { label: "Private Sector", value: 0 },
        { label: "Government Employee", value: 1 },
      ],
    },
  ],
  outputs: [
    { key: "gratuityAmount", label: "Gratuity Amount", unit: "₹", highlight: true },
    { key: "exemptAmount", label: "Tax-Exempt Amount", unit: "₹" },
    { key: "taxableAmount", label: "Taxable Amount", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "award",
  faqs: [
    {
      question: "Am I eligible for gratuity if I resign before 5 years?",
      answer:
        "Generally no, unless your service ends due to death or disability, in which case the 5-year rule doesn't apply. Some courts have also recognized 4 years and 240+ days as meeting the requirement in specific cases. Under the new labour codes, fixed-term contract employees may qualify after just 1 year.",
    },
    {
      question: "What is the maximum tax-free gratuity?",
      answer:
        "₹20 lakh under Section 10(10)(ii), raised from ₹10 lakh in March 2018 and unrevised since. Government employees receive their entire gratuity tax-free regardless of amount.",
    },
  ],
  category: { name: "Tax", slug: "tax" },
};

export const tdsOnSalaryConfig: CalculatorConfig = {
  slug: "tds-calculator",
  name: "TDS on Salary Calculator",
  shortDescription:
    "Estimate the monthly TDS your employer deducts from your salary under Section 192.",
  longDescription:
    "TDS on salary isn't a separate tax — it's your estimated annual income tax (computed via slab rates) divided across the remaining months of the financial year and deducted monthly by your employer, as required under Section 192 of the Income Tax Act.",
  formulaKey: "tdsOnSalary",
  inputs: [
    {
      key: "annualGrossSalary",
      label: "Estimated Annual Gross Salary",
      type: "currency",
      defaultValue: 1200000,
      min: 0,
      max: 100000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "remainingMonthsInYear",
      label: "Remaining Months in Financial Year",
      type: "number",
      defaultValue: 12,
      min: 1,
      max: 12,
      step: 1,
      unit: "months",
      helpText: "If you joined mid-year, enter the number of months left in the financial year.",
    },
  ],
  outputs: [
    { key: "monthlyTds", label: "Monthly TDS", unit: "₹", highlight: true },
    { key: "totalAnnualTax", label: "Total Annual Tax", unit: "₹" },
    { key: "averageTdsRate", label: "Average TDS Rate", unit: "%" },
  ],
  chartTypes: ["pie", "bar"],
  generatesYearlyTable: true,
  icon: "receipt",
  faqs: [
    {
      question: "Why does my TDS change during the year?",
      answer:
        "TDS is based on your estimated ANNUAL income, recalculated whenever your salary changes, you receive a bonus, or you submit investment declarations. A bonus month often shows higher TDS because the employer recalculates the full year's tax and adjusts the remaining months.",
    },
    {
      question: "What if too much TDS was deducted?",
      answer:
        "If your total TDS deducted exceeds your actual tax liability for the year, you can claim a refund when filing your Income Tax Return (ITR).",
    },
  ],
  category: { name: "Tax", slug: "tax" },
};

export const gstConfig: CalculatorConfig = {
  slug: "gst-calculator",
  name: "GST Calculator",
  shortDescription:
    "Add or remove GST from an amount, with CGST/SGST breakdown, under the current post-reform rate structure.",
  longDescription:
    "GST in India was significantly restructured effective 22 September 2025 (GST 2.0), simplifying the old 5-slab system (0%, 5%, 12%, 18%, 28%) down to primarily 0%, 5%, and 18%, with a new 40% slab for luxury and sin goods. This calculator uses the current rate structure.",
  formulaKey: "gst",
  inputs: [
    {
      key: "amount",
      label: "Amount",
      type: "currency",
      defaultValue: 10000,
      min: 1,
      max: 100000000,
      step: 100,
      unit: "₹",
    },
    {
      key: "gstRate",
      label: "GST Rate",
      type: "select",
      defaultValue: 18,
      options: [
        { label: "0% (Exempt — essentials, education, healthcare)", value: 0 },
        { label: "5% (Merit rate — daily essentials)", value: 5 },
        { label: "18% (Standard rate — most goods & services)", value: 18 },
        { label: "40% (Luxury/sin goods)", value: 40 },
      ],
    },
    {
      key: "calculationMode",
      label: "Calculation Mode",
      type: "select",
      defaultValue: 0,
      options: [
        { label: "Add GST (amount is pre-tax)", value: 0 },
        { label: "Remove GST (amount is tax-inclusive)", value: 1 },
      ],
    },
  ],
  outputs: [
    { key: "taxableValue", label: "Taxable Value", unit: "₹" },
    { key: "gstAmount", label: "GST Amount", unit: "₹" },
    { key: "totalAmount", label: "Total Amount", unit: "₹", highlight: true },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "percent",
  faqs: [
    {
      question: "What changed in GST 2.0?",
      answer:
        "Effective 22 September 2025, the GST Council simplified the old 5-slab structure (0%, 5%, 12%, 18%, 28%) into primarily two slabs — 5% and 18% — with a new 40% rate for luxury and sin goods like tobacco, pan masala, and premium vehicles. The old 12% and 28% slabs no longer apply to most goods.",
    },
    {
      question: "What's the difference between CGST, SGST, and IGST?",
      answer:
        "For sales within the same state, GST splits equally into CGST (collected by the central government) and SGST (collected by the state government). For inter-state sales, the full amount is charged as IGST (Integrated GST), collected by the central government and apportioned to the destination state.",
    },
  ],
  category: { name: "Tax", slug: "tax" },
};

export const capitalGainsConfig: CalculatorConfig = {
  slug: "capital-gains-calculator",
  name: "Capital Gains Tax Calculator",
  shortDescription:
    "Calculate LTCG or STCG tax on listed equity shares and equity mutual funds.",
  longDescription:
    "For equity shares and equity-oriented mutual funds, gains from holdings over 12 months qualify as Long-Term Capital Gains (LTCG), taxed at 12.5% on amounts exceeding ₹1.25 lakh per financial year. Gains from holdings of 12 months or less are Short-Term Capital Gains (STCG), taxed at a flat 20% with no exemption.",
  formulaKey: "capitalGains",
  inputs: [
    {
      key: "purchasePrice",
      label: "Purchase Price (Total)",
      type: "currency",
      defaultValue: 100000,
      min: 0,
      max: 100000000,
      step: 1000,
      unit: "₹",
    },
    {
      key: "salePrice",
      label: "Sale Price (Total)",
      type: "currency",
      defaultValue: 200000,
      min: 0,
      max: 100000000,
      step: 1000,
      unit: "₹",
    },
    {
      key: "holdingPeriodMonths",
      label: "Holding Period",
      type: "number",
      defaultValue: 18,
      min: 1,
      max: 600,
      step: 1,
      unit: "months",
      helpText: "More than 12 months qualifies for LTCG treatment on equity.",
    },
    {
      key: "otherLtcgThisYear",
      label: "Other Equity LTCG Already Booked This FY",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 10000000,
      step: 5000,
      unit: "₹",
      helpText: "The ₹1.25 lakh LTCG exemption is shared across all your equity gains in a financial year, not per transaction.",
    },
  ],
  outputs: [
    { key: "totalGain", label: "Total Gain", unit: "₹" },
    { key: "taxAmount", label: "Tax Payable", unit: "₹", highlight: true },
    { key: "netProceedsAfterTax", label: "Net Proceeds After Tax", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "trending-up",
  faqs: [
    {
      question: "Does this calculator work for debt funds or real estate?",
      answer:
        "No — this calculator is specifically for listed equity shares and equity-oriented mutual funds. Debt funds, real estate, and gold have different capital gains rules (not just different rates), so they need separate calculation logic.",
    },
    {
      question: "Is the ₹1.25 lakh LTCG exemption per transaction or per year?",
      answer:
        "It's a single combined limit per financial year across ALL your equity LTCG — not per stock, fund, or transaction. If you've already booked ₹80,000 of LTCG elsewhere this year, only ₹45,000 of additional exemption remains.",
    },
  ],
  category: { name: "Tax", slug: "tax" },
};

export const fireConfig: CalculatorConfig = {
  slug: "fire-calculator",
  name: "FIRE Calculator",
  shortDescription:
    "Calculate your Financial Independence, Retire Early (FIRE) number and the monthly SIP needed to reach it.",
  longDescription:
    "FIRE (Financial Independence, Retire Early) uses the 25x rule: you need 25 times your annual expenses invested to sustain a 4% annual withdrawal rate indefinitely. This calculator adjusts your current expenses for inflation and shows the monthly investment required to reach your target.",
  formulaKey: "fire",
  inputs: [
    {
      key: "currentMonthlyExpense",
      label: "Current Monthly Expenses",
      type: "currency",
      defaultValue: 50000,
      min: 5000,
      max: 1000000,
      step: 1000,
      unit: "₹",
    },
    {
      key: "currentAge",
      label: "Current Age",
      type: "number",
      defaultValue: 30,
      min: 18,
      max: 60,
      step: 1,
      unit: "yrs",
    },
    {
      key: "targetFireAge",
      label: "Target FIRE Age",
      type: "number",
      defaultValue: 45,
      min: 25,
      max: 65,
      step: 1,
      unit: "yrs",
    },
    {
      key: "inflationRate",
      label: "Expected Inflation",
      type: "percent",
      defaultValue: 6,
      min: 3,
      max: 10,
      step: 0.5,
      unit: "%",
    },
    {
      key: "expectedReturnRate",
      label: "Expected Annual Return",
      type: "percent",
      defaultValue: 12,
      min: 6,
      max: 18,
      step: 0.5,
      unit: "%",
    },
    {
      key: "fireMultiplier",
      label: "FIRE Type",
      type: "select",
      defaultValue: 25,
      options: [
        { label: "Lean FIRE (15x — minimal lifestyle)", value: 15 },
        { label: "Regular FIRE (25x — comfortable lifestyle)", value: 25 },
        { label: "Fat FIRE (50x — luxury lifestyle)", value: 50 },
      ],
    },
    {
      key: "existingCorpus",
      label: "Existing Investments (earmarked for FIRE)",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 100000000,
      step: 50000,
      unit: "₹",
    },
  ],
  outputs: [
    { key: "fireNumber", label: "FIRE Number", unit: "₹", highlight: true },
    { key: "requiredMonthlySip", label: "Required Monthly SIP", unit: "₹" },
    { key: "yearsToFire", label: "Years to FIRE", unit: "yrs" },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "flame",
  faqs: [
    {
      question: "Why 25x and not some other number?",
      answer:
        "25x comes from the 4% Safe Withdrawal Rate (1/25 = 4%), based on the Trinity Study using historical US market data. Since India has historically higher inflation (6-7% vs the US's 2-3%), many Indian financial advisors recommend a more conservative 28-33x multiplier instead.",
    },
    {
      question: "What's the difference between Lean, Regular, and Fat FIRE?",
      answer:
        "Lean FIRE (15x) targets a minimal, essentials-only lifestyle. Regular FIRE (25x) targets a comfortable middle-class lifestyle. Fat FIRE (50x) targets a fully unrestricted lifestyle with travel, premium healthcare, and discretionary spending intact.",
    },
  ],
  category: { name: "Personal Finance", slug: "personal-finance" },
};

export const emergencyFundConfig: CalculatorConfig = {
  slug: "emergency-fund-calculator",
  name: "Emergency Fund Calculator",
  shortDescription:
    "Calculate your ideal emergency fund target and how long it will take to build it.",
  longDescription:
    "An emergency fund covers unexpected expenses — job loss, medical emergencies, urgent repairs — without forcing you into debt or liquidating investments at a bad time. The standard guidance is 6 months of expenses for salaried employees, 9 for self-employed, and 12 for freelancers.",
  formulaKey: "emergencyFund",
  inputs: [
    {
      key: "monthlyEssentialExpenses",
      label: "Monthly Essential Expenses",
      type: "currency",
      defaultValue: 40000,
      min: 5000,
      max: 1000000,
      step: 1000,
      unit: "₹",
      helpText: "Include rent/EMI, groceries, utilities, insurance — exclude discretionary spending.",
    },
    {
      key: "coverageMonths",
      label: "Coverage Period",
      type: "select",
      defaultValue: 6,
      options: [
        { label: "3 months", value: 3 },
        { label: "6 months (Salaried, standard)", value: 6 },
        { label: "9 months (Self-employed)", value: 9 },
        { label: "12 months (Freelancer/Gig)", value: 12 },
      ],
    },
    {
      key: "existingSavings",
      label: "Existing Emergency Savings",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 10000000,
      step: 5000,
      unit: "₹",
    },
    {
      key: "monthlyContribution",
      label: "Monthly Contribution Towards Fund",
      type: "currency",
      defaultValue: 5000,
      min: 0,
      max: 500000,
      step: 500,
      unit: "₹",
    },
    {
      key: "annualReturnRate",
      label: "Expected Return (Liquid Fund/Savings)",
      type: "percent",
      defaultValue: 4,
      min: 2,
      max: 8,
      step: 0.5,
      unit: "%",
    },
  ],
  outputs: [
    { key: "targetAmount", label: "Target Amount", unit: "₹", highlight: true },
    { key: "remainingNeeded", label: "Still Needed", unit: "₹" },
    { key: "monthsToTarget", label: "Months to Reach Target", unit: "months" },
  ],
  chartTypes: ["pie", "bar"],
  generatesYearlyTable: true,
  icon: "shield",
  faqs: [
    {
      question: "Where should I keep my emergency fund?",
      answer:
        "In safe, liquid instruments only — savings accounts, liquid mutual funds, or sweep-in FDs. Avoid equity, locked instruments like regular FDs or PPF, or anything with exit penalties, since you need guaranteed, immediate access during a crisis.",
    },
    {
      question: "Should I include EMIs in my essential expenses?",
      answer:
        "Yes — lenders don't pause payments during a personal emergency, so EMIs (home loan, car loan, etc.) should be included in your essential monthly expense figure.",
    },
  ],
  category: { name: "Personal Finance", slug: "personal-finance" },
};

export const netWorthConfig: CalculatorConfig = {
  slug: "net-worth-calculator",
  name: "Net Worth Calculator",
  shortDescription:
    "Calculate your net worth by listing your assets and liabilities — a financial health snapshot.",
  longDescription:
    "Net worth is the simplest measure of overall financial health: everything you own minus everything you owe. Tracking it over time (ideally reviewed annually) shows whether you're genuinely building wealth, regardless of income level.",
  formulaKey: "netWorth",
  inputs: [
    {
      key: "cashAndSavings",
      label: "Cash & Savings",
      type: "currency",
      defaultValue: 200000,
      min: 0,
      max: 100000000,
      step: 5000,
      unit: "₹",
    },
    {
      key: "investments",
      label: "Investments (MF, Stocks, FD, PPF, etc.)",
      type: "currency",
      defaultValue: 500000,
      min: 0,
      max: 100000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "realEstateValue",
      label: "Real Estate (Current Market Value)",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 200000000,
      step: 100000,
      unit: "₹",
    },
    {
      key: "otherAssets",
      label: "Other Assets (Vehicle, Gold, etc.)",
      type: "currency",
      defaultValue: 100000,
      min: 0,
      max: 50000000,
      step: 5000,
      unit: "₹",
    },
    {
      key: "homeLoanOutstanding",
      label: "Home Loan Outstanding",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 200000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "otherLoansOutstanding",
      label: "Other Loans Outstanding (Car, Personal, etc.)",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 50000000,
      step: 5000,
      unit: "₹",
    },
    {
      key: "creditCardDues",
      label: "Credit Card Dues",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 5000000,
      step: 1000,
      unit: "₹",
    },
  ],
  outputs: [
    { key: "totalAssets", label: "Total Assets", unit: "₹" },
    { key: "totalLiabilities", label: "Total Liabilities", unit: "₹" },
    { key: "netWorth", label: "Net Worth", unit: "₹", highlight: true },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "wallet",
  faqs: [
    {
      question: "Should I include my primary residence in net worth?",
      answer:
        "Most financial planners say yes, at current market value — but some prefer to track it separately since you can't easily access that value without selling. Consider tracking both 'net worth including home' and 'liquid net worth' (excluding it).",
    },
    {
      question: "How often should I calculate my net worth?",
      answer:
        "Quarterly or annually is typical. Checking too frequently can cause unnecessary anxiety over short-term market fluctuations in your investments — net worth is a long-term trend indicator, not a daily scorecard.",
    },
  ],
  category: { name: "Personal Finance", slug: "personal-finance" },
};

export const budgetConfig: CalculatorConfig = {
  slug: "budget-calculator",
  name: "Budget Calculator (50/30/20 Rule)",
  shortDescription:
    "Compare your actual spending against the recommended 50/30/20 budgeting framework.",
  longDescription:
    "The 50/30/20 rule is a simple, widely-used budgeting framework: 50% of take-home income for needs, 30% for wants, and 20% for savings and debt repayment. This calculator shows the recommended split for your income and compares it to your actual spending.",
  formulaKey: "budget",
  inputs: [
    {
      key: "monthlyIncome",
      label: "Monthly Take-Home Income",
      type: "currency",
      defaultValue: 80000,
      min: 5000,
      max: 5000000,
      step: 1000,
      unit: "₹",
    },
    {
      key: "actualNeeds",
      label: "Actual Spending: Needs",
      type: "currency",
      defaultValue: 40000,
      min: 0,
      max: 5000000,
      step: 1000,
      unit: "₹",
      helpText: "Rent/EMI, groceries, utilities, insurance, minimum debt payments.",
    },
    {
      key: "actualWants",
      label: "Actual Spending: Wants",
      type: "currency",
      defaultValue: 25000,
      min: 0,
      max: 5000000,
      step: 1000,
      unit: "₹",
      helpText: "Dining out, entertainment, shopping, travel, subscriptions.",
    },
    {
      key: "actualSavings",
      label: "Actual Spending: Savings & Investments",
      type: "currency",
      defaultValue: 15000,
      min: 0,
      max: 5000000,
      step: 1000,
      unit: "₹",
    },
  ],
  outputs: [
    { key: "recommendedSavings", label: "Recommended Savings (20%)", unit: "₹" },
    { key: "actualSavings", label: "Your Actual Savings", unit: "₹", highlight: true },
    { key: "unallocated", label: "Unallocated / Deficit", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "pie-chart",
  faqs: [
    {
      question: "Is the 50/30/20 rule right for everyone?",
      answer:
        "It's a useful starting point, not a strict rule. In high cost-of-living cities, needs may genuinely exceed 50% of income — in that case, focus on maximizing savings within your means rather than forcing an unrealistic split.",
    },
    {
      question: "Should EMIs count as 'needs' or 'savings'?",
      answer:
        "Loan EMIs (home, car, personal) are typically counted as 'needs' since they're mandatory payments. Extra/voluntary prepayments toward debt can be counted under 'savings', since they're discretionary debt reduction rather than a required minimum.",
    },
  ],
  category: { name: "Personal Finance", slug: "personal-finance" },
};

export const debtPayoffConfig: CalculatorConfig = {
  slug: "debt-payoff-calculator",
  name: "Debt Payoff Calculator (Snowball vs Avalanche)",
  shortDescription:
    "Compare the Snowball and Avalanche debt repayment strategies across up to 4 debts.",
  longDescription:
    "The Snowball method pays off your smallest balance first for quick psychological wins. The Avalanche method targets your highest interest rate first, which mathematically minimizes total interest paid. Both make minimum payments on every debt and roll extra payments onto one target debt at a time.",
  formulaKey: "debtPayoff",
  inputs: [
    { key: "debt1Balance", label: "Debt 1: Balance", type: "currency", defaultValue: 50000, min: 0, max: 10000000, step: 1000, unit: "₹" },
    { key: "debt1Rate", label: "Debt 1: Interest Rate", type: "percent", defaultValue: 36, min: 0, max: 45, step: 0.5, unit: "%" },
    { key: "debt1MinPayment", label: "Debt 1: Minimum Payment", type: "currency", defaultValue: 2500, min: 0, max: 500000, step: 100, unit: "₹" },
    { key: "debt2Balance", label: "Debt 2: Balance", type: "currency", defaultValue: 200000, min: 0, max: 10000000, step: 1000, unit: "₹" },
    { key: "debt2Rate", label: "Debt 2: Interest Rate", type: "percent", defaultValue: 12, min: 0, max: 45, step: 0.5, unit: "%" },
    { key: "debt2MinPayment", label: "Debt 2: Minimum Payment", type: "currency", defaultValue: 6000, min: 0, max: 500000, step: 100, unit: "₹" },
    { key: "debt3Balance", label: "Debt 3: Balance (optional)", type: "currency", defaultValue: 0, min: 0, max: 10000000, step: 1000, unit: "₹" },
    { key: "debt3Rate", label: "Debt 3: Interest Rate", type: "percent", defaultValue: 9, min: 0, max: 45, step: 0.5, unit: "%" },
    { key: "debt3MinPayment", label: "Debt 3: Minimum Payment", type: "currency", defaultValue: 0, min: 0, max: 500000, step: 100, unit: "₹" },
    { key: "debt4Balance", label: "Debt 4: Balance (optional)", type: "currency", defaultValue: 0, min: 0, max: 10000000, step: 1000, unit: "₹" },
    { key: "debt4Rate", label: "Debt 4: Interest Rate", type: "percent", defaultValue: 8.5, min: 0, max: 45, step: 0.5, unit: "%" },
    { key: "debt4MinPayment", label: "Debt 4: Minimum Payment", type: "currency", defaultValue: 0, min: 0, max: 500000, step: 100, unit: "₹" },
    {
      key: "extraMonthlyPayment",
      label: "Extra Monthly Payment (beyond minimums)",
      type: "currency",
      defaultValue: 5000,
      min: 0,
      max: 1000000,
      step: 500,
      unit: "₹",
    },
    {
      key: "method",
      label: "Repayment Method",
      type: "select",
      defaultValue: 0,
      options: [
        { label: "Snowball (smallest balance first)", value: 0 },
        { label: "Avalanche (highest interest rate first)", value: 1 },
      ],
    },
  ],
  outputs: [
    { key: "totalMonths", label: "Months to Debt-Free", unit: "months", highlight: true },
    { key: "totalInterestPaid", label: "Total Interest Paid", unit: "₹" },
    { key: "totalDebt", label: "Total Debt", unit: "₹" },
  ],
  chartTypes: ["line", "pie"],
  generatesYearlyTable: true,
  icon: "trending-down",
  faqs: [
    {
      question: "Which method should I choose?",
      answer:
        "Avalanche saves more money mathematically since it eliminates high-interest debt fastest. Snowball can be more sustainable for many people because clearing a full debt — even a small one — provides motivation to keep going. Try both in this calculator and see which fits your situation.",
    },
    {
      question: "Should I include my mortgage/home loan in this calculator?",
      answer:
        "Generally no, unless you specifically want to factor it into an aggressive payoff plan. Most people exclude long-term, low-interest secured debt like home loans and focus this method on higher-interest unsecured debt like credit cards and personal loans.",
    },
  ],
  category: { name: "Personal Finance", slug: "personal-finance" },
};

export const futureValueConfig: CalculatorConfig = {
  slug: "future-value-calculator",
  name: "Future Value Calculator",
  shortDescription:
    "Calculate the future value of a one-time investment plus optional periodic contributions, with flexible compounding.",
  longDescription:
    "Future Value (FV) tells you what a sum of money invested today — plus any periodic contributions — will grow to by a future date, given a rate of return and compounding frequency. This is the foundational time-value-of-money calculation behind most other investment calculators.",
  formulaKey: "futureValue",
  inputs: [
    {
      key: "presentValue",
      label: "Initial Investment",
      type: "currency",
      defaultValue: 100000,
      min: 0,
      max: 100000000,
      step: 5000,
      unit: "₹",
    },
    {
      key: "periodicContribution",
      label: "Periodic Contribution (optional)",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 1000000,
      step: 500,
      unit: "₹",
      helpText: "Contributed at the same frequency as compounding (e.g. monthly if compounding monthly).",
    },
    {
      key: "annualRate",
      label: "Annual Rate of Return",
      type: "percent",
      defaultValue: 10,
      min: 1,
      max: 30,
      step: 0.5,
      unit: "%",
    },
    {
      key: "years",
      label: "Time Period",
      type: "years",
      defaultValue: 10,
      min: 1,
      max: 50,
      step: 1,
      unit: "yrs",
    },
    {
      key: "compoundingFrequency",
      label: "Compounding Frequency",
      type: "select",
      defaultValue: 1,
      options: [
        { label: "Annually", value: 1 },
        { label: "Quarterly", value: 4 },
        { label: "Monthly", value: 12 },
      ],
    },
  ],
  outputs: [
    { key: "totalContributed", label: "Total Contributed", unit: "₹" },
    { key: "totalGrowth", label: "Growth", unit: "₹" },
    { key: "futureValue", label: "Future Value", unit: "₹", highlight: true },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "trending-up",
  faqs: [
    {
      question: "What's the difference between this and the SIP or Lumpsum calculators?",
      answer:
        "This is the general-purpose version that combines both: a one-time investment AND optional ongoing contributions, with a choice of compounding frequency. The SIP and Lumpsum calculators are specialized, simpler versions of the same underlying math.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};

export const presentValueConfig: CalculatorConfig = {
  slug: "present-value-calculator",
  name: "Present Value Calculator",
  shortDescription:
    "Calculate how much you need to invest today to reach a specific amount in the future.",
  longDescription:
    "Present Value (PV) answers the reverse question from Future Value: given a target amount you want in the future, how much would you need to invest today, at a given rate of return, to get there? This reflects the time value of money — a rupee today is worth more than a rupee in the future.",
  formulaKey: "presentValue",
  inputs: [
    {
      key: "futureValue",
      label: "Target Future Amount",
      type: "currency",
      defaultValue: 1000000,
      min: 1000,
      max: 100000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "annualRate",
      label: "Discount Rate (Annual)",
      type: "percent",
      defaultValue: 10,
      min: 1,
      max: 30,
      step: 0.5,
      unit: "%",
      helpText: "Your expected rate of return, used to 'discount' the future amount back to today's value.",
    },
    {
      key: "years",
      label: "Time Period",
      type: "years",
      defaultValue: 5,
      min: 1,
      max: 50,
      step: 1,
      unit: "yrs",
    },
    {
      key: "compoundingFrequency",
      label: "Compounding Frequency",
      type: "select",
      defaultValue: 1,
      options: [
        { label: "Annually", value: 1 },
        { label: "Quarterly", value: 4 },
        { label: "Monthly", value: 12 },
      ],
    },
  ],
  outputs: [
    { key: "presentValue", label: "Present Value (Needed Today)", unit: "₹", highlight: true },
    { key: "discountAmount", label: "Time Value Discount", unit: "₹" },
    { key: "futureValue", label: "Target Future Amount", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: true,
  icon: "calculator",
  faqs: [
    {
      question: "Why is money today worth more than the same amount in the future?",
      answer:
        "Because money available today can be invested to earn a return, growing into a larger amount by that future date. The 'discount rate' represents that opportunity cost — the return you're giving up by not having the money now.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};

export const goalPlanningConfig: CalculatorConfig = {
  slug: "goal-planning-calculator",
  name: "Goal Planning Calculator",
  shortDescription:
    "Calculate the monthly SIP needed to reach any financial goal — a house, wedding, world trip, or anything else.",
  longDescription:
    "Whether you're saving for a home down payment, a wedding, or a dream vacation, this calculator works backward from your target amount and timeline to tell you exactly how much to invest each month, accounting for any existing savings and optional inflation adjustment on the goal itself.",
  formulaKey: "goalPlanning",
  inputs: [
    {
      key: "targetAmount",
      label: "Goal Amount (Today's Value)",
      type: "currency",
      defaultValue: 2000000,
      min: 10000,
      max: 100000000,
      step: 50000,
      unit: "₹",
    },
    {
      key: "yearsToGoal",
      label: "Years to Goal",
      type: "years",
      defaultValue: 5,
      min: 1,
      max: 40,
      step: 1,
      unit: "yrs",
    },
    {
      key: "expectedReturnRate",
      label: "Expected Annual Return",
      type: "percent",
      defaultValue: 12,
      min: 1,
      max: 25,
      step: 0.5,
      unit: "%",
    },
    {
      key: "inflationRate",
      label: "Goal Inflation Rate (optional)",
      type: "percent",
      defaultValue: 0,
      min: 0,
      max: 12,
      step: 0.5,
      unit: "%",
      helpText: "If your goal's cost will rise with inflation (e.g. property, education), enter an estimate here.",
    },
    {
      key: "existingSavings",
      label: "Existing Savings (earmarked for this goal)",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 50000000,
      step: 10000,
      unit: "₹",
    },
  ],
  outputs: [
    { key: "inflatedTarget", label: "Goal Amount (at target date)", unit: "₹" },
    { key: "requiredMonthlySip", label: "Required Monthly SIP", unit: "₹", highlight: true },
    { key: "remainingNeeded", label: "Remaining Corpus Needed", unit: "₹" },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "target",
  faqs: [
    {
      question: "Should I include inflation for every goal?",
      answer:
        "It depends on the goal. Costs like education, real estate, and weddings tend to rise with or above general inflation. A fixed-rupee goal (like a specific savings target) doesn't need an inflation adjustment.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};

export const childEducationConfig: CalculatorConfig = {
  slug: "child-education-calculator",
  name: "Child Education Calculator",
  shortDescription:
    "Calculate the monthly SIP needed to fund your child's future education, adjusted for education inflation.",
  longDescription:
    "Education costs in India have historically risen faster than general inflation, especially for professional and international programs. This calculator (built on the same goal-planning math used elsewhere on this site) helps you work backward from today's estimated cost to a monthly SIP target, adjusted for your assumed education inflation rate.",
  formulaKey: "goalPlanning",
  inputs: [
    {
      key: "targetAmount",
      label: "Estimated Cost Today",
      type: "currency",
      defaultValue: 2500000,
      min: 100000,
      max: 50000000,
      step: 50000,
      unit: "₹",
      helpText: "Research current costs for your child's likely course/college as a baseline.",
    },
    {
      key: "yearsToGoal",
      label: "Years Until Education Begins",
      type: "years",
      defaultValue: 15,
      min: 1,
      max: 25,
      step: 1,
      unit: "yrs",
    },
    {
      key: "expectedReturnRate",
      label: "Expected Annual Return",
      type: "percent",
      defaultValue: 12,
      min: 1,
      max: 25,
      step: 0.5,
      unit: "%",
    },
    {
      key: "inflationRate",
      label: "Education Inflation Rate",
      type: "percent",
      defaultValue: 8,
      min: 4,
      max: 15,
      step: 0.5,
      unit: "%",
      helpText: "Education costs in India have historically risen faster than general inflation — 8-10% is a common planning assumption.",
    },
    {
      key: "existingSavings",
      label: "Existing Savings (earmarked for education)",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 50000000,
      step: 10000,
      unit: "₹",
    },
  ],
  outputs: [
    { key: "inflatedTarget", label: "Estimated Cost (at admission time)", unit: "₹" },
    { key: "requiredMonthlySip", label: "Required Monthly SIP", unit: "₹", highlight: true },
    { key: "remainingNeeded", label: "Remaining Corpus Needed", unit: "₹" },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "graduation-cap",
  faqs: [
    {
      question: "Why is education inflation higher than general inflation?",
      answer:
        "Private education costs (tuition, hostel, study-abroad expenses) have historically grown faster than the general Consumer Price Index in India, often in the 8-12% range, driven by rising demand for quality education and currency depreciation for overseas programs.",
    },
    {
      question: "What if I don't know which course or college my child will choose?",
      answer:
        "Use a reasonable range based on similar programs today (e.g. a private engineering degree, an MBA, or a study-abroad program) as your baseline 'cost today' input, and revisit this calculator every few years as plans become clearer.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};

export const wealthConfig: CalculatorConfig = {
  slug: "wealth-calculator",
  name: "Wealth Calculator",
  shortDescription:
    "Project your total wealth from combining a one-time lumpsum investment with an ongoing monthly SIP.",
  longDescription:
    "Many investors do both at once — investing a bonus or windfall as a lumpsum while also running a regular monthly SIP. This calculator combines both components (using the same verified SIP and lumpsum math used elsewhere on this site) to show your total projected wealth.",
  formulaKey: "wealth",
  inputs: [
    {
      key: "initialLumpsum",
      label: "Initial Lumpsum Investment",
      type: "currency",
      defaultValue: 200000,
      min: 0,
      max: 50000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "monthlySip",
      label: "Monthly SIP",
      type: "currency",
      defaultValue: 10000,
      min: 0,
      max: 1000000,
      step: 500,
      unit: "₹",
    },
    {
      key: "annualReturnRate",
      label: "Expected Annual Return",
      type: "percent",
      defaultValue: 12,
      min: 1,
      max: 25,
      step: 0.5,
      unit: "%",
    },
    {
      key: "investmentPeriodYears",
      label: "Investment Period",
      type: "years",
      defaultValue: 15,
      min: 1,
      max: 40,
      step: 1,
      unit: "yrs",
    },
  ],
  outputs: [
    { key: "totalInvested", label: "Total Invested", unit: "₹" },
    { key: "totalGrowth", label: "Total Growth", unit: "₹" },
    { key: "totalWealth", label: "Total Wealth", unit: "₹", highlight: true },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "trending-up",
  faqs: [
    {
      question: "How is this different from just adding the SIP and Lumpsum calculators separately?",
      answer:
        "Mathematically it's the same result — this calculator simply combines both calculations in one place so you can see your total wealth picture (and a single combined chart/table) without running two separate calculators and adding the numbers yourself.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};

export const humanLifeValueConfig: CalculatorConfig = {
  slug: "human-life-value-calculator",
  name: "Human Life Value Calculator",
  shortDescription:
    "Calculate the life insurance cover you need using the Income Replacement Method.",
  longDescription:
    "Human Life Value (HLV) estimates the economic value of your future income to your family, helping you choose adequate life insurance coverage. This calculator uses the present-value income replacement method, which accounts for the time value of money — giving a more accurate (and typically lower) estimate than simply multiplying your income by your remaining working years.",
  formulaKey: "humanLifeValue",
  inputs: [
    {
      key: "annualIncome",
      label: "Annual Income",
      type: "currency",
      defaultValue: 1000000,
      min: 100000,
      max: 100000000,
      step: 50000,
      unit: "₹",
    },
    {
      key: "personalExpenses",
      label: "Annual Personal Expenses",
      type: "currency",
      defaultValue: 200000,
      min: 0,
      max: 10000000,
      step: 10000,
      unit: "₹",
      helpText: "Expenses spent only on yourself (not contributing to family support) — subtracted from income.",
    },
    {
      key: "currentAge",
      label: "Current Age",
      type: "number",
      defaultValue: 35,
      min: 18,
      max: 60,
      step: 1,
      unit: "yrs",
    },
    {
      key: "retirementAge",
      label: "Planned Retirement Age",
      type: "number",
      defaultValue: 60,
      min: 45,
      max: 70,
      step: 1,
      unit: "yrs",
    },
    {
      key: "outstandingLiabilities",
      label: "Outstanding Liabilities (loans, etc.)",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 100000000,
      step: 50000,
      unit: "₹",
    },
    {
      key: "existingSavingsAndCover",
      label: "Existing Savings & Life Insurance Cover",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 100000000,
      step: 50000,
      unit: "₹",
    },
    {
      key: "discountRate",
      label: "Discount Rate (0 = simple multiplication)",
      type: "percent",
      defaultValue: 6,
      min: 0,
      max: 12,
      step: 0.5,
      unit: "%",
      helpText: "Set to 0% to use the simple 'income × years' rule of thumb instead of present-value discounting.",
    },
  ],
  outputs: [
    { key: "hlvBeforeAdjustments", label: "Income Replacement Need", unit: "₹" },
    { key: "recommendedCover", label: "Recommended Life Cover", unit: "₹", highlight: true },
    { key: "remainingWorkingYears", label: "Remaining Working Years", unit: "yrs" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "shield",
  faqs: [
    {
      question: "Why does the discounted version give a lower number than income × years?",
      answer:
        "Because money needed 20-30 years from now is worth less in today's terms than money needed next year. The present-value method correctly accounts for the fact that your family's insurance payout, if invested, would itself earn returns over time — so they need less than the full nominal sum.",
    },
    {
      question: "Should I subtract my existing investments from my insurance need?",
      answer:
        "Yes — any savings, investments, or existing life cover already earmarked for your family's future reduces the additional insurance you need to buy.",
    },
  ],
  category: { name: "Insurance", slug: "insurance" },
};

export const breakEvenConfig: CalculatorConfig = {
  slug: "break-even-calculator",
  name: "Break-Even Point Calculator",
  shortDescription:
    "Calculate how many units you need to sell to cover your fixed and variable costs.",
  longDescription:
    "The break-even point is where your total revenue equals your total costs — neither profit nor loss. Knowing this number helps with pricing decisions, sales targets, and understanding how much margin of safety your current sales volume provides.",
  formulaKey: "breakEven",
  inputs: [
    {
      key: "fixedCosts",
      label: "Monthly Fixed Costs",
      type: "currency",
      defaultValue: 50000,
      min: 0,
      max: 10000000,
      step: 1000,
      unit: "₹",
      helpText: "Rent, salaries, insurance — costs that don't change with sales volume.",
    },
    {
      key: "sellingPricePerUnit",
      label: "Selling Price per Unit",
      type: "currency",
      defaultValue: 500,
      min: 1,
      max: 1000000,
      step: 10,
      unit: "₹",
    },
    {
      key: "variableCostPerUnit",
      label: "Variable Cost per Unit",
      type: "currency",
      defaultValue: 200,
      min: 0,
      max: 1000000,
      step: 10,
      unit: "₹",
      helpText: "Cost of materials, labor, and other costs that scale with each unit sold.",
    },
    {
      key: "currentMonthlyUnits",
      label: "Current Monthly Units Sold (optional)",
      type: "number",
      defaultValue: 150,
      min: 0,
      max: 1000000,
      step: 10,
      unit: "units",
    },
  ],
  outputs: [
    { key: "breakEvenUnits", label: "Break-Even Units", unit: "units", highlight: true },
    { key: "breakEvenRevenue", label: "Break-Even Revenue", unit: "₹" },
    { key: "contributionMargin", label: "Contribution Margin per Unit", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "bar-chart-2",
  faqs: [
    {
      question: "What's the difference between break-even units and break-even revenue?",
      answer:
        "Break-even units is the number of products/services you need to sell. Break-even revenue is the rupee amount that represents — useful when comparing against your sales targets or revenue goals directly.",
    },
    {
      question: "What is margin of safety?",
      answer:
        "Margin of safety shows how far your current sales are above (or below) your break-even point, as a percentage. A higher margin of safety means more cushion against a sales downturn before you start losing money.",
    },
  ],
  category: { name: "Business", slug: "business" },
};

export const roiConfig: CalculatorConfig = {
  slug: "roi-calculator",
  name: "ROI Calculator",
  shortDescription:
    "Calculate the return on investment for any business or personal investment, with an annualized rate for comparison.",
  longDescription:
    "ROI (Return on Investment) measures the profitability of an investment as a percentage of its cost. This calculator also computes an annualized ROI, which lets you fairly compare investments held for different lengths of time — the same way CAGR works for portfolio investments.",
  formulaKey: "roi",
  inputs: [
    {
      key: "investmentCost",
      label: "Investment Cost",
      type: "currency",
      defaultValue: 500000,
      min: 1,
      max: 100000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "finalValue",
      label: "Final Value / Returns",
      type: "currency",
      defaultValue: 750000,
      min: 0,
      max: 100000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "years",
      label: "Time Period",
      type: "years",
      defaultValue: 3,
      min: 1,
      max: 30,
      step: 1,
      unit: "yrs",
    },
  ],
  outputs: [
    { key: "netProfit", label: "Net Profit", unit: "₹" },
    { key: "roiPercent", label: "Total ROI", unit: "%", highlight: true },
    { key: "annualizedRoiPercent", label: "Annualized ROI", unit: "%" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "trending-up",
  faqs: [
    {
      question: "Why do I need an annualized ROI if I already have total ROI?",
      answer:
        "Total ROI doesn't account for how long it took to achieve. A 50% ROI over 1 year is far better than a 50% ROI over 10 years — annualizing converts both into a comparable yearly rate, the same way CAGR works for investment returns.",
    },
  ],
  category: { name: "Business", slug: "business" },
};

export const profitMarginConfig: CalculatorConfig = {
  slug: "profit-margin-calculator",
  name: "Profit Margin Calculator",
  shortDescription:
    "Calculate your gross, operating, and net profit margins from revenue and cost figures.",
  longDescription:
    "Profit margin measures how much of your revenue translates into actual profit at different stages: gross margin (after direct production costs), operating margin (after running the business), and net margin (the final bottom line after taxes and interest).",
  formulaKey: "profitMargin",
  inputs: [
    {
      key: "revenue",
      label: "Total Revenue",
      type: "currency",
      defaultValue: 1000000,
      min: 1,
      max: 1000000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "cogs",
      label: "Cost of Goods Sold (COGS)",
      type: "currency",
      defaultValue: 400000,
      min: 0,
      max: 1000000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "operatingExpenses",
      label: "Operating Expenses",
      type: "currency",
      defaultValue: 250000,
      min: 0,
      max: 1000000000,
      step: 10000,
      unit: "₹",
      helpText: "Rent, salaries, marketing, admin — costs of running the business beyond direct production.",
    },
    {
      key: "taxesAndInterest",
      label: "Taxes & Interest",
      type: "currency",
      defaultValue: 50000,
      min: 0,
      max: 1000000000,
      step: 5000,
      unit: "₹",
    },
  ],
  outputs: [
    { key: "grossMarginPercent", label: "Gross Margin", unit: "%" },
    { key: "operatingMarginPercent", label: "Operating Margin", unit: "%" },
    { key: "netMarginPercent", label: "Net Margin", unit: "%", highlight: true },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "percent",
  faqs: [
    {
      question: "What's a 'good' profit margin?",
      answer:
        "It varies enormously by industry — software businesses often see 70-90% gross margins, while retail typically runs 20-40%. Compare your margins against your specific industry's benchmarks rather than a universal target.",
    },
    {
      question: "What's the difference between gross margin and net margin?",
      answer:
        "Gross margin only accounts for direct production costs (COGS). Net margin accounts for everything — production, operating expenses, taxes, and interest — giving the true bottom-line profitability of the business.",
    },
  ],
  category: { name: "Business", slug: "business" },
};

export const termInsuranceCoverageConfig: CalculatorConfig = {
  slug: "term-insurance-calculator",
  name: "Term Insurance Coverage Calculator",
  shortDescription:
    "Find the recommended term insurance sum assured based on your income, dependents, and liabilities — not a premium quote.",
  longDescription:
    "Term insurance premiums are set by each insurer's own actuarial models, so there's no public formula to calculate an exact premium — get real quotes directly from insurers for that. This calculator instead estimates how much COVER you should buy, using the income-multiplier rule of thumb (10-20x annual income) used consistently across Indian insurers.",
  formulaKey: "termInsuranceCoverage",
  inputs: [
    {
      key: "annualIncome",
      label: "Annual Income",
      type: "currency",
      defaultValue: 1000000,
      min: 100000,
      max: 100000000,
      step: 50000,
      unit: "₹",
    },
    {
      key: "incomeMultiplier",
      label: "Income Multiplier",
      type: "select",
      defaultValue: 15,
      options: [
        { label: "10x (Conservative, few dependents)", value: 10 },
        { label: "15x (Standard)", value: 15 },
        { label: "20x (Higher liabilities/dependents)", value: 20 },
      ],
    },
    {
      key: "numberOfDependents",
      label: "Number of Dependents",
      type: "number",
      defaultValue: 2,
      min: 0,
      max: 10,
      step: 1,
      unit: "people",
    },
    {
      key: "outstandingLiabilities",
      label: "Outstanding Liabilities (loans)",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 100000000,
      step: 50000,
      unit: "₹",
    },
    {
      key: "existingCoverAndAssets",
      label: "Existing Cover & Liquid Assets",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 100000000,
      step: 50000,
      unit: "₹",
    },
  ],
  outputs: [
    { key: "baseCover", label: "Income Replacement Cover", unit: "₹" },
    { key: "recommendedCover", label: "Recommended Sum Assured", unit: "₹", highlight: true },
    { key: "totalNeed", label: "Total Coverage Need", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "shield",
  faqs: [
    {
      question: "Why doesn't this calculator show me a premium amount?",
      answer:
        "Because there's no universal formula — each insurer prices premiums using their own proprietary actuarial mortality tables, medical underwriting, and risk models. The same coverage can cost meaningfully different amounts at different insurers. Use this calculator to determine how much cover you need, then get actual quotes from insurers for premium comparison.",
    },
    {
      question: "Should I use this or the Human Life Value calculator?",
      answer:
        "The Human Life Value calculator gives a more precise, income-based estimate using present-value discounting. This calculator uses the simpler industry rule-of-thumb (income multiplier). Using both and comparing the results is a reasonable way to sanity-check your coverage decision.",
    },
  ],
  category: { name: "Insurance", slug: "insurance" },
};

export const healthInsuranceCoverageConfig: CalculatorConfig = {
  slug: "health-insurance-calculator",
  name: "Health Insurance Coverage Calculator",
  shortDescription:
    "Find the recommended health insurance sum insured for your family based on city tier and income — not a premium quote.",
  longDescription:
    "Like term insurance, health insurance premiums are set by each insurer's own underwriting — multiple industry sources confirm identical coverage can vary 20-40% in price between insurers. This calculator instead estimates how much SUM INSURED you should target, using city-tier and income-based benchmarks that converge across independent sources.",
  formulaKey: "healthInsuranceCoverage",
  inputs: [
    {
      key: "annualIncome",
      label: "Annual Household Income",
      type: "currency",
      defaultValue: 1200000,
      min: 100000,
      max: 100000000,
      step: 50000,
      unit: "₹",
    },
    {
      key: "cityTier",
      label: "City Tier",
      type: "select",
      defaultValue: 1,
      options: [
        { label: "Metro (Delhi, Mumbai, Bangalore, etc.)", value: 1 },
        { label: "Tier-2 City", value: 2 },
        { label: "Tier-3 City", value: 3 },
      ],
    },
    {
      key: "familySize",
      label: "Family Size (for floater plan)",
      type: "number",
      defaultValue: 4,
      min: 1,
      max: 10,
      step: 1,
      unit: "people",
    },
    {
      key: "hasChronicCondition",
      label: "Any Family Member with Chronic Condition?",
      type: "select",
      defaultValue: 0,
      options: [
        { label: "No", value: 0 },
        { label: "Yes", value: 1 },
      ],
    },
  ],
  outputs: [
    { key: "recommendedCover", label: "Recommended Base Sum Insured", unit: "₹", highlight: true },
    { key: "superTopUpRecommended", label: "Recommended Super Top-Up", unit: "₹" },
    { key: "totalRecommendedProtection", label: "Total Recommended Protection", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "heart",
  faqs: [
    {
      question: "What is a super top-up plan?",
      answer:
        "A super top-up pays for hospitalization costs that exceed your base policy's deductible, aggregating all claims in a year before kicking in. Combining a smaller base policy with a super top-up typically costs far less than one large standalone policy of the same total coverage.",
    },
    {
      question: "Why does this not give me a premium estimate?",
      answer:
        "Health insurance premiums depend on age, medical history, city, sum insured, and add-ons — all assessed by each insurer's own underwriting, with no universal public formula. Get actual quotes from insurers once you know your target coverage amount.",
    },
  ],
  category: { name: "Insurance", slug: "insurance" },
};

export const swpConfig: CalculatorConfig = {
  slug: "swp-calculator",
  name: "SWP Calculator",
  shortDescription:
    "Calculate how long your investment corpus will last with regular monthly withdrawals.",
  longDescription:
    "A Systematic Withdrawal Plan (SWP) lets you withdraw a fixed amount regularly from a mutual fund investment while the remaining corpus stays invested and continues to grow. Commonly used by retirees for regular income, this calculator shows how long your corpus survives at your chosen withdrawal rate.",
  formulaKey: "swp",
  inputs: [
    {
      key: "initialInvestment",
      label: "Initial Investment",
      type: "currency",
      defaultValue: 1000000,
      min: 10000,
      max: 100000000,
      step: 50000,
      unit: "₹",
    },
    {
      key: "monthlyWithdrawal",
      label: "Monthly Withdrawal",
      type: "currency",
      defaultValue: 10000,
      min: 500,
      max: 5000000,
      step: 500,
      unit: "₹",
    },
    {
      key: "annualReturnRate",
      label: "Expected Annual Return",
      type: "percent",
      defaultValue: 8,
      min: 1,
      max: 20,
      step: 0.5,
      unit: "%",
      helpText: "Debt-oriented funds (lower risk) are typically recommended for SWP since you need stability, not growth.",
    },
    {
      key: "withdrawalPeriodYears",
      label: "Withdrawal Period",
      type: "years",
      defaultValue: 10,
      min: 1,
      max: 40,
      step: 1,
      unit: "yrs",
    },
  ],
  outputs: [
    { key: "totalWithdrawn", label: "Total Withdrawn", unit: "₹" },
    { key: "finalBalance", label: "Final Balance", unit: "₹", highlight: true },
    { key: "monthsUntilDepleted", label: "Months Until Depleted (-1 = never)", unit: "months" },
  ],
  chartTypes: ["line", "pie"],
  generatesYearlyTable: true,
  icon: "trending-down",
  faqs: [
    {
      question: "What happens if my withdrawal rate is too high?",
      answer:
        "If you withdraw more than your investment earns, your corpus depletes faster and may run out before your planned withdrawal period ends. This calculator's 'months until depleted' output (-1 means it survives the full period) helps you check this before committing to a withdrawal plan.",
    },
    {
      question: "How is SWP taxed?",
      answer:
        "Each withdrawal is treated as a partial redemption and taxed as capital gains based on the type of fund and holding period — not as regular income. For equity funds, gains are typically more tax-efficient than equivalent interest income from fixed deposits.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};

export const goldLoanConfig: CalculatorConfig = {
  slug: "gold-loan-calculator",
  name: "Gold Loan Calculator",
  shortDescription:
    "Calculate your eligible gold loan amount and EMI based on your gold's weight, purity, and current rate.",
  longDescription:
    "Gold loans let you borrow against pledged gold jewelry or coins, typically at lower rates than personal loans. As of April 2026, RBI uses a tiered LTV (Loan-to-Value) structure: up to 85% for loans up to ₹2.5 lakh, 80% for ₹2.5-5 lakh, and 75% above ₹5 lakh.",
  formulaKey: "goldLoan",
  inputs: [
    {
      key: "goldWeightGrams",
      label: "Gold Weight",
      type: "number",
      defaultValue: 50,
      min: 1,
      max: 5000,
      step: 1,
      unit: "grams",
    },
    {
      key: "goldPurityKarat",
      label: "Gold Purity",
      type: "select",
      defaultValue: 22,
      options: [
        { label: "24 Karat (99.9% pure)", value: 24 },
        { label: "22 Karat (91.6% pure, standard jewelry)", value: 22 },
        { label: "18 Karat (75% pure)", value: 18 },
      ],
    },
    {
      key: "goldRatePerGram24k",
      label: "Current 24K Gold Rate (per gram)",
      type: "currency",
      defaultValue: 9500,
      min: 1000,
      max: 50000,
      step: 100,
      unit: "₹",
      helpText: "Check current gold rates — this fluctuates daily and significantly affects your loan eligibility.",
    },
    {
      key: "annualInterestRate",
      label: "Interest Rate (Annual)",
      type: "percent",
      defaultValue: 9,
      min: 7,
      max: 27,
      step: 0.25,
      unit: "%",
      helpText: "Banks typically offer 8.5-12%; NBFCs offer faster processing but higher rates (up to 27%).",
    },
    {
      key: "tenureMonths",
      label: "Tenure",
      type: "number",
      defaultValue: 12,
      min: 3,
      max: 36,
      step: 1,
      unit: "months",
    },
  ],
  outputs: [
    { key: "eligibleLoanAmount", label: "Eligible Loan Amount", unit: "₹", highlight: true },
    { key: "emi", label: "Monthly EMI", unit: "₹" },
    { key: "totalInterest", label: "Total Interest", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "coins",
  faqs: [
    {
      question: "Why did the LTV change in 2026?",
      answer:
        "Effective April 1, 2026, the RBI introduced a tiered LTV structure to give smaller borrowers access to a higher loan-to-value ratio (85% for loans up to ₹2.5 lakh) while keeping the ceiling at 75% for larger loans above ₹5 lakh, replacing the earlier flat 75% rule across all loan sizes.",
    },
    {
      question: "Can I choose bullet repayment instead of EMI?",
      answer:
        "Yes — many lenders offer bullet repayment (pay all interest and principal at the end of the tenure) as an alternative to monthly EMIs, which can suit borrowers expecting a lump sum inflow before the loan matures.",
    },
  ],
  category: { name: "Loans", slug: "loans" },
};

export const businessLoanConfig: CalculatorConfig = {
  slug: "business-loan-calculator",
  name: "Business Loan EMI Calculator",
  shortDescription:
    "Calculate your business loan EMI and total interest for working capital or expansion financing.",
  longDescription:
    "Business loans in India typically range from 10-20% interest depending on the lender, your business vintage, turnover, and credit profile, with tenures generally up to 5-7 years for term loans.",
  formulaKey: "emi",
  inputs: [
    {
      key: "loanAmount",
      label: "Business Loan Amount",
      type: "currency",
      defaultValue: 1000000,
      min: 50000,
      max: 50000000,
      step: 50000,
      unit: "₹",
    },
    {
      key: "annualInterestRate",
      label: "Interest Rate (Annual)",
      type: "percent",
      defaultValue: 14,
      min: 8,
      max: 30,
      step: 0.5,
      unit: "%",
      helpText: "Rates vary widely based on business vintage, turnover, collateral, and credit profile.",
    },
    {
      key: "loanTenureYears",
      label: "Loan Tenure",
      type: "years",
      defaultValue: 5,
      min: 1,
      max: 10,
      step: 1,
      unit: "yrs",
    },
  ],
  outputs: [
    { key: "emi", label: "Monthly EMI", unit: "₹", highlight: true },
    { key: "totalInterest", label: "Total Interest", unit: "₹" },
    { key: "totalPayment", label: "Total Payment", unit: "₹" },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "briefcase",
  faqs: [
    {
      question: "What factors most affect my business loan interest rate?",
      answer:
        "Business vintage (how long you've operated), annual turnover, credit score (both personal and business), collateral offered, and the lender's assessment of your industry's risk all influence the rate offered.",
    },
    {
      question: "Is business loan interest tax-deductible?",
      answer:
        "Yes — interest paid on a business loan used for business purposes is generally deductible as a business expense, reducing your taxable business income. Consult a CA for your specific structure.",
    },
  ],
  category: { name: "Loans", slug: "loans" },
};

export const prepaymentConfig: CalculatorConfig = {
  slug: "loan-prepayment-calculator",
  name: "Loan Prepayment Calculator",
  shortDescription:
    "Calculate how much interest you'll save and how much earlier you'll finish your loan by prepaying.",
  longDescription:
    "Making extra payments toward your loan principal — whether a one-time lumpsum or ongoing additional monthly amounts — reduces your total interest cost and shortens your loan tenure, since your EMI stays the same but more of each payment goes toward principal.",
  formulaKey: "prepayment",
  inputs: [
    {
      key: "loanAmount",
      label: "Original Loan Amount",
      type: "currency",
      defaultValue: 3000000,
      min: 50000,
      max: 200000000,
      step: 50000,
      unit: "₹",
    },
    {
      key: "annualInterestRate",
      label: "Interest Rate (Annual)",
      type: "percent",
      defaultValue: 8.5,
      min: 1,
      max: 25,
      step: 0.05,
      unit: "%",
    },
    {
      key: "originalTenureYears",
      label: "Original Tenure",
      type: "years",
      defaultValue: 20,
      min: 1,
      max: 30,
      step: 1,
      unit: "yrs",
    },
    {
      key: "oneTimePrepayment",
      label: "One-Time Prepayment Amount",
      type: "currency",
      defaultValue: 500000,
      min: 0,
      max: 100000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "prepaymentMonth",
      label: "Prepayment Made in Month",
      type: "number",
      defaultValue: 24,
      min: 1,
      max: 360,
      step: 1,
      unit: "month",
      helpText: "Which month of the loan you'll make this lumpsum prepayment.",
    },
    {
      key: "recurringExtraPayment",
      label: "Additional Monthly Payment (optional)",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 1000000,
      step: 500,
      unit: "₹",
      helpText: "An extra amount paid every month on top of your regular EMI.",
    },
  ],
  outputs: [
    { key: "interestSaved", label: "Interest Saved", unit: "₹", highlight: true },
    { key: "tenureReducedMonths", label: "Tenure Reduced By", unit: "months" },
    { key: "newTotalMonths", label: "New Loan Duration", unit: "months" },
  ],
  chartTypes: ["line", "pie"],
  generatesYearlyTable: true,
  icon: "trending-down",
  faqs: [
    {
      question: "Should I prepay or invest the extra money instead?",
      answer:
        "Compare your loan's interest rate against your expected investment return. If your loan rate is higher than what you'd reliably earn investing, prepaying is usually the better choice — especially for high-interest loans without significant tax benefits.",
    },
    {
      question: "Are there prepayment penalties?",
      answer:
        "For floating-rate home loans, RBI rules prohibit prepayment penalties for individual borrowers. Fixed-rate loans and other loan types may still carry prepayment charges — check your loan agreement.",
    },
  ],
  category: { name: "Loans", slug: "loans" },
};

export const advanceTaxConfig: CalculatorConfig = {
  slug: "advance-tax-calculator",
  name: "Advance Tax Calculator",
  shortDescription:
    "Calculate your quarterly advance tax installments and check if you're required to pay.",
  longDescription:
    "If your estimated tax liability (after TDS) exceeds ₹10,000 in a financial year, you must pay advance tax in 4 cumulative installments — 15% by June, 45% by September, 75% by December, and 100% by March — rather than as a lump sum at filing time.",
  formulaKey: "advanceTax",
  inputs: [
    {
      key: "estimatedAnnualTaxLiability",
      label: "Estimated Annual Tax Liability",
      type: "currency",
      defaultValue: 150000,
      min: 0,
      max: 100000000,
      step: 5000,
      unit: "₹",
      helpText: "Use the Income Tax Calculator to estimate this based on your total income.",
    },
    {
      key: "tdsAlreadyDeducted",
      label: "TDS/TCS Already Deducted (or expected)",
      type: "currency",
      defaultValue: 60000,
      min: 0,
      max: 100000000,
      step: 5000,
      unit: "₹",
    },
  ],
  outputs: [
    { key: "netTaxLiability", label: "Net Tax Liability (after TDS)", unit: "₹" },
    { key: "totalAdvanceTaxPayable", label: "Total Advance Tax Payable", unit: "₹", highlight: true },
    { key: "firstInstallment", label: "First Installment (15 June)", unit: "₹" },
  ],
  chartTypes: ["pie", "bar"],
  generatesYearlyTable: true,
  icon: "calendar",
  faqs: [
    {
      question: "Who is exempt from paying advance tax?",
      answer:
        "Resident senior citizens (60+) who don't have business or professional income are exempt from advance tax, regardless of their tax liability. Most salaried individuals whose entire income is covered by employer TDS also don't need to pay separately, since their tax is already deducted throughout the year.",
    },
    {
      question: "What happens if I miss an installment deadline?",
      answer:
        "You'll owe interest at 1% per month on the shortfall under the relevant sections of the Income Tax Act. Paying at least 12% of your liability by June and 36% by September can help you avoid this interest on those specific installments.",
    },
  ],
  category: { name: "Tax", slug: "tax" },
};

export const mutualFundComparisonConfig: CalculatorConfig = {
  slug: "mutual-fund-comparison-calculator",
  name: "Mutual Fund Comparison Calculator",
  shortDescription:
    "Compare the projected SIP returns of two mutual funds side by side, accounting for expense ratios.",
  longDescription:
    "Compare two funds by their assumed gross return and expense ratio to see how the net return (what you actually receive) compounds differently over time — even a 0.5% expense ratio difference can meaningfully affect your final corpus over a long horizon.",
  formulaKey: "mutualFundComparison",
  inputs: [
    {
      key: "monthlyInvestment",
      label: "Monthly SIP Amount",
      type: "currency",
      defaultValue: 10000,
      min: 500,
      max: 1000000,
      step: 500,
      unit: "₹",
    },
    {
      key: "investmentPeriodYears",
      label: "Investment Period",
      type: "years",
      defaultValue: 10,
      min: 1,
      max: 30,
      step: 1,
      unit: "yrs",
    },
    {
      key: "fundAReturnRate",
      label: "Fund A: Expected Gross Return",
      type: "percent",
      defaultValue: 12,
      min: 1,
      max: 25,
      step: 0.5,
      unit: "%",
    },
    {
      key: "fundAExpenseRatio",
      label: "Fund A: Expense Ratio",
      type: "percent",
      defaultValue: 1,
      min: 0,
      max: 3,
      step: 0.05,
      unit: "%",
    },
    {
      key: "fundBReturnRate",
      label: "Fund B: Expected Gross Return",
      type: "percent",
      defaultValue: 10,
      min: 1,
      max: 25,
      step: 0.5,
      unit: "%",
    },
    {
      key: "fundBExpenseRatio",
      label: "Fund B: Expense Ratio",
      type: "percent",
      defaultValue: 0.5,
      min: 0,
      max: 3,
      step: 0.05,
      unit: "%",
    },
  ],
  outputs: [
    { key: "fundAFinalValue", label: "Fund A: Final Value", unit: "₹" },
    { key: "fundBFinalValue", label: "Fund B: Final Value", unit: "₹", highlight: true },
    { key: "totalInvested", label: "Total Invested (either fund)", unit: "₹" },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "bar-chart-2",
  faqs: [
    {
      question: "Why does expense ratio matter so much over time?",
      answer:
        "Expense ratio is deducted from your returns every single year, so its impact compounds just like returns do. A fund charging 1% more might seem small annually, but over 20-30 years that difference can meaningfully reduce your final corpus — small, repeated costs add up dramatically over long horizons.",
    },
    {
      question: "Should I choose a fund based only on expected return?",
      answer:
        "No — expected returns are assumptions, not guarantees. Also evaluate the fund manager's track record, portfolio composition, risk level, and how consistently the fund has performed across different market cycles, not just a single headline return figure.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};

export const savingsGoalConfig: CalculatorConfig = {
  slug: "savings-goal-calculator",
  name: "Savings Goal Calculator",
  shortDescription:
    "Calculate the monthly savings needed to reach any target amount — vacation, gadget, down payment, or any short-term goal.",
  longDescription:
    "Whether you're saving for a vacation, a new gadget, or a short-term goal, this calculator (built on the same verified goal-planning math used elsewhere on this site) works backward from your target amount and timeline to tell you exactly how much to save each month.",
  formulaKey: "goalPlanning",
  inputs: [
    {
      key: "targetAmount",
      label: "Savings Goal Amount",
      type: "currency",
      defaultValue: 200000,
      min: 1000,
      max: 50000000,
      step: 5000,
      unit: "₹",
    },
    {
      key: "yearsToGoal",
      label: "Time to Goal",
      type: "years",
      defaultValue: 2,
      min: 1,
      max: 20,
      step: 1,
      unit: "yrs",
    },
    {
      key: "expectedReturnRate",
      label: "Expected Return (Savings/Debt Instrument)",
      type: "percent",
      defaultValue: 6,
      min: 1,
      max: 15,
      step: 0.5,
      unit: "%",
      helpText: "For short-term goals, a safer instrument (FD, debt fund, RD) is usually more appropriate than equity.",
    },
    {
      key: "existingSavings",
      label: "Existing Savings Toward This Goal",
      type: "currency",
      defaultValue: 0,
      min: 0,
      max: 10000000,
      step: 5000,
      unit: "₹",
    },
  ],
  outputs: [
    { key: "inflatedTarget", label: "Goal Amount", unit: "₹" },
    { key: "requiredMonthlySip", label: "Required Monthly Savings", unit: "₹", highlight: true },
    { key: "remainingNeeded", label: "Remaining Corpus Needed", unit: "₹" },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "target",
  faqs: [
    {
      question: "Why use a lower return rate than the Goal Planning calculator's default?",
      answer:
        "For short-term goals (under 3-5 years), equity markets are too volatile to rely on — a market downturn right before you need the money could leave you short. Safer instruments like FDs, RDs, or short-duration debt funds with lower but more predictable returns are generally more appropriate.",
    },
  ],
  category: { name: "Personal Finance", slug: "personal-finance" },
};

export const realEstateCapitalGainsConfig: CalculatorConfig = {
  slug: "real-estate-capital-gains-calculator",
  name: "Real Estate Capital Gains Calculator",
  shortDescription:
    "Calculate capital gains tax on property sale, comparing the 12.5% flat rate against 20% with indexation.",
  longDescription:
    "Property held over 24 months qualifies as a long-term capital asset. If purchased before 23 July 2024, you can choose between a flat 12.5% rate (no indexation) or 20% with indexation — whichever gives you lower tax. Properties purchased on or after that date only get the 12.5% flat rate.",
  formulaKey: "realEstateCapitalGains",
  inputs: [
    {
      key: "purchasePrice",
      label: "Purchase Price",
      type: "currency",
      defaultValue: 4000000,
      min: 10000,
      max: 1000000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "salePrice",
      label: "Sale Price",
      type: "currency",
      defaultValue: 12000000,
      min: 10000,
      max: 1000000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "holdingPeriodMonths",
      label: "Holding Period",
      type: "number",
      defaultValue: 120,
      min: 1,
      max: 600,
      step: 1,
      unit: "months",
      helpText: "More than 24 months qualifies for long-term treatment.",
    },
    {
      key: "purchasedBeforeCutoff",
      label: "Purchased Before 23 July 2024?",
      type: "select",
      defaultValue: 1,
      options: [
        { label: "Yes — eligible for indexation choice", value: 1 },
        { label: "No — only 12.5% flat rate applies", value: 0 },
      ],
    },
    {
      key: "ciiAtPurchase",
      label: "Cost Inflation Index (Year of Purchase)",
      type: "number",
      defaultValue: 167,
      min: 100,
      max: 400,
      step: 1,
      unit: "",
      helpText: "Look up the official CII for your purchase year on the Income Tax Department website.",
    },
    {
      key: "ciiAtSale",
      label: "Cost Inflation Index (Year of Sale)",
      type: "number",
      defaultValue: 363,
      min: 100,
      max: 400,
      step: 1,
      unit: "",
    },
  ],
  outputs: [
    { key: "totalGain", label: "Total Gain", unit: "₹" },
    { key: "taxAmount", label: "Tax Payable", unit: "₹", highlight: true },
    { key: "netProceedsAfterTax", label: "Net Proceeds After Tax", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "home",
  faqs: [
    {
      question: "How do I find the Cost Inflation Index for my purchase year?",
      answer:
        "The Income Tax Department publishes the CII for each financial year. Search 'Cost Inflation Index [year] Income Tax India' to find the official notified value for your specific purchase and sale years.",
    },
    {
      question: "Can I avoid this tax entirely?",
      answer:
        "Sections 54, 54EC, and 54F allow exemption if you reinvest the gains in another residential property or specified bonds within prescribed timeframes — not modeled in this calculator, but worth exploring with a tax advisor if you're planning to reinvest.",
    },
  ],
  category: { name: "Tax", slug: "tax" },
};

export const debtFundCapitalGainsConfig: CalculatorConfig = {
  slug: "debt-fund-capital-gains-calculator",
  name: "Debt Fund Capital Gains Calculator",
  shortDescription:
    "Calculate capital gains tax on debt mutual funds — rules differ completely based on whether you bought before or after April 2023.",
  longDescription:
    "Debt mutual fund units purchased on or after 1 April 2023 never qualify for long-term capital gains treatment, regardless of how long you hold them — all gains are taxed at your income slab rate. Units purchased before that date still follow the older rule: 20% with indexation if held over 36 months.",
  formulaKey: "debtFundCapitalGains",
  inputs: [
    {
      key: "purchasePrice",
      label: "Purchase Price (Investment Amount)",
      type: "currency",
      defaultValue: 1000000,
      min: 1000,
      max: 100000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "salePrice",
      label: "Sale/Redemption Value",
      type: "currency",
      defaultValue: 1400000,
      min: 1000,
      max: 100000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "holdingPeriodMonths",
      label: "Holding Period",
      type: "number",
      defaultValue: 48,
      min: 1,
      max: 600,
      step: 1,
      unit: "months",
    },
    {
      key: "purchasedAfterApril2023",
      label: "When Were Units Purchased?",
      type: "select",
      defaultValue: 1,
      options: [
        { label: "On or after 1 April 2023 (always slab rate)", value: 1 },
        { label: "Before 1 April 2023 (old LTCG rules may apply)", value: 0 },
      ],
    },
    {
      key: "slabRate",
      label: "Your Income Tax Slab Rate",
      type: "percent",
      defaultValue: 30,
      min: 0,
      max: 30,
      step: 5,
      unit: "%",
    },
    {
      key: "ciiAtPurchase",
      label: "Cost Inflation Index (Year of Purchase)",
      type: "number",
      defaultValue: 317,
      min: 100,
      max: 400,
      step: 1,
      unit: "",
      helpText: "Only relevant if purchased before April 2023 and held over 36 months.",
    },
    {
      key: "ciiAtSale",
      label: "Cost Inflation Index (Year of Sale)",
      type: "number",
      defaultValue: 363,
      min: 100,
      max: 400,
      step: 1,
      unit: "",
    },
  ],
  outputs: [
    { key: "totalGain", label: "Total Gain", unit: "₹" },
    { key: "taxAmount", label: "Tax Payable", unit: "₹", highlight: true },
    { key: "netProceedsAfterTax", label: "Net Proceeds After Tax", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "trending-down",
  faqs: [
    {
      question: "Why does the purchase date matter so much more than usual?",
      answer:
        "Because it's not just a rate change — it determines whether LTCG treatment exists for these units AT ALL. Units bought on or after 1 April 2023 are taxed at slab rate no matter how long you hold them, even 10+ years. This was a deliberate 2023 Budget change to remove debt funds' tax advantage over fixed deposits.",
    },
  ],
  category: { name: "Tax", slug: "tax" },
};

export const goldCapitalGainsConfig: CalculatorConfig = {
  slug: "gold-capital-gains-calculator",
  name: "Gold Capital Gains Calculator",
  shortDescription:
    "Calculate capital gains tax on physical gold, coins, and jewelry — same structure as real estate.",
  longDescription:
    "Physical gold, gold coins, and jewelry held over 24 months qualify as long-term assets, following the same 12.5%-flat vs 20%-with-indexation choice as real estate for pre-23-July-2024 purchases. This does NOT apply to Sovereign Gold Bonds or Gold ETFs/Mutual Funds, which follow different rules.",
  formulaKey: "goldCapitalGains",
  inputs: [
    {
      key: "purchasePrice",
      label: "Purchase Price",
      type: "currency",
      defaultValue: 500000,
      min: 1000,
      max: 100000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "salePrice",
      label: "Sale Price",
      type: "currency",
      defaultValue: 1200000,
      min: 1000,
      max: 100000000,
      step: 10000,
      unit: "₹",
    },
    {
      key: "holdingPeriodMonths",
      label: "Holding Period",
      type: "number",
      defaultValue: 60,
      min: 1,
      max: 600,
      step: 1,
      unit: "months",
    },
    {
      key: "purchasedBeforeCutoff",
      label: "Purchased Before 23 July 2024?",
      type: "select",
      defaultValue: 1,
      options: [
        { label: "Yes — eligible for indexation choice", value: 1 },
        { label: "No — only 12.5% flat rate applies", value: 0 },
      ],
    },
    {
      key: "ciiAtPurchase",
      label: "Cost Inflation Index (Year of Purchase)",
      type: "number",
      defaultValue: 280,
      min: 100,
      max: 400,
      step: 1,
      unit: "",
    },
    {
      key: "ciiAtSale",
      label: "Cost Inflation Index (Year of Sale)",
      type: "number",
      defaultValue: 363,
      min: 100,
      max: 400,
      step: 1,
      unit: "",
    },
  ],
  outputs: [
    { key: "totalGain", label: "Total Gain", unit: "₹" },
    { key: "taxAmount", label: "Tax Payable", unit: "₹", highlight: true },
    { key: "netProceedsAfterTax", label: "Net Proceeds After Tax", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "coins",
  faqs: [
    {
      question: "Does this apply to Sovereign Gold Bonds?",
      answer:
        "No — Sovereign Gold Bonds have separate, more favorable rules: capital gains on redemption at maturity (for the original subscriber) are tax-exempt entirely. This calculator is for physical gold, coins, and jewelry only.",
    },
    {
      question: "What about Gold ETFs or Gold Mutual Funds?",
      answer:
        "Gold ETFs and Gold Mutual Funds purchased on or after 1 April 2023 follow the debt-fund rules (slab rate, no LTCG benefit regardless of holding period) — use the Debt Fund Capital Gains Calculator for those instead.",
    },
  ],
  category: { name: "Tax", slug: "tax" },
};

export const businessValuationConfig: CalculatorConfig = {
  slug: "business-valuation-calculator",
  name: "Business Valuation Calculator",
  shortDescription:
    "Get a rough valuation range for a business using revenue, EBITDA, and profit multiples — not a substitute for a professional valuation.",
  longDescription:
    "There is no single universal formula for business valuation — real valuations require comparable transaction data, normalized earnings, and professional judgment on company-specific risk. This calculator gives a rough estimate range using three common rule-of-thumb multiple methods, intended as a starting point for further discussion, not a number to negotiate with.",
  formulaKey: "businessValuation",
  inputs: [
    {
      key: "annualRevenue",
      label: "Annual Revenue",
      type: "currency",
      defaultValue: 10000000,
      min: 0,
      max: 10000000000,
      step: 100000,
      unit: "₹",
    },
    {
      key: "ebitda",
      label: "Annual EBITDA",
      type: "currency",
      defaultValue: 2000000,
      min: 0,
      max: 10000000000,
      step: 100000,
      unit: "₹",
      helpText: "Earnings before interest, taxes, depreciation, and amortization.",
    },
    {
      key: "netProfit",
      label: "Annual Net Profit",
      type: "currency",
      defaultValue: 1500000,
      min: 0,
      max: 10000000000,
      step: 100000,
      unit: "₹",
    },
    {
      key: "revenueMultiple",
      label: "Revenue Multiple",
      type: "number",
      defaultValue: 1.5,
      min: 0.3,
      max: 10,
      step: 0.1,
      unit: "x",
      helpText: "Small businesses: 0.5x-2x. Tech/SaaS: often 5x+.",
    },
    {
      key: "ebitdaMultiple",
      label: "EBITDA Multiple",
      type: "number",
      defaultValue: 5,
      min: 1,
      max: 15,
      step: 0.5,
      unit: "x",
      helpText: "Small businesses: 3x-5x. Mid-sized: up to 6-7x.",
    },
    {
      key: "profitMultiple",
      label: "Profit Multiple",
      type: "number",
      defaultValue: 3,
      min: 1,
      max: 10,
      step: 0.5,
      unit: "x",
      helpText: "Small-to-medium enterprises: typically 2x-4x.",
    },
  ],
  outputs: [
    { key: "lowEstimate", label: "Low Estimate", unit: "₹" },
    { key: "midEstimate", label: "Mid Estimate", unit: "₹", highlight: true },
    { key: "highEstimate", label: "High Estimate", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "briefcase",
  faqs: [
    {
      question: "Why does this give a range instead of one number?",
      answer:
        "Because there genuinely isn't a single correct formula for business valuation. Real-world valuations combine multiple methods and professional judgment about company-specific risk — a generic calculator using industry-average multiples cannot account for your specific customer concentration, management depth, or growth durability.",
    },
    {
      question: "Should I use this number when negotiating a sale?",
      answer:
        "No — treat this purely as a rough starting point for a conversation, not a number to anchor a negotiation on. For an actual transaction, engage a qualified business valuation professional who can normalize your earnings and find truly comparable transactions in your specific industry and size range.",
    },
  ],
  category: { name: "Business", slug: "business" },
};

export const brokerageConfig: CalculatorConfig = {
  slug: "brokerage-calculator",
  name: "Brokerage & Trading Charges Calculator",
  shortDescription:
    "Calculate the exact cost of a stock trade — brokerage, STT, GST, SEBI charges, stamp duty, and your true breakeven price.",
  longDescription:
    "Every stock trade in India involves more than just brokerage — STT, exchange transaction charges, GST, SEBI fees, stamp duty, and DP charges all add up. This calculator breaks down every component for both delivery and intraday trades, showing your real net P&L and breakeven price.",
  formulaKey: "brokerage",
  inputs: [
    {
      key: "buyPrice",
      label: "Buy Price (per share)",
      type: "currency",
      defaultValue: 500,
      min: 1,
      max: 1000000,
      step: 1,
      unit: "₹",
    },
    {
      key: "sellPrice",
      label: "Sell Price (per share)",
      type: "currency",
      defaultValue: 520,
      min: 1,
      max: 1000000,
      step: 1,
      unit: "₹",
    },
    {
      key: "quantity",
      label: "Quantity",
      type: "number",
      defaultValue: 100,
      min: 1,
      max: 1000000,
      step: 1,
      unit: "shares",
    },
    {
      key: "tradeType",
      label: "Trade Type",
      type: "select",
      defaultValue: 0,
      options: [
        { label: "Delivery (held overnight+)", value: 0 },
        { label: "Intraday (same-day square-off)", value: 1 },
      ],
    },
    {
      key: "brokerageType",
      label: "Broker Type",
      type: "select",
      defaultValue: 0,
      options: [
        { label: "Discount Broker (₹0 delivery brokerage)", value: 0 },
        { label: "Traditional Broker (0.3% both sides)", value: 1 },
      ],
    },
  ],
  outputs: [
    { key: "totalCharges", label: "Total Charges", unit: "₹" },
    { key: "netPnl", label: "Net P&L (after charges)", unit: "₹", highlight: true },
    { key: "breakEvenSellPrice", label: "Breakeven Sell Price", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "percent",
  faqs: [
    {
      question: "Why is my actual profit lower than buy/sell price difference suggests?",
      answer:
        "Even with a 'zero brokerage' discount broker, you still pay STT, exchange transaction charges, GST, SEBI fees, stamp duty, and DP charges on delivery trades — together these can be 0.1-0.2% of your turnover, which adds up especially on smaller trades.",
    },
    {
      question: "Why does stamp duty vary?",
      answer:
        "Stamp duty is levied by STATE governments, not the central government, so it can vary by state. This calculator uses commonly-cited reference rates (0.015% delivery, 0.003% intraday) — check your specific state's rate for precision.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};

export const dividendYieldConfig: CalculatorConfig = {
  slug: "dividend-yield-calculator",
  name: "Dividend Yield Calculator",
  shortDescription:
    "Calculate a stock's dividend yield and your expected annual dividend income, including tax.",
  longDescription:
    "Dividend yield shows how much income a stock generates relative to its price. Since DDT was abolished in 2020, dividends are fully taxable in your hands at your income tax slab rate — this calculator shows both your gross and after-tax dividend income.",
  formulaKey: "dividendYield",
  inputs: [
    {
      key: "sharePrice",
      label: "Current Share Price",
      type: "currency",
      defaultValue: 500,
      min: 1,
      max: 1000000,
      step: 1,
      unit: "₹",
    },
    {
      key: "annualDividendPerShare",
      label: "Annual Dividend per Share",
      type: "currency",
      defaultValue: 10,
      min: 0,
      max: 10000,
      step: 0.5,
      unit: "₹",
    },
    {
      key: "numberOfShares",
      label: "Number of Shares Held",
      type: "number",
      defaultValue: 100,
      min: 1,
      max: 1000000,
      step: 1,
      unit: "shares",
    },
    {
      key: "slabRate",
      label: "Your Income Tax Slab Rate",
      type: "percent",
      defaultValue: 30,
      min: 0,
      max: 30,
      step: 5,
      unit: "%",
    },
  ],
  outputs: [
    { key: "dividendYieldPercent", label: "Dividend Yield", unit: "%", highlight: true },
    { key: "totalAnnualDividend", label: "Total Annual Dividend (gross)", unit: "₹" },
    { key: "netDividendIncome", label: "Net Dividend Income (after tax)", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "percent",
  faqs: [
    {
      question: "Is there any tax-free threshold for dividend income?",
      answer:
        "No — unlike savings account interest (Section 80TTA) or some other income types, dividend income has no exemption threshold. It's fully taxable at your slab rate from the first rupee, though TDS under Section 194 only kicks in once dividends from a single payer exceed ₹10,000 in a financial year.",
    },
    {
      question: "Is dividend yield the same as total returns?",
      answer:
        "No — dividend yield only captures income from dividends, not capital appreciation. A stock with a low dividend yield can still deliver strong total returns through price growth, and vice versa.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};

export const fnoMarginEstimatorConfig: CalculatorConfig = {
  slug: "fno-margin-estimator",
  name: "F&O Exposure Margin Estimator",
  shortDescription:
    "Estimate the exposure margin component for futures and short options positions — not a substitute for your broker's live SPAN margin calculator.",
  longDescription:
    "Real F&O margin (SPAN margin) is computed by NSE's proprietary risk engine using live, frequently-updated risk parameters — it cannot be reproduced with a simple formula. This calculator estimates only the exposure margin component, which uses a publicly documented flat percentage. Always check your broker's live margin calculator before placing any actual trade.",
  formulaKey: "fnoMarginEstimator",
  inputs: [
    {
      key: "spotPrice",
      label: "Spot Price (Underlying)",
      type: "currency",
      defaultValue: 22000,
      min: 1,
      max: 1000000,
      step: 1,
      unit: "₹",
    },
    {
      key: "lotSize",
      label: "Lot Size",
      type: "number",
      defaultValue: 25,
      min: 1,
      max: 10000,
      step: 1,
      unit: "units",
      helpText: "Lot sizes are revised periodically by the exchange — check the current lot size for your contract.",
    },
    {
      key: "numberOfLots",
      label: "Number of Lots",
      type: "number",
      defaultValue: 1,
      min: 1,
      max: 1000,
      step: 1,
      unit: "lots",
    },
    {
      key: "isIndex",
      label: "Contract Type",
      type: "select",
      defaultValue: 1,
      options: [
        { label: "Index (Nifty, Bank Nifty, etc.) — 2%", value: 1 },
        { label: "Individual Stock — 3.5%", value: 0 },
      ],
    },
  ],
  outputs: [
    { key: "exposureMargin", label: "Estimated Exposure Margin", unit: "₹", highlight: true },
    { key: "totalContractValue", label: "Total Contract Value", unit: "₹" },
  ],
  chartTypes: ["pie"],
  generatesYearlyTable: false,
  icon: "trending-up",
  faqs: [
    {
      question: "Why doesn't this show total margin (SPAN + Exposure)?",
      answer:
        "SPAN margin requires NSE's live, proprietary risk-scenario calculations that change throughout the trading day based on volatility and other market factors — it genuinely cannot be calculated with a fixed formula. This tool only estimates the exposure margin piece, which is a simple, publicly documented percentage. For total margin, always check your broker's live margin calculator before trading.",
    },
    {
      question: "Is buying options included in this estimate?",
      answer:
        "No — buying options (going long) requires paying the full premium upfront, not margin. Margin requirements apply to futures positions and SHORT (writing) options positions.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};

export const expenseRatioImpactConfig: CalculatorConfig = {
  slug: "expense-ratio-impact-calculator",
  name: "Expense Ratio Impact Calculator",
  shortDescription:
    "See exactly how much a mutual fund's expense ratio costs you in absolute rupees over the long term.",
  longDescription:
    "Expense ratio is charged every year regardless of how the fund performs, so its cost compounds the same way investment returns do. This calculator isolates the rupee impact of the expense ratio alone, showing the gap between your gross and net returns over time.",
  formulaKey: "expenseRatioImpact",
  inputs: [
    {
      key: "monthlyInvestment",
      label: "Monthly SIP Amount",
      type: "currency",
      defaultValue: 10000,
      min: 500,
      max: 1000000,
      step: 500,
      unit: "₹",
    },
    {
      key: "grossAnnualReturn",
      label: "Gross Annual Return (before expenses)",
      type: "percent",
      defaultValue: 12,
      min: 1,
      max: 25,
      step: 0.5,
      unit: "%",
    },
    {
      key: "expenseRatio",
      label: "Expense Ratio",
      type: "percent",
      defaultValue: 1,
      min: 0,
      max: 3,
      step: 0.05,
      unit: "%",
      helpText: "Direct plans typically have lower expense ratios than regular plans (which include distributor commission).",
    },
    {
      key: "investmentPeriodYears",
      label: "Investment Period",
      type: "years",
      defaultValue: 20,
      min: 1,
      max: 40,
      step: 1,
      unit: "yrs",
    },
  ],
  outputs: [
    { key: "grossValue", label: "Value at Gross Return", unit: "₹" },
    { key: "netValue", label: "Value at Net Return", unit: "₹" },
    { key: "costOfExpenseRatio", label: "Cost of Expense Ratio", unit: "₹", highlight: true },
  ],
  chartTypes: ["line", "pie", "bar"],
  generatesYearlyTable: true,
  icon: "trending-down",
  faqs: [
    {
      question: "Should I always choose the fund with the lowest expense ratio?",
      answer:
        "Not necessarily — expense ratio is one factor among several (fund manager track record, portfolio composition, consistency of returns). But all else being equal, lower expenses mean more of the fund's gross returns reach you, especially over long holding periods.",
    },
    {
      question: "What's the difference between direct and regular mutual fund plans?",
      answer:
        "Direct plans skip distributor/advisor commission, resulting in a lower expense ratio (often 0.5-1% lower) than the equivalent regular plan of the same fund — the underlying portfolio is identical, only the expense ratio differs.",
    },
  ],
  category: { name: "Investment", slug: "investment" },
};

export const premiumPaymentComparisonConfig: CalculatorConfig = {
  slug: "premium-payment-comparison-calculator",
  name: "Insurance Premium Payment Comparison",
  shortDescription:
    "Compare single-pay vs regular-pay insurance premiums using present value, not just nominal totals — using quotes you already have.",
  longDescription:
    "Insurers don't publish a public premium formula, so this calculator doesn't try to estimate your premium. Instead, enter the actual single-pay and regular-pay quotes you've received for the same coverage, and this tool compares their true cost using present-value discounting — since money paid years from now is worth less than money paid today.",
  formulaKey: "premiumPaymentComparison",
  inputs: [
    {
      key: "singlePremium",
      label: "Single Premium Quote (one-time)",
      type: "currency",
      defaultValue: 250000,
      min: 1000,
      max: 50000000,
      step: 5000,
      unit: "₹",
    },
    {
      key: "annualRegularPremium",
      label: "Regular Premium Quote (per year)",
      type: "currency",
      defaultValue: 20000,
      min: 100,
      max: 5000000,
      step: 500,
      unit: "₹",
    },
    {
      key: "premiumPayingYears",
      label: "Premium Paying Term",
      type: "years",
      defaultValue: 20,
      min: 1,
      max: 40,
      step: 1,
      unit: "yrs",
    },
    {
      key: "discountRate",
      label: "Discount Rate (your alternative investment return)",
      type: "percent",
      defaultValue: 7,
      min: 1,
      max: 15,
      step: 0.5,
      unit: "%",
      helpText: "What you could otherwise earn investing your money — typically the return on a safe-to-moderate investment.",
    },
  ],
  outputs: [
    { key: "totalNominalRegularPremiums", label: "Regular Pay Total (nominal)", unit: "₹" },
    { key: "presentValueOfRegularPremiums", label: "Regular Pay (present value)", unit: "₹", highlight: true },
    { key: "singlePremium", label: "Single Pay Quote", unit: "₹" },
  ],
  chartTypes: ["line", "pie"],
  generatesYearlyTable: true,
  icon: "shield",
  faqs: [
    {
      question: "Why does this matter if single pay is already cheaper in total rupees?",
      answer:
        "Because comparing nominal totals ignores that regular-pay money is spread across decades — a rupee paid in year 20 costs you less in real terms than a rupee paid today, since you could have invested that rupee elsewhere in the meantime. Present-value comparison accounts for this properly.",
    },
    {
      question: "Does this calculator tell me which option to choose?",
      answer:
        "It tells you which option is mathematically cheaper after accounting for the time value of money — but your actual decision should also weigh liquidity (can you afford to lock up a lump sum?), payment discipline, and whether you'd actually invest the difference if you chose regular pay instead.",
    },
  ],
  category: { name: "Insurance", slug: "insurance" },
};
const rawCalculatorConfigs: Record<string, CalculatorConfig> = {
  [sipConfig.slug]: sipConfig,
  [emiConfig.slug]: emiConfig,
  [fdConfig.slug]: fdConfig,
  [incomeTaxNewConfig.slug]: incomeTaxNewConfig,
  [ppfConfig.slug]: ppfConfig,
  [rdConfig.slug]: rdConfig,
  [hraConfig.slug]: hraConfig,
  [lumpsumConfig.slug]: lumpsumConfig,
  [cagrConfig.slug]: cagrConfig,
  [stepUpSipConfig.slug]: stepUpSipConfig,
  [xirrConfig.slug]: xirrConfig,
  [homeLoanConfig.slug]: homeLoanConfig,
  [carLoanConfig.slug]: carLoanConfig,
  [personalLoanConfig.slug]: personalLoanConfig,
  [educationLoanConfig.slug]: educationLoanConfig,
  [loanEligibilityConfig.slug]: loanEligibilityConfig,
  [epfConfig.slug]: epfConfig,
  [npsConfig.slug]: npsConfig,
  [ssyConfig.slug]: ssyConfig,
  [savingsInterestConfig.slug]: savingsInterestConfig,
  [gratuityConfig.slug]: gratuityConfig,
  [tdsOnSalaryConfig.slug]: tdsOnSalaryConfig,
  [gstConfig.slug]: gstConfig,
  [capitalGainsConfig.slug]: capitalGainsConfig,
  [fireConfig.slug]: fireConfig,
  [emergencyFundConfig.slug]: emergencyFundConfig,
  [netWorthConfig.slug]: netWorthConfig,
  [budgetConfig.slug]: budgetConfig,
  [debtPayoffConfig.slug]: debtPayoffConfig,
  [futureValueConfig.slug]: futureValueConfig,
  [presentValueConfig.slug]: presentValueConfig,
  [goalPlanningConfig.slug]: goalPlanningConfig,
  [childEducationConfig.slug]: childEducationConfig,
  [wealthConfig.slug]: wealthConfig,
  [humanLifeValueConfig.slug]: humanLifeValueConfig,
  [breakEvenConfig.slug]: breakEvenConfig,
  [roiConfig.slug]: roiConfig,
  [profitMarginConfig.slug]: profitMarginConfig,
  [termInsuranceCoverageConfig.slug]: termInsuranceCoverageConfig,
  [healthInsuranceCoverageConfig.slug]: healthInsuranceCoverageConfig,
  [swpConfig.slug]: swpConfig,
  [goldLoanConfig.slug]: goldLoanConfig,
  [businessLoanConfig.slug]: businessLoanConfig,
  [prepaymentConfig.slug]: prepaymentConfig,
  [advanceTaxConfig.slug]: advanceTaxConfig,
  [mutualFundComparisonConfig.slug]: mutualFundComparisonConfig,
  [savingsGoalConfig.slug]: savingsGoalConfig,
  [realEstateCapitalGainsConfig.slug]: realEstateCapitalGainsConfig,
  [debtFundCapitalGainsConfig.slug]: debtFundCapitalGainsConfig,
  [goldCapitalGainsConfig.slug]: goldCapitalGainsConfig,
  [businessValuationConfig.slug]: businessValuationConfig,
  [brokerageConfig.slug]: brokerageConfig,
  [dividendYieldConfig.slug]: dividendYieldConfig,
  [fnoMarginEstimatorConfig.slug]: fnoMarginEstimatorConfig,
  [expenseRatioImpactConfig.slug]: expenseRatioImpactConfig,
  [premiumPaymentComparisonConfig.slug]: premiumPaymentComparisonConfig,
};

/**
 * Merges each raw config with its formulaExplanation/exampleCalculation text from
 * formulaText.ts, keyed by slug. Done here (once, at module load) rather than inline in
 * all 56 config objects above, so the formula text lives in one focused file instead of
 * being scattered across a ~4,300-line config file. Configs without a formulaText entry
 * yet (there shouldn't be any — see the slug-parity check this was verified against)
 * simply keep formulaExplanation/exampleCalculation undefined, which both the PDF engine
 * and the calculator page already handle gracefully with their own fallbacks.
 */
export const sampleCalculatorConfigs: Record<string, CalculatorConfig> = Object.fromEntries(
  Object.entries(rawCalculatorConfigs).map(([slug, config]) => [
    slug,
    {
      ...config,
      formulaExplanation: FORMULA_TEXT[slug]?.explanation,
      exampleCalculation: FORMULA_TEXT[slug]?.example,
    },
  ])
);
