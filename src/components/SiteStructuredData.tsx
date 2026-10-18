/**
 * Site-wide JSON-LD: Organization + WebSite. Rendered once in the root
 * layout so every page carries the entity signals search engines use to
 * understand the brand and connect the domain to it. Page-specific schema
 * (FAQPage, HowTo, BreadcrumbList) lives on the individual pages.
 */

const SITE_URL = "https://sharpmonk.com";

const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sharpmonk",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  description:
    "Free, in-browser tools that resize exam photos and signatures to the exact pixels, file size and DPI each official notification specifies.",
  slogan: "Exam uploads, exactly right.",
  sameAs: ["https://upaman.com", "https://railmonk.com"],
  founder: {
    "@type": "Person",
    name: "Shravan Cherukuri",
    url: "https://www.linkedin.com/in/ch-shravan-kumar-b6a89974/",
  },
};

const WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sharpmonk",
  url: SITE_URL,
  publisher: { "@type": "Organization", name: "Sharpmonk" },
};

// Escaping `<` keeps any value containing markup from breaking out of the
// script tag — see the Next.js JSON-LD guide.
const ld = (schema: object) => JSON.stringify(schema).replace(/</g, "\\u003c");

export default function SiteStructuredData() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(ORGANIZATION) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(WEBSITE) }} />
    </>
  );
}
