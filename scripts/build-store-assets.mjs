// Play Store listing art, from the logo source: the 1024 × 500 feature
// graphic. (The 512 px store icon, android/store_icon.png, comes from
// Bubblewrap; screenshots are taken from the running site, see
// android/README.md.)
//
// Run: node scripts/build-store-assets.mjs
import { writeFileSync } from "node:fs";
import sharp from "sharp";
import { LOGO_COLORS, LOGO_INNER } from "../src/lib/logo.ts";

const W = 1024;
const H = 500;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="78%" cy="20%" r="70%">
      <stop offset="0" stop-color="#2f6fed" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#2f6fed" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#05070d"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g transform="translate(96 140) scale(2.2)">${LOGO_INNER}</g>
  <text x="400" y="222" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="76" font-weight="700" fill="#ffffff" letter-spacing="-1.5">Sharpmonk</text>
  <text x="402" y="282" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="34" fill="${LOGO_COLORS.leaf}">Exam uploads, exactly right</text>
  <text x="402" y="336" font-family="Kohinoor Devanagari, Devanagari Sangam MN, Noto Sans Devanagari, sans-serif" font-size="30" fill="#c7d2e4">परीक्षा अपलोड, बिल्कुल सही साइज़ में</text>
</svg>`;

writeFileSync("android/store/feature-graphic.png", await sharp(Buffer.from(svg)).png().toBuffer());
console.log("android/store/feature-graphic.png");
