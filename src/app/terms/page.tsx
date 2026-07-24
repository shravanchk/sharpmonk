import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of Service",
  description: "The terms governing your use of Sharpmonk and its insurance calculator.",
};

const EFFECTIVE_DATE = "July 23, 2026";

export default function TermsPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">Legal</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Terms of Service</h1>
        <p className="text-muted mt-4 text-sm">Effective {EFFECTIVE_DATE}</p>

        <div className="prose-legal mt-10">
          <h2>1. Acceptance of terms</h2>
          <p>
            By accessing or using sharpmonk.com (the &ldquo;Site&rdquo;), you agree to
            be bound by these Terms of Service. If you do not agree, please
            do not use the Site.
          </p>

          <h2>2. Description of service</h2>
          <p>
            Sharpmonk provides free, browser-based calculators, including an
            insurance premium estimator, for general informational and
            educational purposes. Use of the Site does not require an
            account or payment.
          </p>

          <h2>3. Not insurance, financial, or legal advice</h2>
          <p>
            Sharpmonk is not an insurance company, agent, broker, or
            carrier. Nothing on the Site constitutes insurance, financial,
            legal, or tax advice, nor an offer, application, or quote for
            insurance coverage. Estimates produced by the calculator are
            illustrative only — see the <Link href="/disclaimer">Disclaimer</Link>{" "}
            for full detail.
          </p>

          <h2>4. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Site for any unlawful purpose or in violation of these Terms.</li>
            <li>Attempt to interfere with, disrupt, or gain unauthorized access to the Site or its infrastructure.</li>
            <li>Scrape, reverse-engineer, or systematically extract content or code from the Site beyond normal browsing.</li>
            <li>Use automated means to access the Site in a way that sends more requests than a human could reasonably send in a given period.</li>
          </ul>

          <h2>5. Intellectual property</h2>
          <p>
            The Site&apos;s design, code, text, and branding are owned by
            Sharpmonk or its licensors and protected by applicable
            intellectual property laws. You may use the Site for personal,
            non-commercial purposes only, unless otherwise agreed in
            writing.
          </p>

          <h2>6. Third-party links and advertising</h2>
          <p>
            The Site may display third-party advertisements (via Google
            AdSense) or link to third-party websites. We do not control and
            are not responsible for the content, accuracy, or practices of
            third-party sites or advertisers.
          </p>

          <h2>7. Disclaimer of warranties</h2>
          <p>
            The Site and all calculators are provided &ldquo;as is&rdquo; and &ldquo;as
            available,&rdquo; without warranties of any kind, express or implied,
            including accuracy, completeness, reliability, or fitness for a
            particular purpose. We do not warrant that the Site will be
            uninterrupted or error-free.
          </p>

          <h2>8. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Sharpmonk and its
            operators shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of
            profits or data, arising from your use of, or inability to use,
            the Site — including decisions made based on calculator
            estimates.
          </p>

          <h2>9. Changes to these terms</h2>
          <p>
            We may revise these Terms at any time. Continued use of the
            Site after changes are posted constitutes acceptance of the
            revised Terms.
          </p>

          <h2>10. Governing law</h2>
          <p>
            These Terms are governed by the laws of the jurisdiction in
            which Sharpmonk operates, without regard to conflict-of-law
            principles, unless otherwise required by applicable consumer
            protection law.
          </p>

          <h2>11. Contact</h2>
          <p>
            Questions about these Terms? Reach out via the{" "}
            <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
