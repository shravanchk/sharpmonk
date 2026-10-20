/**
 * Lightweight line-icon set. One component, a name→path map, all drawn on a
 * 24×24 grid with `currentColor` strokes so icons inherit text color and
 * theme automatically. Replaces the emoji that previously stood in for
 * icons across the site — consistent stroke weight reads far more
 * professional than emoji ever did.
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
  | "mail"
  | "link"
  | "printer"
  | "search"
  | "image"
  | "pen"
  | "fingerprint"
  | "file-text"
  | "crop"
  | "rotate"
  | "download"
  | "upload"
  | "ruler"
  | "alert"
  | "x"
  | "sparkle"
  | "eye-off"
  | "camera"
  | "smartphone";

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
  link: (
    <>
      <path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7l-1.4 1.4" />
      <path d="M13.5 10.5a4 4 0 0 0-5.7 0L5 13.3a4 4 0 0 0 5.7 5.7l1.4-1.4" />
    </>
  ),
  printer: (
    <>
      <path d="M7 9V4.5h10V9" />
      <path d="M7 17.5H5.5A1.5 1.5 0 0 1 4 16v-5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a1.5 1.5 0 0 1-1.5 1.5H17" />
      <rect x="7" y="14" width="10" height="5.5" rx="1" />
    </>
  ),
  image: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m20 16-4.5-4.5L7 19" />
    </>
  ),
  pen: (
    <>
      <path d="M15.5 5.5 18.5 8.5 9 18l-4 1 1-4 9.5-9.5Z" />
      <path d="M4 21c3-1 5.5-.5 8 0s5 .5 8-1" />
    </>
  ),
  fingerprint: (
    <>
      <path d="M8.5 19.5c1-2 1.5-4.2 1.5-6.5a2 2 0 0 1 4 0c0 2.6-.4 5-1.3 7.2" />
      <path d="M5.6 16.5c.6-1.3.9-2.4.9-3.5a5.5 5.5 0 0 1 11 0c0 1.5-.1 2.9-.4 4.3" />
      <path d="M4.2 10.5A8 8 0 0 1 19.5 9" />
      <path d="M12 13c0 3-.7 5.7-2 8" />
    </>
  ),
  "file-text": (
    <>
      <path d="M14 3.5H7.5A1.5 1.5 0 0 0 6 5v14a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V7.5l-4-4Z" />
      <path d="M14 3.5v4h4M9 12h6M9 15.5h6M9 9h2" />
    </>
  ),
  crop: <path d="M7 3v13a1 1 0 0 0 1 1h13M3 7h13a1 1 0 0 1 1 1v13" />,
  rotate: (
    <>
      <path d="M19 12a7 7 0 1 1-2.05-4.95" />
      <path d="M19 4v4h-4" />
    </>
  ),
  download: <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14" />,
  upload: <path d="M12 16V5m0 0L7.5 9.5M12 5l4.5 4.5M5 19.5h14" />,
  ruler: (
    <>
      <path d="m3.5 15.5 12-12 5 5-12 12-5-5Z" />
      <path d="m7.5 11.5 2 2M10.5 8.5l2 2M13.5 5.5l2 2" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 2.8 19.5h18.4L12 4Z" />
      <path d="M12 10v4.5M12 17.3v.2" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6 6 18" />,
  camera: (
    <>
      <path d="M4 8.5h3.2l1.6-2.5h6.4l1.6 2.5H20a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.3" r="3.3" />
    </>
  ),
  smartphone: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </>
  ),
  sparkle: <path d="M12 3.5c.7 4.3 2.2 5.8 6.5 6.5-4.3.7-5.8 2.2-6.5 6.5-.7-4.3-2.2-5.8-6.5-6.5 4.3-.7 5.8-2.2 6.5-6.5ZM18.5 15.5c.3 1.6.9 2.2 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.3 2.2-.9 2.5-2.5Z" />,
  "eye-off": (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 8.5 4.5 9.5 6-.5.8-1.6 2.3-3.2 3.6M6.6 7.6C4.6 8.9 3.2 10.8 2.5 12c1 1.5 4.5 6 9.5 6 1.6 0 3-.4 4.3-1.1" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m15.8 15.8 3.7 3.7" />
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
