import type { NextConfig } from "next";

const canonicalSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.landgut-seebuehne.de").replace(
  /\/$/,
  ""
);
const canonicalHostname = new URL(canonicalSiteUrl).hostname;

const nextConfig: NextConfig = {
  images: {
    // Quellbilder sind maximal 1920px breit - groessere Varianten waeren nur Upscaling-Kandidaten.
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1440, 1920],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
    qualities: [60, 70, 72, 75, 85]
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ];
  },
  async redirects() {
    const canonicalDomainRedirects =
      canonicalHostname === "landgut-seebuehne.de"
        ? []
        : [
            {
              source: "/:path*",
              has: [
                {
                  type: "host" as const,
                  value: "landgut-seebuehne.de"
                }
              ],
              destination: `${canonicalSiteUrl}/:path*`,
              statusCode: 301
            }
          ];

    return [
      ...canonicalDomainRedirects,
      {
        source: "/ueber-uns",
        destination: "/uber-uns",
        statusCode: 301
      },
      {
        source: "/ratgeber",
        destination: "/hochzeitsratgeber",
        statusCode: 301
      },
      {
        source: "/journal",
        destination: "/hochzeitsratgeber",
        statusCode: 301
      },
      {
        source: "/journal/:slug",
        destination: "/hochzeitsratgeber/:slug",
        statusCode: 301
      },
      {
        source: "/blog",
        destination: "/hochzeitsratgeber",
        statusCode: 301
      },
      {
        source: "/blog/:slug",
        destination: "/hochzeitsratgeber/:slug",
        statusCode: 301
      },
      {
        source: "/hochzeitslocation-mittelfranken",
        destination: "/location",
        statusCode: 301
      },
      {
        source: "/:legacyPage(page-.+)",
        destination: "/",
        statusCode: 301
      }
    ];
  }
};

export default nextConfig;
