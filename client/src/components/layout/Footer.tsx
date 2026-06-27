import { Link } from "react-router-dom";

const CALC_LINKS_1 = [
  { label: "SIP Calculator", to: "/calculators/sip-calculator" },
  { label: "EMI Calculator", to: "/calculators/home-loan-calculator" },
  { label: "FD Calculator", to: "/calculators/fd-calculator" },
  { label: "PPF Calculator", to: "/calculators/ppf-calculator" },
  { label: "Income Tax (New)", to: "/calculators/income-tax-calculator-new-regime" },
  { label: "FIRE Calculator", to: "/calculators/fire-calculator" },
  { label: "CAGR Calculator", to: "/calculators/cagr-calculator" },
  { label: "Capital Gains", to: "/calculators/capital-gains-calculator" },
];

const CALC_LINKS_2 = [
  { label: "NPS Calculator", to: "/calculators/nps-calculator" },
  { label: "EPF Calculator", to: "/calculators/epf-calculator" },
  { label: "GST Calculator", to: "/calculators/gst-calculator" },
  { label: "Step-Up SIP", to: "/calculators/step-up-sip-calculator" },
  { label: "Net Worth", to: "/calculators/net-worth-calculator" },
  { label: "Goal Planning", to: "/calculators/goal-planning-calculator" },
  { label: "Loan Eligibility", to: "/calculators/loan-eligibility-calculator" },
  { label: "Break-Even", to: "/calculators/break-even-calculator" },
];

const LEGAL_LINKS = [
  { label: "About Us", to: "/about-us" },
  { label: "Contact Us", to: "/contact-us" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
  { label: "Disclaimer", to: "/disclaimer" },
  { label: "Cookie Policy", to: "/cookie-policy" },
  { label: "Affiliate Disclosure", to: "/affiliate-disclosure" },
  { label: "DMCA Policy", to: "/dmca-policy" },
  { label: "API for Developers", to: "/api-docs" },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto print:hidden" aria-label="Site footer">
      {/* Gold accent line at top */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <div className="bg-ink-900 text-ink-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main grid */}
          <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <Link to="/" className="inline-block">
                <span className="font-display text-xl font-bold text-white">
                  Rupee<span className="text-gold-400">Uncle</span>
                </span>
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-ink-400">
                India's most comprehensive financial calculator platform. Free tools for
                investments, loans, tax, retirement, and personal finance.
              </p>
              <div className="mt-5 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-700 bg-ink-800 px-3 py-1 text-xs text-ink-400">
                  🇮🇳 Made for India
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-700 bg-ink-800 px-3 py-1 text-xs text-ink-400">
                  56 Free Tools
                </span>
              </div>
            </div>

            {/* Calculators col 1 */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-500">
                Popular Calculators
              </p>
              <ul className="space-y-2.5 text-sm">
                {CALC_LINKS_1.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-ink-400 transition-colors hover:text-gold-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Calculators col 2 */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-500">
                More Tools
              </p>
              <ul className="space-y-2.5 text-sm">
                {CALC_LINKS_2.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-ink-400 transition-colors hover:text-gold-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal + Blog */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-500">
                Company
              </p>
              <ul className="space-y-2.5 text-sm">
                {LEGAL_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-ink-400 transition-colors hover:text-gold-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-ink-800 py-6">
            <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
              <p className="text-xs text-ink-500">
                © {new Date().getFullYear()} RupeeUncle. All calculators are for informational
                purposes only and do not constitute financial, investment, or tax advice.
              </p>
              <p className="shrink-0 text-xs text-ink-600">
                Built with ❤️ in India
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
