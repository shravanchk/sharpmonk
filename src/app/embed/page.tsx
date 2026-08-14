import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import EmbedSnippet from "@/components/EmbedSnippet";
import IconBadge from "@/components/IconBadge";
import { EMBEDDABLE, embedSnippet } from "@/lib/embeds";

const title = "Embed a Sharpmonk Calculator on Your Site — Free";
const description =
  "Add a free insurance calculator to your blog or site with one line of HTML. No signup, no tracking scripts, no cost — just attribution back to Sharpmonk.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/embed" },
  openGraph: { title, description, url: "/embed", type: "article" },
  twitter: { card: "summary_large_image", title, description },
};

export default function EmbedGalleryPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Embed", href: "/embed" }]} />

        <div className="mb-5">
          <IconBadge name="sliders" size={24} />
        </div>
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
          For publishers
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Put one of these calculators on your site
        </h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          Free to use, on any site, commercial or not. Copy the snippet, paste
          it into a post, and your readers get a working calculator instead of a
          table of numbers they have to interpret themselves.
        </p>

        <ul className="text-muted mt-8 grid gap-3 text-sm sm:grid-cols-3">
          {[
            ["No signup", "No key, no account, nothing to configure."],
            ["No tracking", "The calculation runs in your reader's browser."],
            ["Stays current", "We update the tool; your embed follows."],
          ].map(([head, body]) => (
            <li key={head} className="glass-card rounded-xl p-4">
              <span className="block font-medium text-[var(--foreground)]/95">{head}</span>
              <span className="mt-1 block leading-relaxed">{body}</span>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col gap-10">
          {EMBEDDABLE.map((embed) => (
            <EmbedSnippet key={embed.slug} embed={embed} snippet={embedSnippet(embed)} />
          ))}
        </div>

        <section className="mt-16 border-t border-[var(--line)] pt-10">
          <h2 className="text-lg font-semibold tracking-tight">Terms, briefly</h2>
          <ul className="text-muted mt-4 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed">
            <li>Keep the attribution link that ships with the embed.</li>
            <li>
              Don&apos;t present the output as a quote — every figure is an
              illustrative estimate from generic rating factors.
            </li>
            <li>Don&apos;t modify the iframe contents or wrap it in your own branding.</li>
            <li>
              We may change or retire a calculator; embeds point at the live
              version rather than a snapshot.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
