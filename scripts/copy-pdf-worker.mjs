// pdf.js parses PDFs in a Web Worker, loaded from a URL at run time. A static
// export has no bundler-served worker, so copy the one that ships with the
// installed pdfjs-dist into public/ before dev and build. Copying (rather than
// committing the file) keeps the worker's version locked to the library's.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const pkgDir = dirname(require.resolve("pdfjs-dist/package.json"));
mkdirSync("public/vendor", { recursive: true });
copyFileSync(join(pkgDir, "build/pdf.worker.min.mjs"), "public/vendor/pdf.worker.min.mjs");
