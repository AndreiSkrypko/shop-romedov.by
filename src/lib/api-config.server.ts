import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { leadDeliveryConfigToApi, type LeadDeliveryConfig } from "./lead-delivery.config";
import { readPhpLeadConfigPartial } from "./load-php-lead-config.server";

export type ApiLeadConfig = LeadDeliveryConfig;

const CONFIG_JSON = join(process.cwd(), "public/api/config.json");

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function readBool(value: unknown): boolean {
  return value === true || value === "true";
}

function normalizeRow(row: Record<string, unknown>): ApiLeadConfig {
  const email_to = readString(row["email_to"]);
  if (!email_to) {
    throw new Error("Укажите email_to в src/lib/lead-delivery.config.ts или public/api/config.json.");
  }

  return {
    email_to,
    email_from: readString(row["email_from"], "noreply@romedov.by"),
    telegram_bot_token: readString(row["telegram_bot_token"]),
    telegram_chat_id: readString(row["telegram_chat_id"]),
    smtp_host: readString(row["smtp_host"]),
    smtp_port: Number(row["smtp_port"] ?? 587) || 587,
    smtp_secure: readBool(row["smtp_secure"]),
    smtp_user: readString(row["smtp_user"]),
    smtp_pass: readString(row["smtp_pass"]),
  };
}

function loadJsonFileConfig(): Partial<Record<string, unknown>> | null {
  if (!existsSync(CONFIG_JSON)) return null;

  try {
    const parsed: unknown = JSON.parse(readFileSync(CONFIG_JSON, "utf8"));
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    throw new Error("public/api/config.json — неверный JSON.");
  }

  return null;
}

function applyNonEmpty(target: Record<string, unknown>, patch: Record<string, string>) {
  for (const [key, value] of Object.entries(patch)) {
    if (!value) continue;
    if (readString(target[key])) continue;
    target[key] = value;
  }
}

/** lead-delivery.config.ts → config.json → config.php (только непустые поля). */
export function loadApiLeadConfig(): ApiLeadConfig {
  const merged = { ...(leadDeliveryConfigToApi() as Record<string, unknown>) };
  const fromFile = loadJsonFileConfig();
  if (fromFile) {
    for (const [key, value] of Object.entries(fromFile)) {
      if (typeof value === "string" && value.trim() === "") continue;
      if (value !== undefined && value !== null) merged[key] = value;
    }
  }
  applyNonEmpty(merged, readPhpLeadConfigPartial());
  return normalizeRow(merged);
}
