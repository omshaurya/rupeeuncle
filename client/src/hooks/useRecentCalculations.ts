import { useCallback, useEffect, useState } from "react";
import type { FormulaInputs } from "../types/calculator";

export interface RecentCalculation {
  calculatorSlug: string;
  calculatorName: string;
  inputs: FormulaInputs;
  timestamp: number;
}

const STORAGE_KEY = "rupeeuncle_recent_calculations";
const MAX_RECENT = 10;

/**
 * Manages "recent calculations" in browser LocalStorage. Since this site has
 * no login/accounts (per spec), this is the only persistence layer for the user's
 * own history — entirely client-side, never sent to the server.
 */
export function useRecentCalculations() {
  const [recent, setRecent] = useState<RecentCalculation[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch (err) {
      console.error("Failed to read recent calculations from localStorage:", err);
    }
  }, []);

  const saveCalculation = useCallback(
    (calculatorSlug: string, calculatorName: string, inputs: FormulaInputs) => {
      try {
        const entry: RecentCalculation = {
          calculatorSlug,
          calculatorName,
          inputs,
          timestamp: Date.now(),
        };

        const existing: RecentCalculation[] = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]"
        );

        // Remove any previous entry for the same calculator, then prepend the new one
        const filtered = existing.filter((e) => e.calculatorSlug !== calculatorSlug);
        const updated = [entry, ...filtered].slice(0, MAX_RECENT);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setRecent(updated);
      } catch (err) {
        console.error("Failed to save calculation to localStorage:", err);
      }
    },
    []
  );

  const clearRecent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRecent([]);
  }, []);

  return { recent, saveCalculation, clearRecent };
}
