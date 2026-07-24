/**
 * Re-mounted on every navigation (see Next.js template.js convention),
 * so each route gets a fresh fade/slide/blur-in — the "fluid" feel of
 * moving between pages instead of an instant hard cut.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition flex flex-1 flex-col">{children}</div>;
}
