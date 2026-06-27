import { useState } from "react";
import type { CalculatorInputDef, FormulaInputs } from "../../types/calculator";
import { formatNumberIN } from "../../utils/formatters";

function formatDisplay(value: number, unit?: string): string {
  if (unit === "%" || unit === "yrs" || unit === "months") return String(value);
  return value.toLocaleString("en-IN");
}

function parseRaw(str: string): number {
  return Number(str.replace(/,/g, "").trim()) || 0;
}

interface Props {
  inputDefs: CalculatorInputDef[];
  values: FormulaInputs;
  onChange: (key: string, value: number) => void;
}

/**
 * Determines whether a conditionally-visible field (def.showIf) should currently render,
 * based on the live value of the input it depends on. Fields with no showIf always show.
 */
function isVisible(def: CalculatorInputDef, values: FormulaInputs): boolean {
  if (!def.showIf) return true;
  const dependeeValue = values[def.showIf.key];
  return def.showIf.equals.some((v) => v === dependeeValue);
}

/**
 * Renders a calculator's input form purely from its `inputs` config array.
 * This is the core of "calculators only define inputs/formula/labels" — no
 * calculator-specific form code exists anywhere in the app. The only exception is the
 * `showIf` conditional-visibility check above, which is itself still fully generic —
 * it reads field names/values from the config, never a specific calculator's key names.
 */
function NumericInput({ def, value, onChange }: { def: CalculatorInputDef; value: number; onChange: (v: number) => void }) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState("");

  const displayValue = focused ? raw : formatDisplay(value, def.unit);
  const charCount = displayValue.length;
  // Dynamically widen the input based on number of characters
  const minWidth = Math.max(80, charCount * 10 + 32);

  return (
    <div className="mt-2 flex items-center rounded-lg border border-ink-200 bg-white dark:border-surface-500 dark:bg-surface-700 overflow-hidden">
      {def.unit === "₹" && (
        <span className="select-none border-r border-ink-100 px-2.5 py-2 text-sm font-medium text-ink-400 dark:border-surface-600 dark:text-ink-400">₹</span>
      )}
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        style={{ minWidth }}
        onFocus={() => { setRaw(String(value)); setFocused(true); }}
        onBlur={() => {
          const parsed = parseRaw(raw);
          const clamped = Math.min(Math.max(parsed, def.min ?? 0), def.max ?? 1e9);
          onChange(clamped);
          setFocused(false);
        }}
        onChange={(e) => setRaw(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
        className="flex-1 bg-transparent px-3 py-2 text-right font-display text-base font-semibold text-ink-800 outline-none dark:text-ink-50"
      />
      {def.unit && def.unit !== "₹" && (
        <span className="select-none border-l border-ink-100 px-2.5 py-2 text-sm text-ink-400 dark:border-surface-600 dark:text-ink-400">{def.unit}</span>
      )}
    </div>
  );
}

export default function CalculatorInputForm({ inputDefs, values, onChange }: Props) {
  return (
    <div className="space-y-6">
      {inputDefs.filter((def) => isVisible(def, values)).map((def) => (
        <div key={def.key} className="animate-fade-in">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <label htmlFor={def.key} className="text-sm font-medium text-ink-700 dark:text-ink-200">
              {def.label}
            </label>
            <span className="shrink-0 font-display text-sm font-semibold text-ink-900 dark:text-gold-300">
              {def.unit === "₹" ? "₹" : ""}
              {formatNumberIN(values[def.key] ?? def.defaultValue)}
              {def.unit && def.unit !== "₹" ? ` ${def.unit}` : ""}
            </span>
          </div>

          {def.type === "select" ? (
            <select
              id={def.key}
              value={values[def.key] ?? def.defaultValue}
              onChange={(e) => onChange(def.key, Number(e.target.value))}
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 dark:border-surface-500 dark:bg-surface-700 dark:text-ink-50"
            >
              {def.options?.map((opt) => (
                <option key={String(opt.value)} value={opt.value} className="text-ink-800">
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={def.key}
              type="range"
              min={def.min ?? 0}
              max={def.max ?? 10000000}
              step={def.step ?? 1}
              value={values[def.key] ?? def.defaultValue}
              onChange={(e) => onChange(def.key, Number(e.target.value))}
              className="w-full accent-gold-500"
              aria-describedby={def.helpText ? `${def.key}-help` : undefined}
            />
          )}

          {def.type !== "select" && (
            <NumericInput
              def={def}
              value={values[def.key] ?? def.defaultValue}
              onChange={(v) => onChange(def.key, v)}
            />
          )}

          {def.helpText && (
            <p id={`${def.key}-help`} className="mt-1 text-xs text-ink-400 dark:text-ink-400">
              {def.helpText}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
