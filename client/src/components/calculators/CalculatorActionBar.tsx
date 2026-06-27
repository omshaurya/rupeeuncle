import { useState } from "react";
import { Download, FileSpreadsheet, Printer, Share2, Check } from "lucide-react";

interface Props {
  onDownloadPdf: () => void;
  onDownloadCsv: () => void;
  onPrint: () => void;
  onShare: () => void;
}

export default function CalculatorActionBar({
  onDownloadPdf,
  onDownloadCsv,
  onPrint,
  onShare,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-surface p-6 print:hidden">
      <h3 className="mb-4 font-display text-lg font-semibold text-ink-800 dark:text-ink-100">
        Export & Share
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {/* Download PDF — full-width, primary CTA */}
        <button
          onClick={onDownloadPdf}
          className="col-span-2 flex w-full items-center justify-center gap-3 rounded-xl bg-ink-800 px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-ink-700 active:scale-[0.98] dark:bg-gold-400 dark:text-ink-950 dark:hover:bg-gold-300"
        >
          <Download size={18} />
          Download PDF
        </button>

        <button
          onClick={onDownloadCsv}
          className="flex items-center justify-center gap-2.5 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition-all hover:bg-ink-50 active:scale-[0.98] dark:border-surface-500 dark:bg-surface-700 dark:text-ink-100 dark:hover:bg-surface-600"
        >
          <FileSpreadsheet size={17} />
          Export CSV
        </button>

        <button
          onClick={onPrint}
          className="flex items-center justify-center gap-2.5 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition-all hover:bg-ink-50 active:scale-[0.98] dark:border-surface-500 dark:bg-surface-700 dark:text-ink-100 dark:hover:bg-surface-600"
        >
          <Printer size={17} />
          Print
        </button>

        <button
          onClick={handleShare}
          className="col-span-2 flex w-full items-center justify-center gap-2.5 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition-all hover:bg-ink-50 active:scale-[0.98] dark:border-surface-500 dark:bg-surface-700 dark:text-ink-100 dark:hover:bg-surface-600"
        >
          {copied ? <Check size={17} className="text-gain dark:text-gain-dark" /> : <Share2 size={17} />}
          {copied ? "Link Copied!" : "Share Result"}
        </button>
      </div>
    </div>
  );
}
