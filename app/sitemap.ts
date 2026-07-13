import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";
import { allPages, isPublicSitePageSlug, siteConfig } from "@/data/site";

const lowPrioritySlugs = new Set(["impressum", "datenschutz", "formular", "kontaktformular"]);

function pagePriority(slug: string) {
  if (!slug) return 1;
  return lowPrioritySlugs.has(slug) ? 0.3 : 0.8;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = allPages
    .filter((page) => !page.noindex && isPublicSitePageSlug(page.slug))
    .map((page) => ({
      url: `${siteConfig.domain}${page.slug ? `/${page.slug}` : "/"}`,
      lastModified: now,
      changeFrequency: page.slug ? ("weekly" as const) : ("daily" as const),
      priority: pagePriority(page.slug)
    }));

  const articlePages = [
    {
      url: `${siteConfig.domain}/hochzeitsratgeber`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7
    },
    ...articles.map((article) => ({
      url: `${siteConfig.domain}/hochzeitsratgeber/${article.slug}`,
      lastModified: article.dateModified ? new Date(article.dateModified) : now,
      changeFrequency: "monthly" as const,
      priority: 0.65
    }))
  ];

  return [...pages, ...articlePages];
}
