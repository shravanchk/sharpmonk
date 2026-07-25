import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy",
  description: "How Sharpmonk collects, uses, and protects information, including cookies used for analytics and advertising.",
};

const EFFECTIVE_DATE = "July 23, 2026";

export default function PrivacyPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">Legal</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="text-muted mt-4 text-sm">Effective {EFFECTIVE_DATE}</p>

        <div className="prose-legal mt-10">
          <h2>1. Overview</h2>
          <p>
            Sharpmonk (&ldquo;Sharpmonk,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates
            sharpmonk.com (the &ldquo;Site&rdquo;), including the free insurance
            calculator. This Privacy Policy explains what information we
            collect, how we use it, and the choices you have. By using the
            Site, you agree to the practices described here.
          </p>

          <h2>2. Information the calculator does not collect</h2>
          <p>
            The insurance calculator runs entirely in your browser. Ages,
            coverage amounts, vehicle values, home values, and every other
            figure you enter are used only to compute an on-screen estimate
            and are never transmitted to, or stored on, our servers.
          </p>

          <h2>3. Information we do collect</h2>
          <p>We (and our service providers) may automatically collect:</p>
          <ul>
            <li><strong>Usage data</strong> — pages visited, referring URLs, device/browser type, and approximate location derived from IP address, via Cloudflare Web Analytics. It is cookieless and does not fingerprint or assign a persistent identifier to you, so it runs without a consent prompt and cannot be used to track you across other sites.</li>
            <li><strong>Browser storage</strong> — your theme choice, and your answer to the advertising-consent prompt if you are shown one, are kept in your browser&apos;s local storage on your own device. They are preferences, are never sent to us, and are not used to identify or track you. You can clear them at any time through your browser settings.</li>
            <li><strong>Advertising cookies</strong> — only where you have consented, and only once ads are live (see Section 4). While advertising is switched off, the Site sets no cookies at all.</li>
            <li><strong>Contact-form submissions</strong> — the contact page opens a pre-filled email in your own email client; we only receive what you choose to send.</li>
          </ul>

          <h2>4. Cookies, advertising & Google AdSense</h2>
          <p>
            Sharpmonk intends to display ads served by Google AdSense.
            Google and its partners may use cookies (including the DART
            cookie) and similar technologies to serve ads based on your
            prior visits to this and other websites.
          </p>
          <ul>
            <li>You can opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
            <li>You can also visit <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">aboutads.info/choices</a> to opt out of participating vendors&apos; personalized advertising.</li>
            <li>Third-party vendors, including Google, may use cookies to serve ads based on someone&apos;s prior visits to the Site or other sites on the internet.</li>
          </ul>
          <p>
            We show a cookie-consent banner on first visit. Advertising
            cookies are only set after you click &ldquo;Accept.&rdquo; If you click
            &ldquo;Decline,&rdquo; we do not load the AdSense script or set advertising
            cookies for that session.
          </p>

          <h2>5. How we use information</h2>
          <p>We use the data described above to operate and improve the Site, understand aggregate usage patterns, support advertising that keeps the Site free, and respond to messages sent through the contact form.</p>

          <h2>6. Data sharing</h2>
          <p>
            We do not sell personal information. We share limited data with
            service providers strictly to operate the Site — for example,
            Cloudflare (hosting and analytics) and, where consented to,
            Google AdSense.
            These providers are bound by their own privacy policies.
          </p>

          <h2>7. Your rights (GDPR / CCPA)</h2>
          <p>
            Depending on where you live, you may have the right to access,
            correct, delete, or restrict use of your personal information,
            and to opt out of the sale or sharing of personal information
            for advertising purposes. To exercise these rights, use the{" "}
            <Link href="/contact">contact page</Link>.
          </p>

          <h2>8. Children&apos;s privacy</h2>
          <p>
            The Site is not directed to children under 13 (or the
            equivalent minimum age in your jurisdiction), and we do not
            knowingly collect personal information from children.
          </p>

          <h2>9. Data retention & security</h2>
          <p>
            We retain analytics data only as long as reasonably necessary
            for the purposes above and use commercially reasonable measures
            to protect it. No method of transmission or storage is 100%
            secure.
          </p>

          <h2>10. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material
            changes will be reflected by updating the effective date above.
          </p>

          <h2>11. Contact</h2>
          <p>
            Questions about this policy? Reach out via the{" "}
            <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
