/**
 * Article JSON-LD for guide / editorial pages. Gives the content an author,
 * publisher, publish/modified dates and a canonical mainEntityOfPage —
 * signals search engines use for article rich results and freshness.
 */

const SITE_URL = "https://sharpmonk.com";

type Props = {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
};

export default function ArticleSchema({ headline, description, path, datePublished, dateModified }: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: `${SITE_URL}/opengraph-image.png`,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: { "@type": "Organization", name: "Sharpmonk", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Sharpmonk",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${path}` },
  };

  return (
    <script
      type="application/ld+json"
      // Escaping `<` keeps a headline containing markup from breaking out of
      // the script tag — see the Next.js JSON-LD guide.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}
