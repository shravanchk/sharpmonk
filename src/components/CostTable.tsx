import Link from "next/link";
import type { CostTable as CostTableData } from "@/lib/longtail";

/**
 * A crawlable premium table.
 *
 * Deliberately a Server Component rendering a real `<table>`: the whole point
 * of these figures is that they sit in the HTML a crawler receives, rather
 * than behind a slider that only produces numbers after hydration. Rows that
 * correspond to a sibling generated page link to it, which is what connects
 * the grid into something crawlable from any entry point.
 *
 * Wide on a phone by nature, so the table scrolls inside its own container
 * rather than pushing the page sideways.
 */
export default function CostTable({ table }: { table: CostTableData }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold tracking-tight">{table.heading}</h2>
      <p className="text-muted mt-3 leading-relaxed">{table.intro}</p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[26rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--line-strong)] text-left">
              <th scope="col" className="text-muted py-2.5 pr-4 font-mono text-xs tracking-[0.14em] uppercase">
                {table.rowHeader}
              </th>
              <th scope="col" className="text-muted py-2.5 pr-4 text-right font-mono text-xs tracking-[0.14em] uppercase">
                Per month
              </th>
              <th scope="col" className="text-muted py-2.5 text-right font-mono text-xs tracking-[0.14em] uppercase">
                Per year
              </th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr
                key={row.label}
                className={`border-b border-[var(--line)] ${row.current ? "bg-[var(--surface-1)]" : ""}`}
              >
                <th scope="row" className="py-3 pr-4 text-left font-medium">
                  {row.href && !row.current ? (
                    <Link href={row.href} className="text-[var(--accent)] underline-offset-2 hover:underline">
                      {row.label}
                    </Link>
                  ) : (
                    <span className={row.current ? "text-[var(--foreground)]" : ""}>
                      {row.label}
                      {row.current && (
                        <span className="text-muted ml-2 font-mono text-[0.7rem] tracking-wide uppercase">
                          this page
                        </span>
                      )}
                    </span>
                  )}
                </th>
                <td className="py-3 pr-4 text-right tabular-nums">{row.monthly}</td>
                <td className="py-3 text-right tabular-nums">{row.annual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
