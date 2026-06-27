import LegalPageLayout from "../components/legal/LegalPageLayout";

export default function AffiliateDisclosurePage() {
  return (
    <LegalPageLayout
      title="Affiliate Disclosure"
      description="How RupeeUncle uses affiliate links and earns commissions."
      canonicalPath="/affiliate-disclosure"
      lastUpdated="24 June 2026"
    >
      <p>
        In the interest of full transparency: some links on RupeeUncle — for example, in
        comparison tables for credit cards, demat accounts, loans, or insurance products —
        may be affiliate links.
      </p>

      <h2 id="what-this-means">What This Means</h2>
      <p>
        If you click an affiliate link and then sign up for or purchase a product, we may
        earn a commission from the financial institution or platform involved. This comes
        at <strong>no extra cost to you</strong> — the price or terms you receive are the
        same whether you use our link or go directly to the provider.
      </p>

      <h2 id="how-we-choose">How We Choose What to Feature</h2>
      <p>
        We aim to feature products we believe are genuinely useful based on publicly
        available terms, rates, and features. That said, affiliate relationships can create
        an incentive to feature certain products — we encourage you to compare multiple
        options and read the provider's own terms directly before making a decision, rather
        than relying solely on our comparison.
      </p>

      <h2 id="calculators-are-independent">Our Calculators Are Not Affected</h2>
      <p>
        Affiliate relationships have no bearing on how our calculators compute results.
        Every formula on this site is built and verified independently of any commercial
        relationship — a calculator never adjusts its output to favor an affiliate
        partner.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        Questions about our affiliate relationships? Reach out via our{" "}
        <a href="/contact-us">Contact Us</a> page.
      </p>
    </LegalPageLayout>
  );
}
