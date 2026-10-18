/**
 * WebApplication JSON-LD for a page whose main content is a working tool.
 * Tells search engines the page *does* something, is free, and runs in the
 * browser — the facts that distinguish it from an article about resizing.
 */

const SITE_URL = "https://sharpmonk.com";

export default function ToolSchema({ name, path, description }: { name: string; path: string; description: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: `${SITE_URL}${path}`,
    description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (runs in the browser)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    publisher: { "@type": "Organization", name: "Sharpmonk", url: SITE_URL },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}
