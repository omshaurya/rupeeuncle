import { useEffect, useMemo, useState } from "react";
import { Calculator as FormulaIcon, Lightbulb } from "lucide-react";
import type { CalculatorConfig, FormulaInputs } from "../../types/calculator";
import { getFormula } from "../../engine/formulaRegistry";
import { exportToPDF } from "../../engine/pdfEngine";
import { exportToCSV } from "../../engine/csvEngine";
import { useRecentCalculations } from "../../hooks/useRecentCalculations";
import CalculatorInputForm from "./CalculatorInputForm";
import ResultsCard from "./ResultsCard";
import ProjectionTable from "./ProjectionTable";
import CalculatorActionBar from "./CalculatorActionBar";
import ProjectionLineChart from "../charts/ProjectionLineChart";
import BreakdownPieChart from "../charts/BreakdownPieChart";
import YearlyBarChart from "../charts/YearlyBarChart";

interface Props {
  config: CalculatorConfig;
}

export default function CalculatorRunner({ config }: Props) {
  const formula = useMemo(() => getFormula(config.formulaKey), [config.formulaKey]);
  const { saveCalculation } = useRecentCalculations();

  const initialInputs: FormulaInputs = useMemo(() => {
    const defaults: FormulaInputs = {};
    config.inputs.forEach((def) => { defaults[def.key] = def.defaultValue; });
    return defaults;
  }, [config.inputs]);

  const [inputs, setInputs] = useState<FormulaInputs>(initialInputs);
  useEffect(() => { setInputs(initialInputs); }, [initialInputs]);

  const result = useMemo(() => formula(inputs), [formula, inputs]);

  useEffect(() => {
    const timeout = setTimeout(() => saveCalculation(config.slug, config.name, inputs), 800);
    return () => clearTimeout(timeout);
  }, [inputs, config.slug, config.name, saveCalculation]);

  const handleInputChange = (key: string, value: number) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const handleDownloadPdf = () => exportToPDF(config, inputs, result);
  const handleDownloadCsv = () => exportToCSV(config, inputs, result);
  const handlePrint = () => window.print();
  const handleShare = () => {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([k, v]) => params.set(k, String(v)));
    navigator.clipboard
      .writeText(`${window.location.origin}${window.location.pathname}?${params.toString()}`)
      .catch((err) => console.error("Clipboard write failed:", err));
  };

  const lineKeys = useMemo(() => {
    if (result.yearlyData.length === 0) return [];
    return Object.keys(result.yearlyData[0])
      .filter((k) => k !== "year" && typeof result.yearlyData[0][k] === "number")
      .slice(0, 3);
  }, [result.yearlyData]);

  const lineColors = ["#2c4f51", "#e2a934", "#c23b3b"];

  const hasLine = config.chartTypes.includes("line") && lineKeys.length > 0;
  const hasPie  = config.chartTypes.includes("pie") && result.pieData.length > 0;
  const hasBar  = config.chartTypes.includes("bar") && result.yearlyData.length > 0;
  const hasTable = config.generatesYearlyTable && result.yearlyData.length > 0;
  const hasInsights = result.insights && result.insights.length > 0;

  return (
    /*
     * Responsive 3-column layout:
     * mobile        → 1 column, everything stacks
     * lg (tablet)   → 2 columns: [col1+col2 nested] | col3 (Export/Formula)
     * xl (desktop)  → 3 columns: col1 | col2 | col3
     * xl:contents on the inner wrapper makes col1+col2 dissolve into the parent grid at xl
     */
    <div className="grid gap-6 lg:grid-cols-[1fr_260px] xl:grid-cols-[360px_1fr_280px]">

      {/* ── Inner wrapper: nested 2-col grid on tablet, transparent on xl ── */}
      <div className="grid gap-6 lg:grid-cols-[300px_1fr] xl:contents">

      {/* ── Column 1: Inputs + charts that show distribution/growth ── */}
      <div className="flex flex-col gap-6 print:hidden">
        {/* Enter Details */}
        <div className="card-surface p-6">
          <h2 className="mb-5 font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
            Enter Details
          </h2>
          <CalculatorInputForm
            inputDefs={config.inputs}
            values={inputs}
            onChange={handleInputChange}
          />
        </div>

        {/* Growth Over Time */}
        {hasLine && (
          <div className="card-surface p-6">
            <h3 className="mb-4 font-display text-base font-semibold text-ink-800 dark:text-ink-100">
              Growth Over Time
            </h3>
            <ProjectionLineChart
              data={result.yearlyData}
              lines={lineKeys.map((key, i) => ({
                key,
                label: key.charAt(0).toUpperCase() + key.slice(1),
                color: lineColors[i % lineColors.length],
              }))}
            />
          </div>
        )}

        {/* Breakdown */}
        {hasPie && (
          <div className="card-surface p-6">
            <h3 className="mb-4 font-display text-base font-semibold text-ink-800 dark:text-ink-100">
              Breakdown
            </h3>
            <BreakdownPieChart data={result.pieData} />
          </div>
        )}
      </div>

      {/* ── Column 2: Results + Year-wise comparison + Projection table ── */}
      <div className="flex flex-col gap-6">
        {/* Result cards (FIRE Number, Required Monthly SIP, Years to FIRE, etc.) */}
        <ResultsCard outputDefs={config.outputs} outputs={result.outputs} />

        {/* Year-wise Comparison bar chart */}
        {hasBar && (
          <div className="card-surface p-6">
            <h3 className="mb-4 font-display text-base font-semibold text-ink-800 dark:text-ink-100">
              Year-wise Comparison
            </h3>
            <YearlyBarChart
              data={result.yearlyData}
              bars={[
                { key: "invested", label: "Invested", color: "#2c4f51" },
                { key: "returns", label: "Returns", color: "#e2a934" },
              ]}
            />
          </div>
        )}

        {/* Year-wise Projection table */}
        {hasTable && (
          <div className="card-surface p-6">
            <h3 className="mb-3 font-display text-base font-semibold text-ink-800 dark:text-ink-100">
              Year-wise Projection
            </h3>
            <ProjectionTable data={result.yearlyData} />
          </div>
        )}

        {/* Insights */}
        {hasInsights && (
          <div className="card-surface p-6">
            <h3 className="mb-3 font-display text-base font-semibold text-ink-800 dark:text-ink-100">
              Insights
            </h3>
            <ul className="space-y-2 text-sm text-ink-600 dark:text-ink-300">
              {result.insights!.map((insight, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-0.5 text-gold-500">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      </div>{/* ── end inner wrapper (col1 + col2) ── */}

      {/* ── Column 3: Export & Share + Formula + Example ── */}
      <div className="flex flex-col gap-6 print:hidden lg:sticky lg:top-20 lg:self-start xl:block xl:space-y-6">
        {/* Export & Share */}
        <CalculatorActionBar
          onDownloadPdf={handleDownloadPdf}
          onDownloadCsv={handleDownloadCsv}
          onPrint={handlePrint}
          onShare={handleShare}
        />

        {/* Formula Explanation */}
        {config.formulaExplanation && (
          <div className="card-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-gradient text-ink-950">
                <FormulaIcon size={15} />
              </span>
              <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
                Formula Explanation
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              {config.formulaExplanation}
            </p>
          </div>
        )}

        {/* Example Calculation */}
        {config.exampleCalculation && (
          <div className="card-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-gradient text-ink-950">
                <Lightbulb size={15} />
              </span>
              <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
                Example Calculation
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              {config.exampleCalculation}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="card-surface p-4 text-xs leading-relaxed text-ink-400">
          Results are estimates for informational purposes only and do not constitute financial advice.
        </div>
      </div>
    </div>
  );
}
