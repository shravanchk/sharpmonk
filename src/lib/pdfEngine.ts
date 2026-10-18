/**
 * Builds a PDF inside a byte window from scanned pages — the PDF counterpart
 * of imageEngine.ts. Browser-only; nothing leaves the device.
 *
 * Exam portals ask for certificates as PDFs of, say, 50–300 KB. A phone scan
 * is several MB. The only lever that reliably shrinks a scan is re-rendering
 * each page as a JPEG at a chosen resolution and quality, so that is what this
 * does: every page — from a PDF or a photo — is drawn onto an A4 canvas at a
 * DPI, encoded, and placed on an A4 page with pdf-lib. Resolution and quality
 * are searched together, preferring to keep text sharp (DPI) over keeping
 * JPEG quality high.
 *
 * pdf.js and pdf-lib are large, so both are imported on demand and never load
 * on pages that don't use them.
 */

import { safeWindow } from "./jpeg";
import { decodeFile, render, rotate, type Source } from "./imageEngine";

/* ----------------------------------------------------------------------
   Pages
   ---------------------------------------------------------------------- */

/** One page of the output: an image, or page `index` of a loaded PDF. */
export type PageSource =
  | { kind: "image"; source: Source; turns: number }
  | { kind: "pdf"; doc: PdfDoc; index: number; turns: number };

type PdfDoc = { numPages: number; getPage: (n: number) => Promise<PdfPage>; destroy: () => Promise<void> };
type PdfPage = {
  getViewport: (o: { scale: number; rotation?: number }) => { width: number; height: number };
  render: (o: { canvas: HTMLCanvasElement; viewport: unknown }) => { promise: Promise<void> };
  rotate: number;
};

let pdfjs: Promise<typeof import("pdfjs-dist")> | null = null;

function loadPdfjs() {
  if (!pdfjs) {
    pdfjs = import("pdfjs-dist").then((m) => {
      // Copied into public/ at build time by scripts/copy-pdf-worker.mjs.
      m.GlobalWorkerOptions.workerSrc = "/vendor/pdf.worker.min.mjs";
      return m;
    });
  }
  return pdfjs;
}

export class PdfOpenError extends Error {}

/** Turns a dropped file into pages: every page of a PDF, or one image. */
export async function filePages(file: File): Promise<PageSource[]> {
  const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const isPdf = String.fromCharCode(...head) === "%PDF-";
  if (!isPdf) return [{ kind: "image", source: await decodeFile(file), turns: 0 }];

  const lib = await loadPdfjs();
  try {
    const doc = (await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise) as unknown as PdfDoc;
    return Array.from({ length: doc.numPages }, (_, index) => ({ kind: "pdf" as const, doc, index, turns: 0 }));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    throw new PdfOpenError(
      /password/i.test(msg)
        ? "This PDF is password-protected. Remove the password (open it and print to a new PDF), then try again."
        : "This PDF couldn't be opened. It may be damaged.",
    );
  }
}

/** A4 at 72 points per inch. */
const A4_PT = { w: 595.28, h: 841.89 };

export type PageOptions = {
  /** Flatten paper to white and ink dark — for phone photos of documents. */
  cleanInk: boolean;
  /** Grey only: a little smaller, and how most certificates are scanned. */
  grayscale: boolean;
};

/** Renders one page onto a white A4 canvas at `dpi`, fitted without cropping. */
async function renderPage(p: PageSource, dpi: number, opts: PageOptions): Promise<HTMLCanvasElement> {
  const pageW = Math.round((A4_PT.w / 72) * dpi);
  const pageH = Math.round((A4_PT.h / 72) * dpi);

  let src: Source;
  if (p.kind === "image") {
    src = rotate(p.source, p.turns);
  } else {
    const page = await p.doc.getPage(p.index + 1);
    const base = page.getViewport({ scale: 1, rotation: (page.rotate + p.turns * 90) % 360 });
    // Render straight at the size it will occupy on the A4 page, so the
    // text is rasterised once, at the final resolution.
    const fit = Math.min(pageW / base.width, pageH / base.height);
    const viewport = page.getViewport({ scale: fit, rotation: (page.rotate + p.turns * 90) % 360 });
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(viewport.width));
    c.height = Math.max(1, Math.round(viewport.height));
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    await page.render({ canvas: c, viewport }).promise;
    src = { image: c, width: c.width, height: c.height, release: () => {} };
  }
  // The cleanup runs inside render(), on the photographed region only: run
  // over the whole A4 canvas it would measure paper against the white
  // margins and blacken the edges of a dark photo.
  const out = render(src, pageW, pageH, {
    fit: "contain",
    framing: { zoom: 1, cx: 0.5, cy: 0.5 },
    cleanInk: opts.cleanInk,
  });
  if (opts.grayscale && !opts.cleanInk) toGray(out.getContext("2d", { willReadFrequently: true })!, pageW, pageH);
  return out;
}

function toGray(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  ctx.putImageData(img, 0, 0);
}

function jpeg(canvas: HTMLCanvasElement, q: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? b.arrayBuffer().then((a) => resolve(new Uint8Array(a)), reject) : reject(new Error("JPEG encoding failed"))),
      "image/jpeg",
      q,
    ),
  );
}

/* ----------------------------------------------------------------------
   Assembly and the search
   ---------------------------------------------------------------------- */

