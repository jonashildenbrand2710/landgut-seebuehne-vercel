import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const INVENTORY = path.join(process.cwd(), "docs", "migration", "onepage-current", "inventory.json");
const OUT_DIR = path.join(process.cwd(), "public", "images", "onepage", "raw");
const MANIFEST = path.join(process.cwd(), "src", "data", "generated", "onepage-images.json");
const SIZES = ["xlg2x", "xlg", "lg2x", "lg", "md2x", "md", "sm2x", "sm"];

function extensionFor(contentType) {
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("svg")) return "svg";
  return "jpg";
}

async function tryDownload(id) {
  for (const size of SIZES) {
    const url = `https://onecdn.io/media/${id}/${size}`;
    const response = await fetch(url, {
      headers: {
        "user-agent": "Landgut-Seebuehne-Migration-Crawler/1.0"
      }
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || !contentType.startsWith("image/")) continue;

    const ext = extensionFor(contentType);
    const bytes = Buffer.from(await response.arrayBuffer());
    const filename = `${id}.${ext}`;
    await writeFile(path.join(OUT_DIR, filename), bytes);
    return {
      id,
      source: url,
      localPath: `/images/onepage/raw/${filename}`,
      contentType,
      size: bytes.length
    };
  }

  return {
    id,
    error: "No downloadable image variant found"
  };
}

async function main() {
  const inventory = JSON.parse(await readFile(INVENTORY, "utf8"));
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  const results = [];
  for (const id of inventory.mediaIds) {
    const result = await tryDownload(id);
    results.push(result);
    if ("localPath" in result) {
      console.log(`Downloaded ${result.localPath}`);
    } else {
      console.log(`Skipped ${id}`);
    }
  }

  await writeFile(MANIFEST, JSON.stringify(results, null, 2));
  const ok = results.filter((result) => "localPath" in result).length;
  console.log(`Downloaded ${ok}/${results.length} media files.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
