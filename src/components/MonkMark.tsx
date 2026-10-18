import { LOGO_INNER } from "@/lib/logo";

type Props = {
  size?: number;
  className?: string;
};

/**
 * Sharpmonk mark — a monk meditating under a peepal tree, on the navy badge.
 * The artwork lives in lib/logo.ts, shared with the share cards and the
 * generated icon files, so every rendering of the logo stays identical.
 *
 * Fixed brand colors on purpose: like most logos it stays constant across
 * light/dark instead of repainting.
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
      dangerouslySetInnerHTML={{ __html: LOGO_INNER }}
    />
  );
}
