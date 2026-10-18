// Writes every static logo file from the single source in src/lib/logo.ts:
//   src/app/icon.svg, public/favicon.svg   — the rounded badge
//   src/app/apple-icon-source.svg          — full-bleed square (iOS rounds it)
//   src/app/apple-icon.png (180)           — from the square
//   public/icon-192.png, public/icon-512.png — PWA icons, from the badge
//   src/app/favicon.ico (16, 32, 48)       — PNG-in-ICO, from the badge
//
// Run after editing src/lib/logo.ts:  node scripts/build-logo.mjs
import { writeFileSync } from "node:fs";
import sharp from "sharp";
import { logoSvg } from "../src/lib/logo.ts";

const badge = logoSvg("badge");
const square = logoSvg("square");

writeFileSync("src/app/icon.svg", badge + "\n");
writeFileSync("public/favicon.svg", badge + "\n");
writeFileSync("src/app/apple-icon-source.svg", square + "\n");

// Render well above the target size, then downscale: sharper edges on the leaves.
const png = (svg, size) =>
  sharp(Buffer.from(svg), { density: Math.max(72, (size / 100) * 72 * 4) })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();

writeFileSync("src/app/apple-icon.png", await png(square, 180));
writeFileSync("public/icon-192.png", await png(badge, 192));
writeFileSync("public/icon-512.png", await png(badge, 512));

// ICO container holding PNG images (supported by every current browser).
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(badge, s)));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((img, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(sizes[i], e); // width (0 would mean 256)
  header.writeUInt8(sizes[i], e + 1); // height
  header.writeUInt8(0, e + 2); // palette
  header.writeUInt8(0, e + 3); // reserved
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(img.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += img.length;
});
writeFileSync("src/app/favicon.ico", Buffer.concat([header, ...images]));

console.log("logo files written");
