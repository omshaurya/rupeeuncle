export type InputType =
  | "number"
  | "percent"
  | "slider"
  | "select"
  | "currency"
  | "years";

export interface SelectOption {
  label: string;
  value: number | string;
}

export interface CalculatorInputDef {
  key: string;
  label: string;
  type: InputType;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  helpText?: string;
  options?: SelectOption[];
  /**
   * Optional conditional visibility — this field only renders when the named OTHER
   * input's current value equals one of `equals`. Used for mode-dependent fields, e.g.
   * Step-Up SIP only shows "Step-Up Percent" when stepUpMode=0 and "Step-Up Amount"
   * when stepUpMode=1, rather than showing both at once. The engine still always
   * computes with whatever defaultValue a hidden field has, so formulas remain
   * deterministic even before the person has interacted with the toggle.
   */
  showIf?: { key: string; equals: (number | string)[] };
}

export interface CalculatorOutputDef {
  key: string;
  label: string;
  unit?: string;
  highlight?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CalculatorConfig {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription?: string;
  formulaKey: string;
  /**
   * Plain-language explanation of the formula/method used, shown on the calculator page
   * and in the PDF report. Falls back to a generic message if not set, so adding this to
   * every config is a progressive enhancement, not a breaking requirement.
   */
  formulaExplanation?: string;
  /** A short worked example with concrete numbers, shown on the calculator page. */
  exampleCalculation?: string;
  inputs: CalculatorInputDef[];
  outputs: CalculatorOutputDef[];
  chartTypes: ("line" | "pie" | "bar")[];
  generatesYearlyTable: boolean;
  icon?: string;
  faqs?: FaqItem[];
  category?: { name: string; slug: string };
}

/** A single row of year-wise projection data, produced by every formula function. */
export interface YearlyRow {
  year: number;
  invested: number;
  returns: number;
  balance: number;
  [extra: string]: number; // formulas may add extra named columns (e.g. "principal", "interest", "tax")
}

/** The standard shape every formula function must return, consumed by the engine. */
export interface CalculationResult {
  outputs: Record<string, number>; // key matches CalculatorOutputDef.key
  yearlyData: YearlyRow[];
  pieData: { name: string; value: number }[];
  insights?: string[]; // short auto-generated text insights shown in the PDF/report
}

export type FormulaInputs = Record<string, number>;

export type FormulaFn = (inputs: FormulaInputs) => CalculationResult;
