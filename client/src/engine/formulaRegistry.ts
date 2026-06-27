import type { FormulaFn } from "../types/calculator";
import { sipFormula } from "./formulas/sip";
import { emiFormula } from "./formulas/emi";
import { fdFormula } from "./formulas/fd";
import { incomeTaxNewRegimeFormula } from "./formulas/incomeTaxNew";
import { ppfFormula } from "./formulas/ppf";
import { rdFormula } from "./formulas/rd";
import { hraFormula } from "./formulas/hra";
import { lumpsumFormula } from "./formulas/lumpsum";
import { cagrFormula } from "./formulas/cagr";
import { xirrFormula } from "./formulas/xirr";
import { stepUpSipFormula } from "./formulas/stepUpSip";
import { loanEligibilityFormula } from "./formulas/loanEligibility";
import { epfFormula } from "./formulas/epf";
import { npsFormula } from "./formulas/nps";
import { ssyFormula } from "./formulas/ssy";
import { savingsInterestFormula } from "./formulas/savingsInterest";
import { gratuityFormula } from "./formulas/gratuity";
import { tdsOnSalaryFormula } from "./formulas/tdsOnSalary";
import { gstFormula } from "./formulas/gst";
import { capitalGainsFormula } from "./formulas/capitalGains";
import { fireFormula } from "./formulas/fire";
import { emergencyFundFormula } from "./formulas/emergencyFund";
import { netWorthFormula } from "./formulas/netWorth";
import { budgetFormula } from "./formulas/budget";
import { debtPayoffFormula } from "./formulas/debtPayoff";
import { futureValueFormula } from "./formulas/futureValue";
import { presentValueFormula } from "./formulas/presentValue";
import { goalPlanningFormula } from "./formulas/goalPlanning";
import { wealthFormula } from "./formulas/wealth";
import { humanLifeValueFormula } from "./formulas/humanLifeValue";
import { breakEvenFormula } from "./formulas/breakEven";
import { roiFormula } from "./formulas/roi";
import { profitMarginFormula } from "./formulas/profitMargin";
import { termInsuranceCoverageFormula } from "./formulas/termInsuranceCoverage";
import { healthInsuranceCoverageFormula } from "./formulas/healthInsuranceCoverage";
import { swpFormula } from "./formulas/swp";
import { goldLoanFormula } from "./formulas/goldLoan";
import { prepaymentFormula } from "./formulas/prepayment";
import { advanceTaxFormula } from "./formulas/advanceTax";
import { mutualFundComparisonFormula } from "./formulas/mutualFundComparison";
import { realEstateCapitalGainsFormula } from "./formulas/realEstateCapitalGains";
import { debtFundCapitalGainsFormula } from "./formulas/debtFundCapitalGains";
import { goldCapitalGainsFormula } from "./formulas/goldCapitalGains";
import { businessValuationFormula } from "./formulas/businessValuation";
import { brokerageFormula } from "./formulas/brokerage";
import { dividendYieldFormula } from "./formulas/dividendYield";
import { fnoMarginEstimatorFormula } from "./formulas/fnoMarginEstimator";
import { expenseRatioImpactFormula } from "./formulas/expenseRatioImpact";
import { premiumPaymentComparisonFormula } from "./formulas/premiumPaymentComparison";

/**
 * Central registry of all formula functions, keyed by the `formulaKey` string
 * stored in each Calculator document in MongoDB. This is the seam between
 * "calculator config" (data, editable via admin panel) and "calculator math"
 * (code, reviewed and tested like any other logic).
 *
 * To add a new calculator:
 *   1. Write a formula file in src/engine/formulas/
 *   2. Register it here with a unique key
 *   3. Create a Calculator document in the DB with matching formulaKey
 * No other frontend code needs to change — CalculatorRunner reads this registry generically.
 */
export const formulaRegistry: Record<string, FormulaFn> = {
  sip: sipFormula,
  emi: emiFormula,
  fd: fdFormula,
  incomeTaxNew: incomeTaxNewRegimeFormula,
  ppf: ppfFormula,
  rd: rdFormula,
  hra: hraFormula,
  lumpsum: lumpsumFormula,
  cagr: cagrFormula,
  xirr: xirrFormula,
  stepUpSip: stepUpSipFormula,
  loanEligibility: loanEligibilityFormula,
  epf: epfFormula,
  nps: npsFormula,
  ssy: ssyFormula,
  savingsInterest: savingsInterestFormula,
  gratuity: gratuityFormula,
  tdsOnSalary: tdsOnSalaryFormula,
  gst: gstFormula,
  capitalGains: capitalGainsFormula,
  fire: fireFormula,
  emergencyFund: emergencyFundFormula,
  netWorth: netWorthFormula,
  budget: budgetFormula,
  debtPayoff: debtPayoffFormula,
  futureValue: futureValueFormula,
  presentValue: presentValueFormula,
  goalPlanning: goalPlanningFormula,
  wealth: wealthFormula,
  humanLifeValue: humanLifeValueFormula,
  breakEven: breakEvenFormula,
  roi: roiFormula,
  profitMargin: profitMarginFormula,
  termInsuranceCoverage: termInsuranceCoverageFormula,
  healthInsuranceCoverage: healthInsuranceCoverageFormula,
  swp: swpFormula,
  goldLoan: goldLoanFormula,
  prepayment: prepaymentFormula,
  advanceTax: advanceTaxFormula,
  mutualFundComparison: mutualFundComparisonFormula,
  realEstateCapitalGains: realEstateCapitalGainsFormula,
  debtFundCapitalGains: debtFundCapitalGainsFormula,
  goldCapitalGains: goldCapitalGainsFormula,
  businessValuation: businessValuationFormula,
  brokerage: brokerageFormula,
  dividendYield: dividendYieldFormula,
  fnoMarginEstimator: fnoMarginEstimatorFormula,
  expenseRatioImpact: expenseRatioImpactFormula,
  premiumPaymentComparison: premiumPaymentComparisonFormula,
};

export function getFormula(formulaKey: string): FormulaFn {
  const formula = formulaRegistry[formulaKey];
  if (!formula) {
    throw new Error(
      `No formula registered for formulaKey "${formulaKey}". Did you forget to register it in formulaRegistry.ts?`
    );
  }
  return formula;
}
