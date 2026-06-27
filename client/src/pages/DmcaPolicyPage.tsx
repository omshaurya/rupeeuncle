import LegalPageLayout from "../components/legal/LegalPageLayout";

export default function DmcaPolicyPage() {
  return (
    <LegalPageLayout
      title="DMCA Policy"
      description="How to report copyright infringement on RupeeUncle."
      canonicalPath="/dmca-policy"
      lastUpdated="24 June 2026"
    >
      <p>
        RupeeUncle respects the intellectual property rights of others and expects users
        and contributors to do the same. We respond to clear notices of alleged copyright
        infringement.
      </p>

      <h2 id="filing-a-notice">Filing a Takedown Notice</h2>
      <p>
        If you believe content on this site infringes your copyright, please send a notice
        via our <a href="/contact-us">Contact Us</a> page including:
      </p>
      <ul>
        <li>A description of the copyrighted work you claim has been infringed</li>
        <li>The exact URL(s) on RupeeUncle where the allegedly infringing content appears</li>
        <li>Your contact information (name, email, address)</li>
        <li>
          A statement that you have a good-faith belief the use is not authorized by the
          copyright owner, its agent, or the law
        </li>
        <li>
          A statement, under penalty of perjury, that the information in your notice is
          accurate and that you are the copyright owner or authorized to act on their
          behalf
        </li>
      </ul>

      <h2 id="our-response">Our Response</h2>
      <p>
        Upon receiving a valid notice, we will review the claim and remove or disable
        access to the allegedly infringing content as appropriate, and will make
        reasonable efforts to notify the party who posted or is responsible for the
        content.
      </p>

      <h2 id="counter-notice">Counter-Notification</h2>
      <p>
        If you believe content was removed in error, you may submit a counter-notice
        through the same Contact Us channel, including your contact information and a
        statement under penalty of perjury that you have a good-faith belief the content
        was removed as a result of mistake or misidentification.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        Submit DMCA notices via our <a href="/contact-us">Contact Us</a> page.
      </p>
    </LegalPageLayout>
  );
}
