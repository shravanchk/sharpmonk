import Link from "next/link";
import Icon, { type IconName } from "./Icon";
import IconBadge from "./IconBadge";

/**
 * In-article callout that links a guide to its matching calculator. Doubles
 * as a conversion nudge and an internal link from editorial content to the
 * tool pages (good for both users and crawl/link equity).
 */

type Props = {
  href: string;
  icon: IconName;
  title: string;
  body: string;
  cta?: string;
};

export default function GuideCTA({ href, icon, title, body, cta = "Open the calculator" }: Props) {
  return (
    <div className="glass-card my-8 flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <IconBadge name={icon} size={22} className="shrink-0" />
        <div>
          <p className="font-semibold tracking-tight">{title}</p>
          <p className="text-muted mt-1 text-sm leading-relaxed">{body}</p>
        </div>
      </div>
      <Link
        href={href}
        className="btn-glow inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
      >
        {cta}
        <Icon name="arrow-right" size={16} />
      </Link>
    </div>
  );
}