async function assemble(jpegs: Uint8Array[], padTo = 0): Promise<Uint8Array> {
  const { PDFDocument, PDFName } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  doc.setProducer("sharpmonk.com");
  doc.setCreator("sharpmonk.com");
  for (const bytes of jpegs) {
    const img = await doc.embedJpg(bytes);
    const page = doc.addPage([A4_PT.w, A4_PT.h]);
    page.drawImage(img, { x: 0, y: 0, width: A4_PT.w, height: A4_PT.h });
  }
  let out = await doc.save({ useObjectStreams: false });

  if (padTo > out.length) {
    // Same idea as the JPEG comment padding: an unreferenced stream object,
    // which every reader ignores, brings a small document up to a portal's
    // minimum. Its exact overhead varies, so measure and correct once.
    let fill = padTo - out.length - 64;
    for (let attempt = 0; attempt < 3 && fill > 0; attempt++) {
      const padded = await PDFDocument.load(out);
      const stream = padded.context.stream(new Uint8Array(fill).fill(0x20), { Type: PDFName.of("SharpmonkPadding") });
      padded.context.register(stream);
      const candidate = await padded.save({ useObjectStreams: false });
      if (candidate.length >= padTo) {
        out = candidate;
        break;
      }
      fill += padTo - candidate.length;
    }
  }
  return out;
}

export type PdfTarget = { minKB: number; maxKB: number };

/** Progress, as data — the UI words it in the reader's language. */
export type PdfProgress =
  | { stage: "render"; pages: number; dpi: number }
  | { stage: "fit"; maxKB: number; dpi: number }
  | { stage: "build" };

export type PdfResult =
  | { ok: true; blob: Blob; bytes: number; pages: number; dpi: number; quality: number; padded: boolean }
  | { ok: false; reason: string };

/** Highest DPI first; 150 keeps small print readable, 72 is the last resort. */
const DPI_STEPS = [150, 120, 100, 85, 72];
const QUALITY_FLOOR = 0.5;

export async function buildPdf(
  pages: PageSource[],
  target: PdfTarget,
  opts: PageOptions,
  onProgress?: (p: PdfProgress) => void,
  signal?: { cancelled: boolean },
): Promise<PdfResult> {
  if (pages.length === 0) return { ok: false, reason: "Add at least one page." };
  const win = safeWindow(target.minKB, target.maxKB);

  // Each page is encoded separately; the PDF wrapper adds a small, stable
  // overhead, which we measure once and then treat as constant.
  const sizeAt = async (canvases: HTMLCanvasElement[], q: number) => {
    const parts = await Promise.all(canvases.map((c) => jpeg(c, q)));
    return { parts, total: parts.reduce((n, p) => n + p.length, 0) };
  };

  let overhead = 0;
  let fallback: { parts: Uint8Array[]; dpi: number; q: number } | null = null;

  for (const dpi of DPI_STEPS) {
    if (signal?.cancelled) return { ok: false, reason: "Cancelled." };
    onProgress?.({ stage: "render", pages: pages.length, dpi });
    const canvases: HTMLCanvasElement[] = [];
    for (const p of pages) canvases.push(await renderPage(p, dpi, opts));

    if (!overhead) {
      const probe = await sizeAt(canvases, 0.5);
      overhead = (await assemble(probe.parts)).length - probe.total;
    }
    const limit = win.maxBytes - overhead;

    onProgress?.({ stage: "fit", maxKB: target.maxKB, dpi });
    let best: { parts: Uint8Array[]; q: number } | null = null;
    const top = await sizeAt(canvases, 0.92);
    if (top.total <= limit) {
      best = { parts: top.parts, q: 0.92 };
    } else {
      let lo = 0.2;
      let hi = 0.92;
      for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        const r = await sizeAt(canvases, mid);
        if (r.total <= limit) {
          best = { parts: r.parts, q: mid };
          lo = mid;
        } else hi = mid;
      }
    }

    if (best && best.q >= QUALITY_FLOOR) return finish(best.parts, dpi, best.q);
    if (best && !fallback) fallback = { ...best, dpi };
  }

  if (fallback) return finish(fallback.parts, fallback.dpi, fallback.q);
  return {
    ok: false,
    reason: `${pages.length} pages can't fit in ${target.maxKB} KB even at 72 DPI and low quality. Remove pages, or split the document.`,
  };

  async function finish(parts: Uint8Array[], dpi: number, quality: number): Promise<PdfResult> {
    onProgress?.({ stage: "build" });
    let out = await assemble(parts);
    let padded = false;
    if (out.length < win.minBytes) {
      out = await assemble(parts, win.minBytes + Math.min(2048, Math.round((win.maxBytes - win.minBytes) * 0.1)));
      padded = true;
    }
    if (out.length > win.maxBytes) {
      return { ok: false, reason: `Came to ${(out.length / 1000).toFixed(1)} KB, over the ${target.maxKB} KB limit. Try fewer pages.` };
    }
    return {
      ok: true,
      blob: new Blob([out as BlobPart], { type: "application/pdf" }),
      bytes: out.length,
      pages: parts.length,
      dpi,
      quality,
      padded,
    };
  }
}

/** A small preview of a page for the page list. */
export async function thumbnail(p: PageSource, opts: PageOptions): Promise<string> {
  const c = await renderPage(p, 20, opts);
  return c.toDataURL("image/jpeg", 0.7);
}
