import LegalPageLayout from "../components/legal/LegalPageLayout";

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      description="The terms governing your use of RupeeUncle's calculators and content."
      canonicalPath="/terms-and-conditions"
      lastUpdated="24 June 2026"
    >
      <p>
        By using RupeeUncle, you agree to the following terms. If you don't agree, please
        don't use the site.
      </p>

      <h2 id="use-of-calculators">Use of Calculators</h2>
      <p>
        All calculators on this site are provided free of charge for informational and
        illustrative purposes. They are not a substitute for professional financial, tax,
        or legal advice. Results are estimates based on the inputs you provide and the
        assumptions stated on each calculator page — actual outcomes (loan approval,
        investment returns, tax liability) depend on factors outside this calculator's
        scope, including lender/insurer underwriting, market performance, and your complete
        financial situation.
      </p>

      <h2 id="no-financial-advice">No Financial Advice</h2>
      <p>
        Nothing on this site constitutes financial, investment, tax, or legal advice. We
        are not SEBI-registered investment advisors. Please consult a qualified, licensed
        professional before making any financial decision based on information from this
        site.
      </p>

      <h2 id="accuracy">Accuracy of Information</h2>
      <p>
        We make reasonable efforts to keep tax rates, interest rate ranges, and regulatory
        figures (RBI rules, Income Tax slabs, GST rates, etc.) current and accurate at the
        time of publishing. However, rules change — always verify current rates with an
        official source (Income Tax Department, RBI, your bank/insurer) before relying on
        a calculation for an actual financial decision.
      </p>

      <h2 id="intellectual-property">Intellectual Property</h2>
      <p>
        The design, code, calculator logic, and original written content on this site are
        the property of RupeeUncle unless otherwise stated. You may use the calculators for
        personal, non-commercial purposes and share links to our pages. You may not copy,
        republish, or redistribute our calculator logic, formulas' written explanations, or
        blog content without prior written permission.
      </p>

      <h2 id="user-conduct">Acceptable Use</h2>
      <p>
        You agree not to misuse this site — including attempting to disrupt its operation,
        scraping content at scale without permission, or submitting false/abusive content
        through our contact form.
      </p>

      <h2 id="third-party-links">Third-Party Links</h2>
      <p>
        This site may link to third-party websites (banks, insurers, fund houses,
        affiliate partners). We are not responsible for the content, accuracy, or practices
        of any third-party site.
      </p>

      <h2 id="limitation-of-liability">Limitation of Liability</h2>
      <p>
        RupeeUncle and its operators are not liable for any loss or damage arising from
        your use of, or reliance on, this site's calculators or content, including
        financial decisions made based on calculator outputs.
      </p>

      <h2 id="changes">Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the site after a
        change constitutes acceptance of the revised terms.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        Questions about these terms? Reach out via our <a href="/contact-us">Contact Us</a>{" "}
        page.
      </p>
    </LegalPageLayout>
  );
}
