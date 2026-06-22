import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
