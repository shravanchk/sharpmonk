import type { IconName } from "@/components/Icon";
import { EXAMS } from "./specs";

/**
 * The site's catalogue: one entry per page that does something. The home
 * page, footer, share cards and sitemap all read from here, so a new tool or
 * exam needs adding in one place.
 */

export type Entry = { href: string; title: string; body: string; icon: IconName };

export const TOOLS: Entry[] = [
  {
    href: "/resize-image-to-kb",
    title: "Resize image to KB",
    body: "Land a photo inside any file-size window — under 20 KB, 20–50 KB, whatever the form says — at exact pixels or its own proportions.",
    icon: "ruler",
  },
  {
    href: "/signature-resize",
    title: "Signature resizer",
    body: "Turn a phone photo of your signature into clean dark ink on white paper, at the exact pixels and KB a form asks for.",
    icon: "pen",
  },
];

export const EXAM_ENTRIES: Entry[] = EXAMS.map((e) => ({
  href: `/exams/${e.slug}`,
  title: `${e.short} photo & signature`,
  body: e.summary,
  icon: "image",
}));
