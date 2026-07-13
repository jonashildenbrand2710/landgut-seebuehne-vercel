import type { Metadata } from "next";
import { imageLibrary, siteConfig } from "@/data/site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

export function absolutePageUrl(path: string) {
  return path === "/" ? `${siteConfig.domain}/` : `${siteConfig.domain}${path}`;
}

export function defaultOpenGraphImage() {
  return {
    url: `${siteConfig.domain}${imageLibrary.hero.src}`,
    width: 1920,
    height: 1277,
    alt: imageLibrary.hero.alt
  };
}

export function pageMetadata({ title, description, path, noindex = false }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: absolutePageUrl(path)
    },
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: "Landgut Seebühne",
      url: absolutePageUrl(path),
      title,
      description,
      images: [defaultOpenGraphImage()]
    },
    ...(noindex
      ? {
          robots: {
            index: false,
            follow: true
          }
        }
      : {})
  };
}
