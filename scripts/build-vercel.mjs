import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npx", ["vite", "build"]);
run("node", ["scripts/generate-sitemap.mjs"]);

const candidates = [resolve(root, ".vercel/output/static"), resolve(root, "dist")];
const outputDir = candidates.find((path) => existsSync(resolve(path, "index.html")));

if (!outputDir) {
  console.error("Vercel build failed: static index.html not found.");
  for (const path of candidates) {
    console.error(`  checked: ${path}`);
  }
  process.exit(1);
}

console.log(`Vercel static build ready at ${outputDir}`);
