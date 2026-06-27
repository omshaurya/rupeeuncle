import LegalPageLayout from "../components/legal/LegalPageLayout";

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="What cookies RupeeUncle uses and how to control them."
      canonicalPath="/cookie-policy"
      lastUpdated="24 June 2026"
    >
      <p>
        This page explains what cookies and similar local storage technologies RupeeUncle
        uses, and how you can control them.
      </p>

      <h2 id="what-are-cookies">What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device by your browser. We also use
        browser local storage, which works similarly but stays strictly on your device and
        is never transmitted to our servers.
      </p>

      <h2 id="what-we-use">What We Use, Specifically</h2>
      <ul>
        <li>
          <strong>Theme preference (local storage):</strong> remembers whether you've
          chosen dark or light mode, so you don't have to reselect it on every visit. Never
          leaves your device.
        </li>
        <li>
          <strong>Recently used calculators (local storage):</strong> remembers which
          calculators you've recently used for quick access. Never leaves your device.
        </li>
        <li>
          <strong>Advertising cookies (Google AdSense):</strong> if ads are displayed on
          this site, Google and its partners may set cookies to serve relevant ads and
          measure ad performance, based on your browsing across sites.
        </li>
        <li>
          <strong>Basic analytics cookies:</strong> may be used to understand aggregate
          traffic patterns (which pages and calculators are most used) — not to identify
          you individually.
        </li>
      </ul>

      <h2 id="controlling-cookies">Controlling Cookies</h2>
      <p>
        You can clear cookies and local storage at any time through your browser's
        settings. Doing so will reset your theme preference and recently-used calculator
        list, but won't affect your ability to use any calculator. To opt out of
        personalized advertising specifically, visit{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          Google's Ad Settings
        </a>.
      </p>

      <h2 id="changes">Changes to This Policy</h2>
      <p>
        We may update this policy as our use of cookies changes. Check back periodically
        for updates.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        Questions about our cookie use? Reach out via our{" "}
        <a href="/contact-us">Contact Us</a> page.
      </p>
    </LegalPageLayout>
  );
}
