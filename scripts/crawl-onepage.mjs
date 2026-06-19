import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = "https://www.landgut-seebuehne.de";
const OUT_DIR = path.join(process.cwd(), "docs", "migration", "onepage-current");

function extractTag(html, pattern) {
  const match = html.match(pattern);
  return match?.[1]?.trim() ?? "";
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugToFilename(url) {
  const parsed = new URL(url);
  const slug = parsed.pathname === "/" ? "home" : parsed.pathname.replaceAll("/", "_").replace(/^_/, "");
  return `${slug || "home"}.html`;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Landgut-Seebuehne-Migration-Crawler/1.0"
    }
  });

  const text = await response.text();
  return {
    status: response.status,
    finalUrl: response.url,
    text
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.join(OUT_DIR, "pages"), { recursive: true });

  const sitemap = await fetchText(`${ROOT}/sitemap.xml`);
  const robots = await fetchText(`${ROOT}/robots.txt`);
  const llms = await fetchText(`${ROOT}/llms.txt`);

  await writeFile(path.join(OUT_DIR, "sitemap.xml"), sitemap.text);
  await writeFile(path.join(OUT_DIR, "robots.txt"), robots.text);
  await writeFile(path.join(OUT_DIR, "llms.txt"), llms.text);

  const urls = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  const pages = [];
  const mediaIds = new Set();

  for (const url of urls) {
    const page = await fetchText(url);
    await writeFile(path.join(OUT_DIR, "pages", slugToFilename(url)), page.text);

    const title = extractTag(page.text, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = extractTag(
      page.text,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i
    );
    const canonical = extractTag(
      page.text,
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i
    );

    for (const match of page.text.matchAll(/onecdn\.io\/media\/([0-9a-f-]+)/gi)) {
      mediaIds.add(match[1]);
    }
    for (const match of page.text.matchAll(/media\\u002F([0-9a-f-]+)/gi)) {
      mediaIds.add(match[1]);
    }

    pages.push({
      url,
      path: new URL(url).pathname,
      status: page.status,
      finalUrl: page.finalUrl,
      title,
      description,
      canonical,
      textSample: stripHtml(page.text).slice(0, 1200)
    });
  }

  const inventory = {
    crawledAt: new Date().toISOString(),
    root: ROOT,
    urls,
    pages,
    mediaIds: [...mediaIds].sort()
  };

  await writeFile(path.join(OUT_DIR, "inventory.json"), JSON.stringify(inventory, null, 2));
  console.log(`Crawled ${pages.length} pages and found ${inventory.mediaIds.length} media ids.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
