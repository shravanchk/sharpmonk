import Icon, { type IconName } from "./Icon";

/**
 * Colored icon tile. Each category icon maps to its own hue (ClearTax-style)
 * so tool grids read as a set of distinct, recognizable tiles rather than a
 * wall of identical blue. Colors are defined as .icon-badge--{color}
 * variants in globals.css and adapt to light/dark.
 */

const COLOR: Record<IconName, string> = {
  shield: "blue",
  "heart-pulse": "rose",
  car: "teal",
  home: "amber",
  clipboard: "violet",
  briefcase: "indigo",
  key: "amber",
  umbrella: "teal",
  paw: "pink",
  scale: "green",
  bolt: "amber",
  lock: "blue",
  chart: "violet",
  check: "green",
  "arrow-right": "blue",
  "chevron-right": "blue",
  sliders: "blue",
  calculator: "indigo",
  globe: "teal",
  book: "violet",
  info: "blue",
  mail: "rose",
  link: "blue",
  printer: "indigo",
  search: "blue",
  image: "blue",
  pen: "violet",
  fingerprint: "teal",
  "file-text": "amber",
  crop: "indigo",
  rotate: "blue",
  download: "green",
  upload: "blue",
  ruler: "amber",
  alert: "rose",
  x: "rose",
  sparkle: "violet",
  "eye-off": "green",
};

type Props = {
  name: IconName;
  size?: number;
  badgeSize?: "lg" | "sm";
  className?: string;
};

export default function IconBadge({ name, size = 22, badgeSize = "lg", className = "" }: Props) {
  return (
    <span className={`icon-badge icon-badge-${badgeSize} icon-badge--${COLOR[name]} ${className}`.trim()}>
      <Icon name={name} size={size} />
    </span>
  );
}
