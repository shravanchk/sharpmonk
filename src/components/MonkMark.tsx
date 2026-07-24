type Props = {
  size?: number;
  className?: string;
};

/**
 * Sharpmonk mark — a hooded-monk bust in white on a navy rounded-square
 * badge, with a slow-breathing gold halo (.monk-halo, see globals.css).
 *
 * The silhouette is drawn as a tapered cowl with the face punched out as
 * negative space; that opening is what makes it read as a hooded figure
 * rather than a bell at 16px. The halo is load-bearing too — without it the
 * shape is indistinguishable from a generic account avatar.
 *
 * Fixed brand colors on purpose: like most logo "bugs" it stays constant
 * across light/dark instead of repainting, so it reads consistently
 * wherever it's placed. Keep this in sync with app/icon.svg,
 * public/favicon.svg and app/apple-icon-source.svg.
 */
export default function MonkMark({ size = 28, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Sharpmonk"
      className={`monk-mark ${className}`}
    >
      <rect x="2" y="2" width="96" height="96" rx="24" fill="#17325c" />
      <path
        d="M50 21C39 21 30 30 29 42L28.5 53C19.5 58.5 14 68.5 13 79C12.5 83.3 15.9 86.5 20 86.5H80C84.1 86.5 87.5 83.3 87 79C86 68.5 80.5 58.5 71.5 53L71 42C70 30 61 21 50 21Z"
        fill="#ffffff"
      />
      <path
        d="M50 32c-6.6 0-12 5.4-12 12v5c0 6.6 5.4 12 12 12s12-5.4 12-12v-5c0-6.6-5.4-12-12-12Z"
        fill="#17325c"
      />
      <path
        className="monk-halo"
        d="M35.5 13.5a14.5 4.2 0 0 1 29 0"
        stroke="#f4bb2b"
        strokeWidth="3.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
