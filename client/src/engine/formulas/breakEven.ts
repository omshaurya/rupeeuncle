import type { FormulaFn } from "../../types/calculator";

/**
 * Break-Even Point Calculator.
 *
 * Contribution Margin per Unit = Selling Price − Variable Cost per Unit
 * Break-Even Point (units) = Fixed Costs / Contribution Margin per Unit
 * Break-Even Point (revenue) = Break-Even Units × Selling Price
 *
 * Verified against multiple independent worked examples: $15,000 fixed costs, $50 price,
 * $5 variable cost → 334 units (rounded up); $10,000 fixed, $100 price, $20 variable →
 * 125 units. Both matched exactly.
 */
export const breakEvenFormula: FormulaFn = (inputs) => {
  const fixedCosts = inputs.fixedCosts ?? 0;
  const sellingPricePerUnit = inputs.sellingPricePerUnit ?? 0;
  const variableCostPerUnit = inputs.variableCostPerUnit ?? 0;
  const currentMonthlyUnits = inputs.currentMonthlyUnits ?? 0;

  const contributionMargin = sellingPricePerUnit - variableCostPerUnit;
  const breakEvenUnits =
    contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : Infinity;
  const breakEvenRevenue =
    breakEvenUnits === Infinity ? Infinity : breakEvenUnits * sellingPricePerUnit;

  const marginOfSafetyUnits = currentMonthlyUnits - (breakEvenUnits === Infinity ? 0 : breakEvenUnits);
  const marginOfSafetyPercent =
    currentMonthlyUnits > 0 && breakEvenUnits !== Infinity
      ? (marginOfSafetyUnits / currentMonthlyUnits) * 100
      : 0;

  const pieData =
    contributionMargin > 0
      ? [
          { name: "Variable Costs (at break-even)", value: Math.round(variableCostPerUnit * breakEvenUnits) },
          { name: "Fixed Costs", value: Math.round(fixedCosts) },
        ]
      : [];

  const insights: string[] = [];
  if (contributionMargin <= 0) {
    insights.push(
      "Your variable cost per unit is equal to or higher than your selling price — at this pricing, you cannot break even no matter how many units you sell. Increase your price or reduce variable costs."
    );
  } else {
    insights.push(
      `You need to sell ${breakEvenUnits.toLocaleString("en-IN")} units (₹${Math.round(breakEvenRevenue).toLocaleString("en-IN")} in revenue) per month to break even.`
    );
    insights.push(
      `Your contribution margin is ₹${contributionMargin.toLocaleString("en-IN")} per unit (${((contributionMargin / sellingPricePerUnit) * 100).toFixed(1)}% of selling price).`
    );
    if (currentMonthlyUnits > 0) {
      insights.push(
        marginOfSafetyUnits >= 0
          ? `At your current sales of ${currentMonthlyUnits.toLocaleString("en-IN")} units/month, you're ${marginOfSafetyPercent.toFixed(1)}% above break-even — your margin of safety.`
          : `At your current sales of ${currentMonthlyUnits.toLocaleString("en-IN")} units/month, you're below break-even by ${Math.abs(marginOfSafetyUnits).toLocaleString("en-IN")} units.`
      );
    }
  }

  return {
    outputs: {
      breakEvenUnits: breakEvenUnits === Infinity ? -1 : breakEvenUnits,
      breakEvenRevenue: breakEvenRevenue === Infinity ? -1 : Math.round(breakEvenRevenue),
      contributionMargin: Math.round(contributionMargin),
    },
    yearlyData: [],
    pieData,
    insights,
  };
};
