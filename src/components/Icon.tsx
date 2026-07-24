/**
 * Lightweight line-icon set. One component, a name→path map, all drawn on a
 * 24×24 grid with `currentColor` strokes so icons inherit text color and
 * theme automatically. Replaces the emoji that previously stood in for
 * icons across the site — consistent stroke weight reads far more
 * professional on a finance/insurance product.
 */

export type IconName =
  | "shield"
  | "heart-pulse"
  | "car"
  | "home"
  | "clipboard"
  | "briefcase"
  | "key"
  | "umbrella"
  | "paw"
  | "scale"
  | "bolt"
  | "lock"
  | "chart"
  | "check"
  | "arrow-right"
  | "chevron-right"
  | "sliders"
  | "calculator"
  | "globe"
  | "book"
  | "info"
  | "mail";

const PATHS: Record<IconName, React.ReactNode> = {
  shield: <path d="M12 3 5 6v5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z" />,
  "heart-pulse": (
    <>
      <path d="M19.5 12.6 12 20l-7.5-7.4A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 7.5 6.4Z" />
      <path d="M4 13h3l1.5-3 2 5 1.5-3h5" />
    </>
  ),
  car: (
    <>
      <path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13" />
      <path d="M4 13h16v4H4z" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </>
  ),
  home: <path d="M4 11.5 12 5l8 6.5M6 10v9h12v-9M10 19v-5h4v5" />,
  clipboard: (
    <>
      <path d="M9 4h6v3H9z" />
      <path d="M9 5.5H6.5A1.5 1.5 0 0 0 5 7v12a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V7a1.5 1.5 0 0 0-1.5-1.5H15" />
      <path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" />
    </>
  ),
  briefcase: (
    <>
      <path d="M4 8.5h16V19H4z" />
      <path d="M9 8.5V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5v2M4 13h16" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="8" r="3.5" />
      <path d="M10.5 10.5 20 20M17 17l2-2M14 14l2-2" />
    </>
  ),
  umbrella: (
    <>
      <path d="M12 4v2M4 12a8 8 0 0 1 16 0Z" />
      <path d="M12 12v6a2 2 0 0 0 4 0" />
    </>
  ),
  paw: (
    <>
      <circle cx="7" cy="9" r="1.6" />
      <circle cx="12" cy="7" r="1.6" />
      <circle cx="17" cy="9" r="1.6" />
      <path d="M12 11c2.4 0 4.5 1.8 4.5 4a2.5 2.5 0 0 1-2.5 2.5c-.8 0-1.4-.4-2-.4s-1.2.4-2 .4A2.5 2.5 0 0 1 7.5 15c0-2.2 2.1-4 4.5-4Z" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16M7 20h10M5 7h14M8 4l-4 8h8Zm0 0M16 4l4 8h-8Z" />
    </>
  ),
  bolt: <path d="M13 3 5 13h5l-1 8 8-10h-5l1-8Z" />,
  lock: (
    <>
      <path d="M6 11h12v9H6z" />
      <path d="M9 11V8a3 3 0 0 1 6 0v3" />
    </>
  ),
  chart: <path d="M4 20V4M4 20h16M8 20v-6M12 20v-9M16 20v-4" />,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "chevron-right": <path d="m9.5 6 6 6-6 6" />,
  sliders: (
    <>
      <path d="M4 8h10M18 8h2M4 16h4M12 16h8" />
      <circle cx="16" cy="8" r="2" />
      <circle cx="10" cy="16" r="2" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <path d="M8.5 7h7M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15h.01M12 15h.01M8.5 18.5h3.5M15.5 15v3.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5s-1.2 6.2-3.4 8.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5Z" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2.5 2.5 0 0 1 2 1 2.5 2.5 0 0 1 2-1h4.5A1.5 1.5 0 0 1 20 5.5v11a1.5 1.5 0 0 1-1.5 1.5H14a2.5 2.5 0 0 0-2 1 2.5 2.5 0 0 0-2-1H5.5A1.5 1.5 0 0 1 4 16.5Z" />
      <path d="M12 5v14" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.75h.01" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 8.2 6.3 4.4a2 2 0 0 0 2.4 0l6.3-4.4" />
    </>
  ),
};

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

export default function Icon({ name, size = 22, className = "", strokeWidth = 1.75 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}
