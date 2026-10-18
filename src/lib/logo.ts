/**
 * The Sharpmonk mark: a monk meditating under a peepal (Bodhi) tree — the
 * leaves for clarity, the still figure for focus. One source for every place
 * the logo appears: MonkMark (header, footer), share cards, and the icon
 * files that scripts/build-logo.mjs writes (favicon, app icons, ICO).
 *
 * Edit the shapes here, then run `node scripts/build-logo.mjs` to refresh the
 * static icon files. Kept free of React and DOM APIs so that script can
 * import it directly.
 *
 * The figure is deliberately a generic monk, not the Buddha: no topknot or
 * other iconography of the Buddha himself.
 */

export const LOGO_COLORS = {
  plate: "#17325c",
  leaf: "#3f9a6b",
  leafDeep: "#2b7553",
  figure: "#ffffff",
};

/** One peepal leaf, pointing up, centred on the origin (~19 × 22 units). */
const LEAF = "M0 -13C1 -8 3 -6 5.5 -3.5C9 0 9.5 4 7.5 6.5C5.5 9 2 9 0 7C-2 9 -5.5 9 -7.5 6.5C-9.5 4 -9 0 -5.5 -3.5C-3 -6 -1 -8 0 -13Z";

/** Two rings of leaves fanned around (50, 48), each pointing outward, so the
 *  canopy reads as a dome at any size. Alternating shades give it depth. */
function canopy(): string {
  const rings = [
    { radius: 30, angles: [-80, -48, -16, 16, 48, 80], scale: 1 },
    { radius: 17, angles: [-55, -18, 18, 55], scale: 0.95 },
  ];
  let out = "";
  let k = 0;
  for (const ring of rings) {
    for (const a of ring.angles) {
      const t = ((a - 90) * Math.PI) / 180;
      const x = (50 + ring.radius * Math.cos(t)).toFixed(2);
      const y = (48 + ring.radius * Math.sin(t)).toFixed(2);
      const fill = k++ % 2 ? LOGO_COLORS.leafDeep : LOGO_COLORS.leaf;
      out += `<path d="${LEAF}" fill="${fill}" transform="translate(${x} ${y}) rotate(${a}) scale(${ring.scale})"/>`;
    }
  }
  return out;
}

const FIGURE =
  `<g transform="translate(0 2)">` +
  `<circle cx="50" cy="44" r="8.5" fill="${LOGO_COLORS.figure}"/>` +
  `<path d="M50 55c-9 0-14 6-15.5 14L32 78c-7 1.5-10 4-10 7 0 3 3 5 8 5h40c5 0 8-2 8-5 0-3-3-5.5-10-7l-2.5-9C64 61 59 55 50 55Z" fill="${LOGO_COLORS.figure}"/>` +
  `</g>`;

/** Everything inside the plate, in a 0–100 viewBox. */
export const LOGO_ART = `<g class="monk-canopy">${canopy()}</g>${FIGURE}`;

/** The rounded-square badge used on the site and in favicons. */
export const LOGO_INNER = `<rect x="2" y="2" width="96" height="96" rx="24" fill="${LOGO_COLORS.plate}"/>${LOGO_ART}`;

/** Full-bleed variant for app icons, where the OS applies its own mask. */
export const LOGO_INNER_SQUARE = `<rect width="100" height="100" fill="${LOGO_COLORS.plate}"/>${LOGO_ART}`;

export function logoSvg(variant: "badge" | "square" = "badge"): string {
  const inner = variant === "square" ? LOGO_INNER_SQUARE : LOGO_INNER;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Sharpmonk">${inner}</svg>`;
}
