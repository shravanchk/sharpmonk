import type { DocPreset } from "@/components/tool/DocumentTool";
import { STRINGS, type Lang } from "./i18n";

/** PDF windows people are actually asked for. The exam-specific ones are the
 *  figures recorded (with sources) in specs.ts. */
export function pdfPresets(lang: Lang): DocPreset[] {
  const under = STRINGS[lang].tool.under;
  return [
    { label: `${under(500)} · IBPS`, minKB: 0, maxKB: 500 },
    { label: "50–300 KB · NTA, UPSC", minKB: 50, maxKB: 300 },
    { label: `${under(400)} · RRB`, minKB: 0, maxKB: 400 },
    ...[100, 200, 1000].map((max) => ({ label: under(max), minKB: 0, maxKB: max })),
  ];
}
