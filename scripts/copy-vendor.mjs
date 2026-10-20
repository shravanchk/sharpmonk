// Files the browser loads from a URL at run time, which a static export has
// no bundler to serve. Copied into public/vendor/ (gitignored) before dev and
// build, so each stays locked to the installed library's version.
//
// - pdf.js parses PDFs in a Web Worker.
// - MediaPipe runs the photo checks and background whitening in WebAssembly,
//   with two small models committed under assets/models (Apache-2.0, from
//   storage.googleapis.com/mediapipe-models).
//
// The service worker serves /vendor/ cache-first, so anything whose contents
// can change lives under a versioned path.
import { copyFileSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const pkgDir = (name) => dirname(require.resolve(`${name}/package.json`));

mkdirSync("public/vendor", { recursive: true });
copyFileSync(join(pkgDir("pdfjs-dist"), "build/pdf.worker.min.mjs"), "public/vendor/pdf.worker.min.mjs");

// Its exports hide package.json; the entry point sits at the package root.
const mp = dirname(require.resolve("@mediapipe/tasks-vision"));
const { version } = JSON.parse(readFileSync(join(mp, "package.json"), "utf8"));
const mpDir = `mediapipe-${version}`;
if (!readFileSync("src/lib/vision.ts", "utf8").includes(`/vendor/${mpDir}`)) {
  throw new Error(`@mediapipe/tasks-vision is ${version}; update the /vendor/mediapipe-… path in src/lib/vision.ts to match.`);
}
mkdirSync(`public/vendor/${mpDir}`, { recursive: true });
// Only the classic (non-module) loaders: forVisionTasks picks SIMD or not.
for (const f of ["vision_wasm_internal.js", "vision_wasm_internal.wasm", "vision_wasm_nosimd_internal.js", "vision_wasm_nosimd_internal.wasm"]) {
  copyFileSync(join(mp, "wasm", f), `public/vendor/${mpDir}/${f}`);
}

mkdirSync("public/vendor/models", { recursive: true });
for (const f of readdirSync("assets/models")) copyFileSync(join("assets/models", f), `public/vendor/models/${f}`);
