import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
    qualities: [60, 70, 72, 75]
  },
  async redirects() {
    return [
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
