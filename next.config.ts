import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export -> plain HTML/CSS/JS in ./out, served directly by Cloudflare Pages.
  // If we later need SSR, API routes or middleware, swap this for @opennextjs/cloudflare.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
