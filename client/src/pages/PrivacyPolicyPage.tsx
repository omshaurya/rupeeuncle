import LegalPageLayout from "../components/legal/LegalPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="How RupeeUncle collects, uses, and protects your information."
      canonicalPath="/privacy-policy"
      lastUpdated="24 June 2026"
    >
      <p>
        RupeeUncle ("we", "us", "our") provides free financial calculators, articles, and
        tools at this website. This policy explains what information we collect, why, and
        how it's handled. We do not require an account or login to use any calculator on
        this site.
      </p>

      <h2 id="information-we-collect">Information We Collect</h2>
      <p>We collect information in three ways:</p>
      <ul>
        <li>
          <strong>Calculator inputs:</strong> the numbers you enter into a calculator (e.g.
          loan amount, salary) are processed entirely in your browser to compute results.
          We do not transmit or store individual calculator inputs on our servers.
        </li>
        <li>
          <strong>Recently used calculators:</strong> for your convenience, the calculators
          you've recently used are saved in your browser's local storage so you can return
          to them quickly. This stays on your device and is never sent to us.
        </li>
        <li>
          <strong>Contact form submissions:</strong> if you use our Contact Us page, we
          store your name, email, and message in our database so we can respond to you.
        </li>
      </ul>

      <h2 id="cookies-and-analytics">Cookies and Analytics</h2>
      <p>
        We may use cookies and similar technologies for basic site analytics (to understand
        which calculators and articles are most useful) and to serve advertisements through
        Google AdSense. See our <a href="/cookie-policy">Cookie Policy</a> for details on
        what's used and how to control it.
      </p>

      <h2 id="advertising">Advertising</h2>
      <p>
        This site may display ads served by Google AdSense and other ad networks. These
        third parties may use cookies to serve ads based on your prior visits to this or
        other websites. You can opt out of personalized advertising through{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          Google's Ad Settings
        </a>.
      </p>

      <h2 id="third-party-links">Third-Party and Affiliate Links</h2>
      <p>
        Some pages may contain affiliate links to financial products (credit cards, demat
        accounts, insurance, etc.). If you click through and make a purchase or sign up, we
        may earn a commission at no extra cost to you. We only recommend products we believe
        are genuinely useful, but we encourage you to do your own research before any
        financial decision. See our{" "}
        <a href="/affiliate-disclosure">Affiliate Disclosure</a> for more detail.
      </p>

      <h2 id="data-security">Data Security</h2>
      <p>
        Contact form data is stored in a secured MongoDB database. We do not sell or share
        your personal information with third parties for their own marketing purposes.
      </p>

      <h2 id="your-rights">Your Rights</h2>
      <p>
        You can request that we delete any contact form submission you've made by emailing
        us through the <a href="/contact-us">Contact Us</a> page with your request.
      </p>

      <h2 id="changes">Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. The "Last updated" date at the top of
        this page reflects the most recent revision.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        Questions about this policy? Reach out via our <a href="/contact-us">Contact Us</a>{" "}
        page.
      </p>
    </LegalPageLayout>
  );
}
