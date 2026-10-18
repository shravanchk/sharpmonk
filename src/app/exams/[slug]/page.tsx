import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQAccordion from "@/components/FAQAccordion";
import Icon from "@/components/Icon";
import ToolSchema from "@/components/ToolSchema";
import ExamWorkbench from "@/components/tool/ExamWorkbench";
import { EXAMS, examBySlug, kbRange, longDate, pxLabel, uploadsLabel, type ExamSpec } from "@/lib/specs";

export function generateStaticParams() {
  return EXAMS.map((e) => ({ slug: e.slug }));
}

function describe(e: ExamSpec) {
  const photo = e.docs.find((d) => d.kind === "photo");
  const sig = e.docs.find((d) => d.kind === "signature");
  const part = (d: typeof photo, name: string) => {
    const px = d && pxLabel(d);
    return d ? `${name} ${px ? `${px} px, ` : ""}${kbRange(d)}` : null;
  };
  return `${e.short} upload sizes from the official notification: ${[part(photo, "photo"), part(sig, "signature")].filter(Boolean).join("; ")}. Resize yours to fit exactly — in your browser, nothing uploaded.`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = examBySlug(slug);
  if (!e) return {};
  const title = `${e.short} ${uploadsLabel(e) === "signature" ? "Signature" : "Photo & Signature"} Size — Exact Resizer`;
  const description = describe(e);
  const path = `/exams/${e.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ExamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = examBySlug(slug);
  if (!e) notFound();
  const path = `/exams/${e.slug}`;
  const others = EXAMS.filter((x) => x.slug !== e.slug);

  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolSchema name={`${e.short} ${uploadsLabel(e)} resizer`} path={path} description={describe(e)} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Exams", href: "/exams" },
          { label: e.short, href: path },
        ]}
      />

      <header className="max-w-3xl">
        <span className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">{e.conductedBy}</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {e.short} {uploadsLabel(e)} resizer
        </h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">{e.summary}</p>
        <p className="mt-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-[var(--line-strong)] bg-[var(--surface-1)] px-4 py-1.5 text-xs">
          <Icon name="check" size={14} strokeWidth={2.2} className="text-[var(--positive)]" />
          Checked against the {e.source.title} ({e.source.issued}) on {longDate(e.verifiedOn)}
        </p>
      </header>

      {/* The numbers, before the tool, as plain crawlable HTML — the answer
          most people came for. */}
      <section aria-labelledby="spec-heading" className="mt-10">
        <h2 id="spec-heading" className="text-xl font-semibold tracking-tight">
          {e.short} upload specifications
        </h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--line)]">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-[var(--surface-1)] text-xs">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Upload</th>
                <th scope="col" className="px-4 py-3 font-medium">Pixels</th>
                <th scope="col" className="px-4 py-3 font-medium">File size</th>
                <th scope="col" className="px-4 py-3 font-medium">DPI</th>
                <th scope="col" className="px-4 py-3 font-medium">Format</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {e.docs.map((d) => (
                <tr key={d.kind}>
                  <th scope="row" className="px-4 py-3 font-medium">
                    {d.label}
                    {d.physical && <span className="text-muted block text-xs font-normal">{d.physical}</span>}
                  </th>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {d.statedPx ? (
                      <>
                        {d.statedPx.width} × {d.statedPx.height}
                        {d.statedPx.qualifier && <span className="text-muted"> ({d.statedPx.qualifier})</span>}
                      </>
                    ) : (
                      (d.statedPxText ?? <span className="text-muted">Not specified</span>)
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{kbRange(d)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {d.dpi ?? <span className="text-muted">—</span>}
                    {d.dpiStated && <span className="text-muted"> ({d.dpiStated})</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">JPG / JPEG</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-label="Resizer" className="glass-card mt-10 rounded-3xl p-4 sm:p-7">
        <ExamWorkbench docs={e.docs} />
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight">What the notification says</h2>
          <div className="mt-6 flex flex-col gap-8">
            {e.docs.map((d) => (
              <section key={d.kind}>
                <h3 className="font-semibold tracking-tight">{d.label}</h3>
                <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed">
                  {d.rules.map((r) => (
                    <li key={r} className="flex gap-2.5">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                      {r}
                    </li>
                  ))}
                </ul>
                {d.notes?.map((n) => (
                  <p key={n} className="text-muted mt-3 rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-3 text-xs leading-relaxed">
                    <span className="font-medium text-[var(--foreground)]">Sharpmonk note: </span>
                    {n}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <h2 className="mt-12 text-2xl font-semibold tracking-tight">Also required, not made here</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm leading-relaxed">
            {e.alsoRequired.map((r) => (
              <li key={r} className="flex gap-2.5">
                <Icon name="info" size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                {r}
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-2xl font-semibold tracking-tight">Questions</h2>
          <div className="mt-4">
            <FAQAccordion items={e.faqs} />
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-[var(--line)] p-5">
            <h2 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">Source</h2>
            <p className="mt-3 text-sm leading-relaxed">
              <a href={e.source.url} className="font-medium text-[var(--accent)] hover:underline" rel="noopener">
                {e.source.title}
              </a>
              <span className="text-muted block">
                {e.conductedBy} · {e.source.issued} · {e.source.pages}
              </span>
            </p>
            <p className="text-muted mt-3 text-xs leading-relaxed">
              Read on {longDate(e.verifiedOn)}. Notifications change between cycles — if yours says something different,
              follow it, and <Link href="/contact" className="text-[var(--accent)] hover:underline">tell us</Link> so we can update this page.
            </p>
          </div>

          {others.length > 0 && (
            <div className="rounded-2xl border border-[var(--line)] p-5">
              <h2 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">Other exams</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/exams/${o.slug}`} className="text-[var(--accent)] hover:underline">
                      {o.short} {uploadsLabel(o)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
