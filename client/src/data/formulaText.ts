/**
 * Plain-language formula explanations and worked examples for every calculator, keyed by
 * slug. This is the single source these are pulled from for both the calculator detail
 * page's "Formula Explanation" / "Example Calculation" sections AND the PDF report —
 * so the two surfaces never say different things about the same formula.
 *
 * Text here is drawn directly from each formula file's own verified doc comment
 * (engine/formulas/*.ts) rather than rewritten from memory, to stay consistent with the
 * math that's actually implemented and already checked against published references.
 */
export interface FormulaText {
  explanation: string;
  example: string;
}

export const FORMULA_TEXT: Record<string, FormulaText> = {
  "sip-calculator": {
    explanation:
      "Future Value = P × [((1 + i)^n − 1) / i] × (1 + i), where P is your monthly investment, i is the monthly rate of return (annual rate ÷ 12), and n is the total number of months. This is the standard SIP annuity-due formula — each month's contribution starts compounding immediately.",
    example:
      "Investing ₹10,000/month at an assumed 12% annual return for 10 years (120 months) grows to approximately ₹23,23,391 — of which ₹12,00,000 is your own contribution and ₹11,23,391 is investment growth.",
  },
  "emi-calculator": {
    explanation:
      "EMI = P × r × (1 + r)^n / [(1 + r)^n − 1], where P is the loan principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the tenure in months. This standard amortization formula keeps your EMI constant while the interest/principal split shifts over time.",
    example:
      "A ₹10,00,000 loan at 8.5% annual interest over 20 years (240 months) gives an EMI of approximately ₹8,678/month, with total interest of about ₹10,82,720 over the loan's life.",
  },
  "fd-calculator": {
    explanation:
      "Maturity Amount = P × (1 + r/n)^(n×t), where P is the principal, r is the annual interest rate, n is the compounding frequency per year (4 for the standard quarterly compounding most Indian banks use), and t is the tenure in years.",
    example:
      "₹1,00,000 deposited at 7% annual interest, compounded quarterly, for 5 years grows to approximately ₹1,41,478 at maturity.",
  },
  "income-tax-calculator-new-regime": {
    explanation:
      "Tax is computed using FY 2025-26 New Regime slab rates (0% up to ₹4L, then 5/10/15/20/25% across intermediate bands, rising to 30% above ₹24L) applied to income after the ₹75,000 standard deduction. A full rebate under Section 87A brings tax to zero for taxable income up to ₹12L, plus a 4% health & education cess on the remaining tax.",
    example:
      "A gross salary of ₹15,00,000 results in taxable income of ₹14,25,000 after the standard deduction, giving a total tax liability (including cess) of approximately ₹97,500 — verified against published reference calculations.",
  },
  "ppf-calculator": {
    explanation:
      "PPF compounds annually at the government-notified rate (currently 7.1%), with deposits made at the start of each year per the annuity-due convention. This is an approximation of real PPF, where interest actually accrues monthly on the lowest balance between the 5th and end of each month — disclosed directly since exact month-by-month tracking would require knowing your specific deposit dates.",
    example:
      "Depositing ₹1,50,000 at the start of each year for 15 years at 7.1% grows to approximately ₹40,68,209 at maturity, of which ₹22,50,000 is your own contribution.",
  },
  "rd-calculator": {
    explanation:
      "Each month's deposit compounds at the bank's quarterly-compounded rate for the remaining time until maturity — RD interest is calculated as if every monthly installment were its own mini fixed deposit, summed together. Matched against three independent published reference calculations.",
    example:
      "Depositing ₹5,000/month for 12 months at 7% annual interest (compounded quarterly) matures to approximately ₹62,535, of which ₹60,000 is your own contribution.",
  },
  "hra-exemption-calculator": {
    explanation:
      "HRA exemption is the LEAST of: (1) actual HRA received, (2) rent paid minus 10% of basic salary, or (3) 50% of basic salary (metro cities) or 40% (non-metro cities). Whichever of these three is smallest becomes your tax-exempt HRA amount.",
    example:
      "On a basic salary of ₹50,000/month, HRA received of ₹25,000/month, and rent paid of ₹20,000/month in a metro city: exemption is the least of ₹3,00,000 (actual HRA), ₹1,80,000 (rent − 10% of basic), and ₹3,00,000 (50% of basic) — giving an exempt amount of ₹1,80,000 per year.",
  },
  "lumpsum-calculator": {
    explanation:
      "Future Value = P × (1 + r)^t, where P is your one-time investment, r is the annual rate of return, and t is the number of years. This is the simplest compound-growth formula — your entire amount starts compounding from day one with no further contributions.",
    example:
      "₹1,00,000 invested as a lumpsum at 12% annual return for 10 years grows to approximately ₹3,10,585 — roughly 3.1 times your original investment.",
  },
  "cagr-calculator": {
    explanation:
      "CAGR = (Final Value / Initial Value)^(1/years) − 1. Unlike most calculators on this site, this solves for the RATE given a known start and end value, rather than solving for a future value given an assumed rate — it's the reverse direction.",
    example:
      "An investment that grew from ₹10,000 to ₹15,000 over 3 years has a CAGR of approximately 14.47% — verified to match exactly across four independent reference sources.",
  },
  "step-up-sip-calculator": {
    explanation:
      "A SIP where the monthly contribution increases periodically — either by a percentage (e.g. 10% more every year) or a fixed rupee amount (e.g. ₹1,000 more every year). There's no closed-form formula for this, so it's simulated month-by-month: each month compounds the existing balance plus that month's contribution, with the contribution itself stepping up every 12 months.",
    example:
      "Starting at ₹10,000/month, increasing by 10% every year, at 12% annual return for 15 years grows to approximately ₹86,83,849 — matched exactly against an independently published worked example.",
  },
  "xirr-calculator": {
    explanation:
      "XIRR solves for the annualized rate r such that the sum of all cash flows, each discounted by (1+r) raised to the power of (days since the first cash flow ÷ 365), equals zero. There's no algebraic solution — this uses Newton-Raphson iteration, the same method Excel's XIRR() function uses, to numerically converge on the rate.",
    example:
      "An investment of ₹1,00,000 today that grows to ₹1,10,000 after exactly 1 year has an XIRR of exactly 10% — confirmed by checking that this rate drives the underlying equation to zero.",
  },
  "home-loan-calculator": {
    explanation:
      "Uses the same EMI formula as every loan calculator on this site: EMI = P × r × (1 + r)^n / [(1 + r)^n − 1]. Home loans typically offer the lowest rates among unsecured/secured retail loans since the property itself serves as collateral.",
    example:
      "A ₹50,00,000 home loan at 8.5% annual interest over 20 years gives an EMI of approximately ₹43,391/month, with total interest of about ₹54,13,840 over the full tenure.",
  },
  "car-loan-calculator": {
    explanation:
      "Uses the standard EMI formula: EMI = P × r × (1 + r)^n / [(1 + r)^n − 1]. Car loans typically carry shorter maximum tenures (5-8 years) and slightly higher rates than home loans, since vehicles depreciate faster than property.",
    example:
      "A ₹7,00,000 car loan at 9% annual interest over 5 years gives an EMI of approximately ₹14,540/month, with total interest of about ₹1,72,400 over the loan term.",
  },
  "personal-loan-calculator": {
    explanation:
      "Uses the standard EMI formula: EMI = P × r × (1 + r)^n / [(1 + r)^n − 1]. Personal loans are unsecured, so rates run higher than home or car loans to compensate the lender for the added risk of no collateral.",
    example:
      "A ₹3,00,000 personal loan at 12% annual interest over 3 years gives an EMI of approximately ₹9,964/month, with total interest of about ₹58,704 over the loan term.",
  },
  "education-loan-calculator": {
    explanation:
      "Uses the standard EMI formula, applied to the repayment period after your moratorium (study period plus grace period) ends. Most education loans don't require payments while you're studying, though interest typically still accrues during that time.",
    example:
      "A ₹10,00,000 education loan at 10.5% annual interest over a 10-year repayment period gives an EMI of approximately ₹13,493/month once repayment begins.",
  },
  "loan-eligibility-calculator": {
    explanation:
      "Step 1: Max Eligible EMI = (Net Monthly Income × FOIR%) − Existing EMIs, where FOIR (Fixed Obligation to Income Ratio) is the share of income banks allow toward all loan payments combined (typically 40-60%). Step 2: that eligible EMI is converted to a maximum loan amount using the inverse of the standard EMI formula.",
    example:
      "On a net monthly income of ₹75,000, existing EMIs of ₹10,000, and a 50% FOIR, your eligible EMI is ₹27,500/month — which translates to a maximum loan amount depending on the interest rate and tenure you select.",
  },
  "epf-calculator": {
    explanation:
      "Employee contributes 12% of basic salary + DA monthly; of the employer's matching 12%, only 3.67% goes into your EPF account (the remaining 8.33% funds the separate EPS pension scheme). Interest (8.25% for FY 2025-26) compounds monthly on the running balance.",
    example:
      "On a basic salary of ₹30,000/month with 5% annual increments, contributing from age 28 to 60 at 8.25% interest, your EPF corpus at retirement is estimated in the crores — verified contribution-rate math against two independent published examples.",
  },
  "nps-calculator": {
    explanation:
      "Uses the same SIP annuity-due formula for the accumulation phase. At retirement, the corpus splits per PFRDA rules: up to 60% can be withdrawn tax-free as a lump sum, while at least 40% must purchase an annuity for a monthly pension (which is taxable).",
    example:
      "₹5,000/month invested from age 30 to 60 at an assumed 10% return builds a total corpus, of which 60% (₹within the lump-sum limit) can be withdrawn tax-free, with the remaining 40% converted to an annuity-based monthly pension.",
  },
  "sukanya-samriddhi-yojana-calculator": {
    explanation:
      "Deposits compound annually (currently at 8.2%) for the first 15 years; after that, no further deposits are allowed but the balance continues compounding until the account matures 21 years after opening.",
    example:
      "Depositing ₹1,00,000/year for 15 years at 8.2% interest, then letting the balance grow untouched for 6 more years, matures to approximately ₹47,88,079 — matched exactly against a published worked example.",
  },
  "savings-interest-calculator": {
    explanation:
      "Uses quarterly compounding on a constant average balance — a simplification of how banks actually calculate interest daily on your real closing balance each day. The first ₹10,000 of interest (₹50,000 for senior citizens) is tax-exempt under Section 80TTA/80TTB.",
    example:
      "An average balance of ₹1,00,000 at 3.5% annual interest for 1 year earns approximately ₹3,553 in interest, all of which falls within the ₹10,000 80TTA exemption and is therefore fully tax-free.",
  },
  "gratuity-calculator": {
    explanation:
      "Gratuity = (Last Drawn Basic + DA) × 15 × Years of Service / 26 for employers covered under the Payment of Gratuity Act (divisor is 30 for uncovered employers). Up to ₹20 lakh of gratuity is tax-exempt under Section 10(10); government employees receive their full gratuity tax-free.",
    example:
      "A last drawn salary of ₹50,000/month after 10 years of service gives a gratuity of approximately ₹2,88,462 — fully tax-exempt since it falls well under the ₹20 lakh limit.",
  },
  "tds-calculator": {
    explanation:
      "TDS on salary isn't a separate tax — it's your estimated annual income tax (using the same New Regime slab logic as the Income Tax Calculator) divided across the remaining months of the financial year and deducted monthly by your employer under Section 192.",
    example:
      "An estimated annual gross salary of ₹15,00,000 gives an annual tax liability of approximately ₹97,500, which works out to roughly ₹8,125/month in TDS if deducted evenly across all 12 months.",
  },
  "gst-calculator": {
    explanation:
      "Add GST: GST Amount = Taxable Value × GST Rate. Remove GST (reverse calculation): Taxable Value = Gross Amount ÷ (1 + Rate). Reflects the GST 2.0 rate structure effective 22 September 2025 — primarily 0%, 5%, and 18%, with a 40% slab for luxury/sin goods.",
    example:
      "A taxable value of ₹10,000 at 18% GST gives a total payable amount of ₹11,800 — split as CGST ₹900 + SGST ₹900 for an intra-state sale.",
  },
  "capital-gains-calculator": {
    explanation:
      "For listed equity shares and equity mutual funds: gains from holdings over 12 months (LTCG) are taxed at 12.5% on amounts exceeding ₹1.25 lakh per financial year. Gains from holdings of 12 months or less (STCG) are taxed at a flat 20% with no exemption.",
    example:
      "Buying for ₹1,00,000 and selling for ₹3,00,000 after 18 months gives a gain of ₹2,00,000, of which ₹1,25,000 is tax-exempt and ₹75,000 is taxed at 12.5%, giving a tax of ₹9,375.",
  },
  "fire-calculator": {
    explanation:
      "FIRE Number = (Current Annual Expenses inflated to your target year) × Multiplier (25x is standard, based on a 4% safe withdrawal rate). The required monthly SIP is then solved using the inverse of the standard SIP future-value formula.",
    example:
      "Monthly expenses of ₹50,000 today, inflated at 6% over 25 years to retirement, then multiplied by 25x, gives a FIRE number in the crores — verified by confirming the inflation math matches a published example exactly.",
  },
  "emergency-fund-calculator": {
    explanation:
      "Target Amount = Monthly Essential Expenses × Coverage Months, where coverage months follows standard guidance (6 months for salaried employees, 9 for self-employed, 12 for freelancers). Months-to-build is then simulated using the same compounding logic already verified in the FD/RD calculators.",
    example:
      "Monthly essential expenses of ₹40,000 with a 6-month coverage target gives an emergency fund goal of ₹2,40,000.",
  },
  "net-worth-calculator": {
    explanation:
      "Net Worth = Total Assets − Total Liabilities. This is pure arithmetic — a snapshot of your overall financial position at a single point in time, with no compounding or projection involved.",
    example:
      "₹8,00,000 in total assets (cash, investments, real estate, other) minus ₹2,00,000 in total liabilities (loans, credit card dues) gives a net worth of ₹6,00,000.",
  },
  "budget-calculator": {
    explanation:
      "Based on the 50/30/20 rule: 50% of take-home income for needs, 30% for wants, 20% for savings and debt repayment. This calculator compares your actual spending across these three categories against the recommended split.",
    example:
      "On a monthly income of ₹80,000, the recommended split is ₹40,000 for needs, ₹24,000 for wants, and ₹16,000 for savings — compared directly against what you actually spend in each category.",
  },
  "debt-payoff-calculator": {
    explanation:
      "Snowball method targets the smallest balance first; Avalanche method targets the highest interest rate first. Both make minimum payments on every debt and direct all extra payment budget toward one target debt at a time, simulated month-by-month with standard interest accrual.",
    example:
      "Across multiple debts with an extra ₹5,000/month payment budget, the Avalanche method (highest rate first) will always produce equal or lower total interest than Snowball (smallest balance first) for the same extra payment — verified as a mathematical property that must hold.",
  },
  "future-value-calculator": {
    explanation:
      "Future Value = PV × (1 + r/n)^(n×t), with an optional periodic contribution added as an annuity. This is the foundational time-value-of-money calculation behind most other investment calculators on this site.",
    example:
      "₹5,000 invested today at 7% annual interest, compounded annually, grows to approximately ₹6,553.98 after 4 years — matched exactly against a published textbook example.",
  },
  "present-value-calculator": {
    explanation:
      "Present Value = Future Value ÷ (1 + r/n)^(n×t). This answers the reverse question from Future Value: how much do you need to invest today, at a given rate, to reach a specific future amount?",
    example:
      "To have ₹10,00,000 in 1 year at an 8% discount rate, you would need to invest approximately ₹9,25,926 today — matched exactly against a published textbook example.",
  },
  "goal-planning-calculator": {
    explanation:
      "Works backward from a target amount using the inverse of the standard SIP future-value formula, accounting for any existing savings already earmarked for the goal and an optional inflation adjustment on the goal itself.",
    example:
      "A goal of ₹20,00,000 in 5 years at an assumed 12% return, with ₹2,00,000 already saved, requires a monthly SIP of approximately ₹28,174 — verified by confirming the solver's output reproduces the exact target when run forward through the standard SIP formula.",
  },
  "child-education-calculator": {
    explanation:
      "Uses the same goal-planning formula as the general Goal Planning Calculator, with a higher default inflation assumption (8%) to reflect education costs in India historically rising faster than general inflation.",
    example:
      "An estimated education cost of ₹25,00,000 today, 15 years away, inflated at 8% education inflation, gives a much larger inflation-adjusted target — with the required monthly SIP calculated against that inflated figure.",
  },
  "wealth-calculator": {
    explanation:
      "Combines a one-time lumpsum investment (compounding via P × (1+r)^t) with an ongoing monthly SIP (via the standard annuity-due SIP formula), added together — for investors who do both simultaneously.",
    example:
      "A ₹2,00,000 lumpsum plus a ₹10,000/month SIP at 12% annual return for 15 years builds combined total wealth — verified by confirming the combined result exactly equals the sum of each component calculated independently.",
  },
  "human-life-value-calculator": {
    explanation:
      "Simple method: HLV = (Annual Income − Personal Expenses) × Remaining Working Years. Present-value method (more accurate): the same net income is discounted as an annuity over your remaining working years, accounting for the time value of money.",
    example:
      "At age 35 with ₹10,00,000 annual income and retirement at 60, the simple method gives a Human Life Value of exactly ₹2.5 crore — matched against a published insurer example.",
  },
  "break-even-calculator": {
    explanation:
      "Break-Even Units = Fixed Costs ÷ (Selling Price per Unit − Variable Cost per Unit). The denominator is your contribution margin — how much each unit sold contributes toward covering fixed costs before you start making a profit.",
    example:
      "With ₹50,000 in monthly fixed costs, a ₹500 selling price, and ₹200 variable cost per unit, you need to sell 167 units per month to break even — matched against multiple independent worked examples.",
  },
  "roi-calculator": {
    explanation:
      "ROI (%) = (Net Profit ÷ Investment Cost) × 100. Annualized ROI = (Final Value ÷ Cost)^(1/years) − 1, using the same annualization formula already verified in the CAGR calculator, to make returns over different time periods comparable.",
    example:
      "A ₹5,00,000 investment that grows to ₹7,50,000 over 3 years gives a total ROI of 50%, or an annualized ROI of approximately 14.47% per year.",
  },
  "profit-margin-calculator": {
    explanation:
      "Gross Margin = (Revenue − COGS) ÷ Revenue. Operating Margin = (Revenue − COGS − Operating Expenses) ÷ Revenue. Net Margin = Net Profit ÷ Revenue. Standard accounting ratios, pure arithmetic with no compounding involved.",
    example:
      "On revenue of ₹10,00,000 with ₹4,00,000 COGS, ₹2,50,000 operating expenses, and ₹50,000 in taxes/interest, gross margin is 60%, operating margin is 35%, and net margin is 30%.",
  },
  "term-insurance-calculator": {
    explanation:
      "Recommended Cover = (Annual Income × Income Multiplier) + Outstanding Liabilities − Existing Cover. This estimates how much COVERAGE to buy using the industry-standard 10-20x income multiplier rule of thumb — it does NOT estimate your premium, since no public formula for that exists; premiums are set by each insurer's own actuarial models.",
    example:
      "On an annual income of ₹10,00,000 with a 15x multiplier and no outstanding liabilities, the recommended sum assured is ₹1,50,00,000.",
  },
  "health-insurance-calculator": {
    explanation:
      "Recommended cover is based on city-tier benchmarks (metro/tier-2/tier-3), scaled for family size, with an income-based minimum check (3x annual income) and a 50% uplift for chronic conditions. This estimates coverage NEED — it does not estimate premiums, since those vary 20-40% between insurers for identical coverage with no universal public formula.",
    example:
      "A metro-city family of 4 with ₹12,00,000 annual income and no chronic conditions gets a recommended base sum insured reflecting both the city-tier benchmark and the income-based minimum, whichever is higher.",
  },
  "swp-calculator": {
    explanation:
      "Each month: interest accrues on the opening balance, then your fixed withdrawal is deducted — the reverse of SIP's deposit-then-grow convention, matching how mutual fund SWPs actually work.",
    example:
      "₹10,00,000 invested at 8% annual return with a ₹10,000/month withdrawal: Month 1 earns ₹6,667 in interest before the withdrawal, leaving a closing balance of ₹9,96,667 — matched exactly against a published month-by-month trace.",
  },
  "gold-loan-calculator": {
    explanation:
      "Loan Amount = Gold Value × LTV%, where LTV follows RBI's tiered structure effective April 2026 (85% for loans up to ₹2.5L, 80% for ₹2.5-5L, 75% above ₹5L). The resulting loan's EMI uses the same standard EMI formula as every other loan calculator.",
    example:
      "50 grams of 22-karat gold at ₹9,500/gram (24K reference rate) is valued at approximately ₹1,74,167, qualifying for an 85% LTV tier and an eligible loan amount of roughly ₹1,48,000.",
  },
  "business-loan-calculator": {
    explanation:
      "Uses the standard EMI formula: EMI = P × r × (1 + r)^n / [(1 + r)^n − 1], with rate ranges and tenure caps appropriate for business financing.",
    example:
      "A ₹10,00,000 business loan at 14% annual interest over 5 years gives an EMI of approximately ₹23,268/month.",
  },
  "loan-prepayment-calculator": {
    explanation:
      "Simulates standard EMI amortization with an additional one-time or recurring prepayment applied directly to principal, then compares total interest and tenure against the no-prepayment baseline — your EMI stays the same, but the loan finishes earlier.",
    example:
      "On a ₹30,00,000 loan at 8.5% over 20 years, a ₹5,00,000 one-time prepayment in month 24 can save over ₹3,50,000 in total interest and shorten the loan by several years.",
  },
  "advance-tax-calculator": {
    explanation:
      "If net tax liability after TDS exceeds ₹10,000, advance tax is paid in 4 cumulative installments: 15% by 15 June, 45% cumulative by 15 September, 75% cumulative by 15 December, and 100% by 15 March.",
    example:
      "A net tax liability of ₹20,000 splits into installments of ₹3,000 (June), ₹6,000 (September), ₹6,000 (December), and ₹5,000 (March) — matched exactly against a published worked example.",
  },
  "mutual-fund-comparison-calculator": {
    explanation:
      "Runs the standard SIP annuity-due formula twice — once per fund — using each fund's net return (gross return minus expense ratio), to show how two funds' projected outcomes diverge over time.",
    example:
      "A ₹10,000/month SIP compared between a fund returning 12% with a 1% expense ratio (11% net) versus one returning 10% with a 0.5% expense ratio (9.5% net) over 10 years shows the real-world impact of both return and cost assumptions.",
  },
  "savings-goal-calculator": {
    explanation:
      "Uses the same goal-planning formula as the general Goal Planning Calculator, with lower default return-rate assumptions appropriate for short-term goals where capital safety matters more than growth.",
    example:
      "A ₹2,00,000 goal in 2 years at a conservative 6% return requires a monthly savings amount calculated by working backward from the target using the verified inverse-SIP solver.",
  },
  "real-estate-capital-gains-calculator": {
    explanation:
      "For property held over 24 months, purchased before 23 July 2024: choose between 12.5% tax with no indexation, or 20% tax with indexation (Indexed Cost = Purchase Price × CII at sale ÷ CII at purchase) — whichever gives lower tax. Properties purchased after that date only get the 12.5% flat rate.",
    example:
      "A property bought for ₹40,00,000 (CII 167) and sold for ₹1,20,00,000 (CII 363): the 12.5% flat method gives ₹10,00,000 tax, while the 20%-with-indexation method gives approximately ₹6,61,000 tax — matched exactly against a published example, with the calculator correctly selecting the lower-tax option.",
  },
  "debt-fund-capital-gains-calculator": {
    explanation:
      "Units purchased on or after 1 April 2023 are ALWAYS taxed at your income slab rate, regardless of holding period — there's no long-term benefit at all for these units. Units purchased before that date still follow the old rule: 20% with indexation if held over 36 months.",
    example:
      "Debt fund units bought in March 2023 (pre-cutoff) and held for 48 months qualify for the old 20%-with-indexation treatment, while economically identical units bought in April 2023 or later are taxed at full slab rate even after the same 48 months — verified as a key distinction this calculator correctly enforces.",
  },
  "gold-capital-gains-calculator": {
    explanation:
      "Uses the identical dual-method comparison as Real Estate Capital Gains (12.5% flat vs. 20% with indexation, based on the same 23 July 2024 purchase-date cutoff) — applies to physical gold, coins, and jewelry, not Sovereign Gold Bonds or Gold ETFs/Mutual Funds.",
    example:
      "Gold bought for ₹5,00,000 and sold for ₹12,00,000 after 5 years (purchased before the cutoff) lets you choose whichever of the two tax methods gives the lower liability.",
  },
  "business-valuation-calculator": {
    explanation:
      "There is no single universal formula for business valuation. This calculator shows a RANGE using three common rule-of-thumb methods — Revenue × Multiple, EBITDA × Multiple, and Net Profit × Multiple — rather than presenting one number as a precise, defensible valuation.",
    example:
      "A business with ₹1,00,00,000 revenue, ₹20,00,000 EBITDA, and ₹15,00,000 net profit, using typical small-business multiples, gives a valuation range spanning the low, mid, and high estimates from all three methods.",
  },
  "brokerage-calculator": {
    explanation:
      "Computes every component of an equity trade's cost: STT, exchange transaction charges, SEBI charges, stamp duty, GST on brokerage/transaction charges, and DP charges — with different STT and stamp duty rates for delivery versus intraday trades.",
    example:
      "Buying 100 shares at ₹500 and selling at ₹520 (delivery trade, zero-brokerage broker) incurs STT, transaction charges, stamp duty, GST, and DP charges totaling a small percentage of the ₹1,02,000 turnover — verified component-by-component against a published example, after correctly identifying it as an intraday rather than delivery trade.",
  },
  "dividend-yield-calculator": {
    explanation:
      "Dividend Yield (%) = (Annual Dividend per Share ÷ Current Share Price) × 100. Dividends are fully taxable at your income slab rate with no exemption threshold, since Dividend Distribution Tax was abolished in 2020.",
    example:
      "A stock priced at ₹500 paying an annual dividend of ₹10 per share has a dividend yield of 2% — on a holding of 100 shares, that's ₹1,000 in annual dividend income before tax.",
  },
  "fno-margin-estimator": {
    explanation:
      "Estimates only the EXPOSURE MARGIN component (2% of contract value for index derivatives, 3.5% for stock derivatives) — real SPAN margin requires NSE's live, proprietary risk-scenario engine and cannot be reproduced with a simple formula, so this tool deliberately doesn't claim to compute it.",
    example:
      "One lot of a Nifty future at a spot price of ₹22,000 with a lot size of 25 has a contract value of ₹5,50,000, giving an estimated exposure margin of approximately ₹11,000 (2%) — your broker's live margin calculator will show the actual total margin including SPAN.",
  },
  "expense-ratio-impact-calculator": {
    explanation:
      "Runs the standard SIP formula twice — once at the gross return, once at the net return (gross minus expense ratio) — and shows the difference as the rupee cost of the expense ratio, compounding the same way investment returns do.",
    example:
      "A ₹10,000/month SIP for 20 years at a 12% gross return costs approximately the difference between the 12% and 11% (after a 1% expense ratio) outcomes — often several lakhs of rupees over a long horizon.",
  },
  "premium-payment-comparison-calculator": {
    explanation:
      "Takes premium quotes you already have (single-pay vs. regular-pay, for the same coverage) and compares their true cost using present-value discounting — the same time-value-of-money math verified in the Present Value calculator, applied to a stream of payments instead of one future sum. This does NOT estimate what your premium should be.",
    example:
      "A single premium of ₹2,50,000 compared against ₹20,000/year for 20 years: in nominal terms regular-pay totals ₹4,00,000, but discounted at 7% its present value is significantly lower, which can change which option is actually cheaper once time value of money is accounted for.",
  },
};
