import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PHP_CONFIG = join(process.cwd(), "public/api/config.php");

function pickPhpString(source: string, key: string): string {
  const pattern = new RegExp(`['"]${key}['"]\\s*=>\\s*['"]([^'"]*)['"]`, "i");
  return pattern.exec(source)?.[1]?.trim() ?? "";
}

/** Подхват legacy config.php, если в TS/JSON ещё пустые токены. */
export function readPhpLeadConfigPartial(): Record<string, string> {
  if (!existsSync(PHP_CONFIG)) return {};

  const source = readFileSync(PHP_CONFIG, "utf8");
  return {
    email_to: pickPhpString(source, "email_to"),
    email_from: pickPhpString(source, "email_from"),
    telegram_bot_token: pickPhpString(source, "telegram_bot_token"),
    telegram_chat_id: pickPhpString(source, "telegram_chat_id"),
  };
}
