// Собирает sitemap.xml из фактически отрендеренных страниц, чтобы список
// адресов не расходился с каталогом при добавлении новых позиций.
import { existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SITE_URL = "https://shop.romedov.by";
const root = resolve(import.meta.dirname, "..");

const candidates = [resolve(root, ".output/public"), resolve(root, ".vercel/output/static")];
const outputDir = candidates.find((path) => existsSync(resolve(path, "index.html")));

if (!outputDir) {
  console.error("sitemap: не найден каталог сборки со index.html");
  process.exit(1);
}

/** Приоритет и частота обновления по типу страницы. */
function describe(route) {
  if (route === "/") return { priority: "1.0", changefreq: "weekly" };
  if (route === "/catalog") return { priority: "0.9", changefreq: "weekly" };
  if (route.startsWith("/catalog/")) return { priority: "0.8", changefreq: "weekly" };
  if (route.startsWith("/product/")) return { priority: "0.7", changefreq: "monthly" };
  return { priority: "0.5", changefreq: "monthly" };
}

const SKIP = new Set(["/cart", "/checkout", "/search"]);

function collect(dir, prefix = "") {
  const routes = [];

  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);

    if (statSync(full).isDirectory()) {
      if (entry === "_build" || entry === "assets" || entry === "api") continue;
      routes.push(...collect(full, `${prefix}/${entry}`));
      continue;
    }

    if (entry !== "index.html") continue;
    routes.push(prefix === "" ? "/" : prefix);
  }

  return routes;
}

const routes = collect(outputDir)
  .filter((route) => !SKIP.has(route))
  .sort((a, b) => a.localeCompare(b));

const today = new Date().toISOString().slice(0, 10);

const body = routes
  .map((route) => {
    const { priority, changefreq } = describe(route);
    return [
      "  <url>",
      `    <loc>${SITE_URL}${route === "/" ? "/" : route}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n");
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync(resolve(outputDir, "sitemap.xml"), xml, "utf8");
console.log(`sitemap: записано ${routes.length} адресов в ${outputDir}/sitemap.xml`);
