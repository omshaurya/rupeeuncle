import Papa from "papaparse";
import type { CalculationResult, CalculatorConfig, FormulaInputs } from "../types/calculator";

/**
 * Generates and triggers download of a CSV file containing:
 * 1. The user's input values
 * 2. The headline output results
 * 3. The full year-wise projection table
 *
 * This is intentionally generic — it works for ANY calculator config + result,
 * so adding a new calculator never requires touching this file.
 */
export function exportToCSV(
  config: CalculatorConfig,
  inputs: FormulaInputs,
  result: CalculationResult
): void {
  const rows: Record<string, string | number>[] = [];

  rows.push({ Section: "Calculator", Value: config.name });
  rows.push({ Section: "", Value: "" });

  rows.push({ Section: "INPUTS", Value: "" });
  config.inputs.forEach((inputDef) => {
    rows.push({
      Section: inputDef.label,
      Value: inputs[inputDef.key] ?? "",
    });
  });

  rows.push({ Section: "", Value: "" });
  rows.push({ Section: "RESULTS", Value: "" });
  config.outputs.forEach((outputDef) => {
    rows.push({
      Section: outputDef.label,
      Value: result.outputs[outputDef.key] ?? "",
    });
  });

  rows.push({ Section: "", Value: "" });

  // Year-wise table as its own CSV block appended below the summary
  const yearlyHeaders =
    result.yearlyData.length > 0 ? Object.keys(result.yearlyData[0]) : [];

  const summaryCsv = Papa.unparse(rows, { header: false });
  const yearlyCsv =
    result.yearlyData.length > 0
      ? Papa.unparse({ fields: yearlyHeaders, data: result.yearlyData })
      : "";

  const fullCsv = `${summaryCsv}\n\nYEAR-WISE PROJECTION\n${yearlyCsv}`;

  downloadFile(fullCsv, `${config.slug}-report.csv`, "text/csv;charset=utf-8;");
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
