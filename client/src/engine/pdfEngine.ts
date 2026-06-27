import jsPDF from "jspdf";
import type { CalculationResult, CalculatorConfig, FormulaInputs } from "../types/calculator";
import { formatINR } from "../utils/formatters";

// ── Design tokens ──────────────────────────────────────────────────────────
const INK_DARK   = [21, 42, 44]    as const;
const GOLD       = [201, 140, 31]  as const;
const GRAY       = [110, 126, 127] as const;
const LIGHT_GOLD = [253, 248, 237] as const;

// A4 in points: 595 × 842
const MARGIN   = 52;                              // left & right margin
const CW       = (w: number) => w - MARGIN * 2;  // usable text width
const FOOTER_H = 52;                              // reserved at page bottom
const LINE_H   = 14;                              // base line height for body text

// ── Public entry point ─────────────────────────────────────────────────────
export function exportToPDF(
  config: CalculatorConfig,
  inputs: FormulaInputs,
  result: CalculationResult,
  siteName = "RupeeUncle"
): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  let y = 0;

  y = drawHeader(doc, W, siteName, config.name);

  // ── Inputs ──
  y = drawSection(doc, "Your Inputs", W, y);
  for (const def of config.inputs) {
    const v = inputs[def.key] ?? 0;
    const value =
      def.type === "currency"
        ? formatINR(v)
        : `${v}${def.unit ? " " + def.unit : ""}`;
    y = drawRow(doc, def.label, value, W, y);
  }
  y += 12;

  // ── Results ──
  y = drawSection(doc, "Results", W, y);
  for (const def of config.outputs) {
    const raw   = result.outputs[def.key] ?? 0;
    const value = def.unit === "%" ? `${raw}%` : formatINR(raw);
    y = drawRow(doc, def.label, value, W, y, def.highlight);
  }
  y += 12;

  // ── Insights ──
  if (result.insights?.length) {
    y = drawSection(doc, "Insights", W, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    for (const insight of result.insights) {
      y = pageBreak(doc, y, 24);
      const lines = doc.splitTextToSize(`•  ${insight}`, CW(W) - 8);
      doc.text(lines, MARGIN + 4, y);
      y += lines.length * LINE_H + 6;
    }
    y += 8;
  }

  // ── Projection table ──
  if (result.yearlyData.length > 0) {
    y = pageBreak(doc, y, 80);
    y = drawSection(doc, "Year-wise Projection", W, y);
    y = drawTable(doc, result.yearlyData, W, y);
  }

  // ── Formula ──
  y = pageBreak(doc, y, 60);
  y = drawSection(doc, "Formula Used", W, y);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
  const formulaText  = config.formulaExplanation ?? getFormulaFallback(config.formulaKey);
  const formulaLines = doc.splitTextToSize(formulaText, CW(W) - 8);
  y = pageBreak(doc, y, formulaLines.length * LINE_H + 8);
  doc.text(formulaLines, MARGIN + 4, y);
  y += formulaLines.length * LINE_H + 14;

  // ── Example ──
  if (config.exampleCalculation) {
    y = pageBreak(doc, y, 50);
    y = drawSection(doc, "Example Calculation", W, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    const exLines = doc.splitTextToSize(config.exampleCalculation, CW(W) - 8);
    y = pageBreak(doc, y, exLines.length * LINE_H + 8);
    doc.text(exLines, MARGIN + 4, y);
    y += exLines.length * LINE_H + 14;
  }

  stampFooters(doc, siteName);
  doc.save(`${config.slug}-report.pdf`);
}

// ── Header band ────────────────────────────────────────────────────────────
function drawHeader(doc: jsPDF, W: number, siteName: string, calcName: string): number {
  doc.setFillColor(INK_DARK[0], INK_DARK[1], INK_DARK[2]);
  doc.rect(0, 0, W, 76, "F");

  // Brand name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text(siteName, MARGIN, 32);

  // Tagline — wraps if needed
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(180, 200, 200);
  const tagLines = doc.splitTextToSize(
    "India's Largest Financial Calculators & Investment Tools Platform",
    CW(W)
  );
  doc.text(tagLines, MARGIN, 48);

  // Gold accent line
  doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.rect(0, 76, W, 3, "F");

  let y = 100;

  // Report title — wrap if calculator name is long
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(INK_DARK[0], INK_DARK[1], INK_DARK[2]);
  const titleLines = doc.splitTextToSize(`${calcName} — Report`, CW(W));
  doc.text(titleLines, MARGIN, y);
  y += titleLines.length * 18 + 6;

  // Timestamp
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
  doc.text(`Generated on ${new Date().toLocaleString("en-IN")}`, MARGIN, y);
  y += 20;

  return y;
}

// ── Section heading ────────────────────────────────────────────────────────
function drawSection(doc: jsPDF, title: string, W: number, y: number): number {
  y = pageBreak(doc, y, 40);

  // Background strip
  doc.setFillColor(248, 246, 242);
  doc.rect(MARGIN, y - 11, CW(W), 17, "F");
  // Gold left bar
  doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.rect(MARGIN, y - 11, 4, 17, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(INK_DARK[0], INK_DARK[1], INK_DARK[2]);
  doc.text(title, MARGIN + 12, y);
  return y + 16;
}

// ── Key / value row — label wraps, value right-aligned ────────────────────
function drawRow(
  doc: jsPDF,
  label: string,
  value: string,
  W: number,
  y: number,
  highlight = false
): number {
  const contentW  = CW(W);
  const rightX    = MARGIN + contentW;
  const valueColW = 140;
  const labelMaxW = contentW - valueColW - 12;

  // Wrap label into multiple lines if needed
  doc.setFont("helvetica", highlight ? "bold" : "normal");
  doc.setFontSize(9.5);
  const labelLines = doc.splitTextToSize(label, Math.max(labelMaxW, 80));
  const rowH = Math.max(labelLines.length * LINE_H + 10, 26); // min 26pt tall

  y = pageBreak(doc, y, rowH + 4);

  // Highlight or alternate background
  if (highlight) {
    doc.setFillColor(LIGHT_GOLD[0], LIGHT_GOLD[1], LIGHT_GOLD[2]);
    doc.rect(MARGIN, y - 14, contentW, rowH, "F");
    // Gold left accent
    doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.rect(MARGIN, y - 14, 3, rowH, "F");
  }

  // Label text (may wrap across multiple lines)
  doc.setFont("helvetica", highlight ? "bold" : "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(
    highlight ? INK_DARK[0] : 55,
    highlight ? INK_DARK[1] : 55,
    highlight ? INK_DARK[2] : 55
  );
  doc.text(labelLines, MARGIN + (highlight ? 10 : 4), y);

  // Value — shrink until it fits in valueColW, then right-align to margin
  doc.setFont("helvetica", highlight ? "bold" : "normal");
  doc.setTextColor(
    highlight ? GOLD[0] : 40,
    highlight ? GOLD[1] : 40,
    highlight ? GOLD[2] : 40
  );
  let fs = highlight ? 10.5 : 9.5;
  doc.setFontSize(fs);
  while (doc.getTextWidth(value) > valueColW && fs > 6.5) {
    fs -= 0.5;
    doc.setFontSize(fs);
  }
  // Vertically centre the value within the row
  const valueY = y + ((labelLines.length - 1) * LINE_H) / 2;
  doc.text(value, rightX - 4, valueY, { align: "right" });

  doc.setFontSize(9.5);
  return y + rowH - 6;
}

// ── Projection table ───────────────────────────────────────────────────────
function drawTable(
  doc: jsPDF,
  rows: CalculationResult["yearlyData"],
  W: number,
  y: number
): number {
  const contentW = CW(W);
  const colCount = 4;
  const colW     = contentW / colCount;
  const rightEdge = (i: number) => MARGIN + (i + 1) * colW - 5;
  const ROW_H     = 16;
  const HDR_H     = 18;

  const headers = ["Year", "Invested (₹)", "Returns (₹)", "Balance (₹)"];

  // Header row
  doc.setFillColor(INK_DARK[0], INK_DARK[1], INK_DARK[2]);
  doc.rect(MARGIN, y - 13, contentW, HDR_H, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  headers.forEach((h, i) =>
    i === 0
      ? doc.text(h, MARGIN + 5, y)
      : doc.text(h, rightEdge(i), y, { align: "right" })
  );
  y += HDR_H - 5;

  // Data rows
  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    y = pageBreak(doc, y, ROW_H + 4);

    if (idx % 2 === 0) {
      doc.setFillColor(LIGHT_GOLD[0], LIGHT_GOLD[1], LIGHT_GOLD[2]);
      doc.rect(MARGIN, y - 11, contentW, ROW_H, "F");
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    doc.text(String(row.year), MARGIN + 5, y);

    const nums = [
      row.invested.toLocaleString("en-IN"),
      row.returns.toLocaleString("en-IN"),
      row.balance.toLocaleString("en-IN"),
    ];
    nums.forEach((v, vi) => {
      let fs = 8.5;
      doc.setFontSize(fs);
      while (doc.getTextWidth(v) > colW - 10 && fs > 5.5) {
        fs -= 0.5;
        doc.setFontSize(fs);
      }
      doc.text(v, rightEdge(vi + 1), y, { align: "right" });
      doc.setFontSize(8.5);
    });

    y += ROW_H;
  }

  return y + 10;
}

// ── Page break guard ───────────────────────────────────────────────────────
function pageBreak(doc: jsPDF, y: number, needed: number): number {
  const H = doc.internal.pageSize.getHeight();
  if (y + needed > H - FOOTER_H) {
    doc.addPage();
    return 52;
  }
  return y;
}

// ── Footer on every page ───────────────────────────────────────────────────
function stampFooters(doc: jsPDF, siteName: string): void {
  const H     = doc.internal.pageSize.getHeight();
  const W     = doc.internal.pageSize.getWidth();
  const total = doc.internal.pages.length - 1;

  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setDrawColor(210, 210, 210);
    doc.line(MARGIN, H - FOOTER_H + 10, W - MARGIN, H - FOOTER_H + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(160, 160, 160);
    doc.text(
      `${siteName} — For informational purposes only. Not financial advice.`,
      MARGIN,
      H - FOOTER_H + 26
    );
    doc.text(`Page ${i} of ${total}`, W - MARGIN, H - FOOTER_H + 26, { align: "right" });
  }
}

// ── Formula fallback ───────────────────────────────────────────────────────
function getFormulaFallback(key: string): string {
  const map: Record<string, string> = {
    sip: "Future Value = P × [((1 + i)^n − 1) / i] × (1 + i), where P = monthly investment, i = monthly interest rate, n = total months.",
    emi: "EMI = P × r × (1 + r)^n / [(1 + r)^n − 1], where P = principal, r = monthly interest rate, n = loan tenure in months.",
    fd:  "Maturity Amount = P × (1 + r/n)^(n × t), where P = principal, r = annual rate, n = compounding frequency per year, t = tenure in years.",
    incomeTaxNew:
      "FY 2025-26 new tax regime slabs applied after standard deduction. Section 87A rebate for taxable income up to ₹12 lakh. 4% health and education cess on final tax.",
  };
  return (
    map[key] ??
    "See the full formula breakdown on this calculator's page at rupeeuncle.com"
  );
}
