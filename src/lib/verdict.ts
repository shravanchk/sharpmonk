import type { EncodeResult, FileFacts } from "./imageEngine";
import type { Strings } from "./i18n";
import { safeWindow } from "./jpeg";
import type { ToolConfig } from "./toolConfig";

/** "34.2 KB", "2.41 MB" — decimal units, which is what file managers and
 *  most portals display. */
export function fmtSize(bytes: number) {
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${(bytes / 1000).toFixed(1)} KB`;
  return `${(bytes / 1_000_000).toFixed(2)} MB`;
}

const TYPE_NAME: Record<string, string> = {
  jpeg: "JPEG",
  png: "PNG",
  webp: "WebP",
  gif: "GIF",
  heic: "HEIC",
  pdf: "PDF",
  unknown: "?",
};

export type Check = { ok: boolean; text: string; detail?: string };

/** Why the file someone already has would, or wouldn't, pass. */
export function judgeOriginal(f: FileFacts, cfg: ToolConfig, s: Strings): Check[] {
  const c = s.check;
  const out: Check[] = [];
  const win = safeWindow(cfg.minKB, cfg.maxKB);
  const extJpeg = f.extension === "jpg" || f.extension === "jpeg";

  if (f.type !== "jpeg") {
    out.push(
      extJpeg
        ? { ok: false, text: c.renamed(TYPE_NAME[f.type], f.extension), detail: c.renamedDetail }
        : { ok: false, text: c.wrongType(TYPE_NAME[f.type]) },
    );
  } else {
    out.push({ ok: true, text: c.jpeg });
  }

  if (cfg.sizeMode === "exact") {
    const match = f.width === cfg.width && f.height === cfg.height;
    out.push({ ok: match, text: match ? c.px(f.width, f.height) : c.pxWants(f.width, f.height, cfg.width, cfg.height) });
  }

  const inside = f.bytes >= win.minBytes && f.bytes <= win.maxBytes;
  out.push({
    ok: inside,
    text: inside ? c.inside(fmtSize(f.bytes), cfg.minKB, cfg.maxKB) : c.sizeWants(fmtSize(f.bytes), cfg.minKB, cfg.maxKB),
  });

  if (cfg.dpi) {
    const ok = f.dpi === cfg.dpi;
    out.push({ ok, text: ok ? c.dpi(f.dpi) : c.dpiWants(f.dpi, cfg.dpi) });
  }
  return out;
}

/** The checklist for the file Sharpmonk produced. */
export function judgeResult(r: Extract<EncodeResult, { ok: true }>, cfg: ToolConfig, s: Strings): Check[] {
  const c = s.check;
  const win = safeWindow(cfg.minKB, cfg.maxKB);
  const out: Check[] = [
    { ok: true, text: c.jpegFile },
    {
      ok: cfg.sizeMode === "auto" || (r.width === cfg.width && r.height === cfg.height),
      text: c.px(r.width, r.height),
      detail: cfg.sizeMode === "auto" ? c.ownProps : undefined,
    },
    {
      ok: r.bytes >= win.minBytes && r.bytes <= win.maxBytes,
      text: c.insideDash(fmtSize(r.bytes), cfg.minKB, cfg.maxKB),
      detail: c.bothCounts(c.bytes(r.bytes)),
    },
  ];
  if (cfg.dpi) out.push({ ok: r.dpi === cfg.dpi, text: c.dpi(r.dpi), detail: c.dpiHeader });
  return out;
}
