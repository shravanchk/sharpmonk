/**
 * Layout for the framed calculator pages.
 *
 * App Router allows exactly one root layout, so the site header, footer and
 * consent banner are already in the tree by the time this renders. Rather than
 * splitting the whole app into route groups for the sake of four pages, this
 * marks the subtree and `globals.css` hides the site chrome whenever that
 * marker is present (`body:has(.embed-root)`). The result is a page that is
 * nothing but the tool, which is what a publisher framing it wants.
 *
 * It sits on `[slug]` rather than on `/embed` so the gallery at `/embed`,
 * which is an ordinary indexable page, keeps its header and footer.
 */
export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return <div className="embed-root">{children}</div>;
}
