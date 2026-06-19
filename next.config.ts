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
        source: "/page-j4jy8j2l17",
        destination: "/",
        statusCode: 301
      },
      {
        source: "/page-2i9tl81gd9",
        destination: "/",
        statusCode: 301
      },
      {
        source: "/page-ha0a71x0wl",
        destination: "/",
        statusCode: 301
      }
    ];
  }
};

export default nextConfig;
