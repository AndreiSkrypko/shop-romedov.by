export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "romedov2026";
/** Должен совпадать с admin_secret в scripts/supabase-admin-rpc.sql */
export const ADMIN_RPC_SECRET = "romedov2026";

export const ADMIN_SESSION_STORAGE_KEY = "romedov_admin";

/** sha256(`romedov-admin:${ADMIN_USERNAME}:${ADMIN_PASSWORD}`) */
export const ADMIN_SESSION_VALUE =
  "da28ac3a2c39a52421b4223ed7b27dbb4cea54d856a49a7159c9c254fb82128b";
