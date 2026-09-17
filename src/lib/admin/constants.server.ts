import { createHash } from "node:crypto";

export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "romedov2026";
/** Должен совпадать с admin_secret в scripts/supabase-schema.sql */
export const ADMIN_RPC_SECRET = "romedov2026";

export const ADMIN_SESSION_COOKIE = "romedov_admin";

export function adminSessionToken(): string {
  return createHash("sha256")
    .update(`romedov-admin:${ADMIN_USERNAME}:${ADMIN_PASSWORD}`)
    .digest("hex");
}
