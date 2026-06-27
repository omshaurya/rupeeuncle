/**
 * Formats a number as Indian Rupees using the Indian numbering system
 * (lakh/crore grouping: 12,34,567 not 1,234,567).
 */
export function formatINR(value: number, options?: { decimals?: number }): string {
  const decimals = options?.decimals ?? 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

/** Same as formatINR but without the ₹ symbol — useful for chart axis labels. */
export function formatNumberIN(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

/** Compact form for chart axes: ₹12.3L, ₹1.2Cr, etc. */
export function formatCompactINR(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)}Cr`;
  if (abs >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`;
  return `₹${value.toFixed(0)}`;
}
