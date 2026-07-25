// Same card as Open Graph. Without this file the route would inherit the
// site-wide twitter-image.png and show the generic homepage card on X/Twitter.
//
// `dynamic` has to be declared literally here — Next statically parses it and
// rejects a re-export.
export const dynamic = "force-static";

export { default, alt, size, contentType } from "./opengraph-image";
