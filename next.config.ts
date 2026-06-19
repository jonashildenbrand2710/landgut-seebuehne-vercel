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
        source: "/hochzeitsratgeber",
        destination: "/blog",
        statusCode: 301
      },
      {
        source: "/hochzeitsratgeber/:slug",
        destination: "/blog/:slug",
        statusCode: 301
      },
      {
        source: "/ratgeber",
        destination: "/blog",
        statusCode: 301
      },
      {
        source: "/journal",
        destination: "/blog",
        statusCode: 301
      },
      {
        source: "/journal/:slug",
        destination: "/blog/:slug",
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
