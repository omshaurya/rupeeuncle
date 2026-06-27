import type { CalculatorOutputDef } from "../../types/calculator";
import { formatINR } from "../../utils/formatters";

interface Props {
  outputDefs: CalculatorOutputDef[];
  outputs: Record<string, number>;
}

function formatValue(def: CalculatorOutputDef, outputs: Record<string, number>): string {
  const raw = outputs[def.key] ?? 0;
  return def.unit === "%" ? `${raw}%` : formatINR(raw);
}

function dynamicSize(value: string): string {
  const len = value.replace(/[^0-9]/g, "").length;
  if (len <= 7) return "text-4xl";
  if (len <= 10) return "text-3xl";
  return "text-2xl";
}

export default function ResultsCard({ outputDefs, outputs }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {outputDefs.map((def) => {
        const display = formatValue(def, outputs);
        return (
          <div
            key={def.key}
            className={
              def.highlight
                ? "card-surface bg-ink-gradient p-6 text-white"
                : "card-surface p-6"
            }
          >
            <p
              className={
                def.highlight
                  ? "text-sm font-medium tracking-wide text-ink-200"
                  : "text-sm font-medium tracking-wide text-ink-400 dark:text-ink-400"
              }
            >
              {def.label}
            </p>
            <p
              className={`result-figure mt-2 font-bold leading-none ${dynamicSize(display)} ${
                def.highlight
                  ? "text-gold-300"
                  : "text-ink-900 dark:text-ink-50"
              }`}
            >
              {display}
            </p>
          </div>
        );
      })}
    </div>
  );
}
