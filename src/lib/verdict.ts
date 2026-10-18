import type { EncodeResult, FileFacts } from "./imageEngine";
import { safeWindow } from "./jpeg";
import type { ToolConfig } from "./toolConfig";

/** "34.2 KB", "2.41 MB" — decimal units, which is what file managers and
 *  most portals display. */
export function fmtSize(bytes: number) {
  if (bytes < 1000) return `${bytes} bytes`;
  if (bytes < 1_000_000) return `${(bytes / 1000).toFixed(1)} KB`;
  return `${(bytes / 1_000_000).toFixed(2)} MB`;
}

export const fmtBytes = (bytes: number) => `${bytes.toLocaleString("en-IN")} bytes`;

const TYPE_NAME: Record<string, string> = {
  jpeg: "JPEG",
  png: "PNG",
  webp: "WebP",
  gif: "GIF",
  heic: "HEIC",
  pdf: "PDF",
  unknown: "unrecognised",
};

export type Check = { ok: boolean; text: string; detail?: string };

/** Why the file someone already has would, or wouldn't, pass. */
export function judgeOriginal(f: FileFacts, cfg: ToolConfig): Check[] {
  const out: Check[] = [];
  const win = safeWindow(cfg.minKB, cfg.maxKB);
  const extJpeg = f.extension === "jpg" || f.extension === "jpeg";

  if (f.type !== "jpeg") {
    out.push({
      ok: false,
      text: extJpeg
        ? `It's really a ${TYPE_NAME[f.type]} file named .${f.extension}`
        : `It's a ${TYPE_NAME[f.type]} file; the form wants JPG / JPEG`,
      detail: extJpeg ? "Renaming doesn't convert a file, and portals check the contents." : undefined,
    });
  } else {
    out.push({ ok: true, text: "JPEG format" });
  }

  if (cfg.sizeMode === "exact") {
    const match = f.width === cfg.width && f.height === cfg.height;
    out.push({
      ok: match,
      text: match ? `${f.width} × ${f.height} px` : `${f.width} × ${f.height} px; the form wants ${cfg.width} × ${cfg.height}`,
    });
  }

  const inside = f.bytes >= win.minBytes && f.bytes <= win.maxBytes;
  out.push({
    ok: inside,
    text: inside
      ? `${fmtSize(f.bytes)}, inside ${cfg.minKB}–${cfg.maxKB} KB`
      : `${fmtSize(f.bytes)}; the form wants ${cfg.minKB > 0 ? `${cfg.minKB}–${cfg.maxKB} KB` : `under ${cfg.maxKB} KB`}`,
  });

  if (cfg.dpi) {
    const ok = f.dpi === cfg.dpi;
    out.push({ ok, text: ok ? `${f.dpi} DPI` : `DPI ${f.dpi ? `is ${f.dpi}` : "isn't set"}; the form states ${cfg.dpi}` });
  }
  return out;
}

/** The checklist for the file Sharpmonk produced. */
export function judgeResult(r: Extract<EncodeResult, { ok: true }>, cfg: ToolConfig): Check[] {
  const win = safeWindow(cfg.minKB, cfg.maxKB);
  const out: Check[] = [
    { ok: true, text: "JPEG format, .jpg file" },
    {
      ok: cfg.sizeMode === "auto" || (r.width === cfg.width && r.height === cfg.height),
      text: `${r.width} × ${r.height} px`,
      detail: cfg.sizeMode === "auto" ? "Your photo's own proportions." : undefined,
    },
    {
      ok: r.bytes >= win.minBytes && r.bytes <= win.maxBytes,
      text: `${fmtSize(r.bytes)} — inside ${cfg.minKB > 0 ? `${cfg.minKB}–${cfg.maxKB} KB` : `${cfg.maxKB} KB`}`,
      detail: `${fmtBytes(r.bytes)}. Passes whether the portal counts a KB as 1,000 or 1,024 bytes.`,
    },
  ];
  if (cfg.dpi) out.push({ ok: r.dpi === cfg.dpi, text: `${r.dpi ?? "No"} DPI`, detail: "Written into the file header." });
  return out;
}
