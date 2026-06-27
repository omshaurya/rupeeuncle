import LegalPageLayout from "../components/legal/LegalPageLayout";

export default function DisclaimerPage() {
  return (
    <LegalPageLayout
      title="Disclaimer"
      description="RupeeUncle's calculators are for informational purposes only and are not financial advice."
      canonicalPath="/disclaimer"
      lastUpdated="24 June 2026"
    >
      <p>
        The information and calculators provided on RupeeUncle are for general
        informational and educational purposes only. They do not constitute financial,
        investment, tax, legal, or insurance advice of any kind.
      </p>

      <h2 id="not-a-substitute">Not a Substitute for Professional Advice</h2>
      <p>
        Every individual's financial situation is different. A calculator can only work
        with the numbers you enter — it cannot account for your complete financial
        picture, risk tolerance, dependents, existing obligations, or future plans.
        Always consult a SEBI-registered investment advisor, chartered accountant, or
        other qualified professional before making investment, tax, loan, or insurance
        decisions.
      </p>

      <h2 id="estimates-only">Calculations Are Estimates</h2>
      <p>
        Outputs from any calculator on this site — SIP projections, EMI amounts, tax
        liability, insurance coverage recommendations, and all others — are estimates
        based on the assumptions and inputs you provide. Actual results from a bank,
        insurer, fund house, or the Income Tax Department may differ due to factors this
        calculator cannot model, including individual underwriting, prevailing rates at
        the time of your actual transaction, and rule changes after publication.
      </p>

      <h2 id="no-guarantee-of-returns">No Guarantee of Investment Returns</h2>
      <p>
        Mutual fund, stock market, and other investment-related calculators use
        assumed rates of return for illustration. Past performance and assumed rates do
        not guarantee future results. All market-linked investments carry risk, including
        risk of loss of principal.
      </p>

      <h2 id="regulatory-figures">Tax and Regulatory Figures</h2>
      <p>
        Tax slabs, GST rates, RBI lending norms, and other regulatory figures referenced
        on this site reflect the rules in effect at the time of writing and are updated
        periodically, not in real time. Always verify current figures with the official
        source (Income Tax Department, GST Council, RBI) before relying on them.
      </p>

      <h2 id="no-liability">No Liability</h2>
      <p>
        RupeeUncle and its operators accept no liability for any loss, financial or
        otherwise, arising from decisions made using information or calculators on this
        site.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        Questions about this disclaimer? Reach out via our{" "}
        <a href="/contact-us">Contact Us</a> page.
      </p>
    </LegalPageLayout>
  );
}
