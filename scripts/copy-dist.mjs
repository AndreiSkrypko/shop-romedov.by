import { cpSync, existsSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const target = resolve(root, "dist");

const candidates = [resolve(root, ".output/public"), resolve(root, ".vercel/output/static")];

const source = candidates.find((path) => existsSync(resolve(path, "index.html")));

if (!source) {
  console.error("Build output not found — expected static files in .output/public");
  if (existsSync(resolve(root, ".output"))) {
    console.error(`.output contains: ${readdirSync(resolve(root, ".output")).join(", ")}`);
  }
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });
console.log(`Copied static build from ${source} to ${target}`);
