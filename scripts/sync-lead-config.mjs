import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const { leadDeliveryConfigToApi } = await import(
  pathToFileURL(join(root, "src/lib/lead-delivery.config.ts")).href
);

const config = leadDeliveryConfigToApi();
const json = `${JSON.stringify(config, null, 2)}\n`;

const distTarget = join(root, "dist/api/config.json");
if (!existsSync(join(root, "dist"))) {
  console.warn("lead-config: dist/ не найден — пропуск (запускайте после vite build)");
  process.exit(0);
}

mkdirSync(dirname(distTarget), { recursive: true });
writeFileSync(distTarget, json, "utf8");

console.log("lead-config: записан dist/api/config.json");
