/** Подключение к Supabase (publishable key — чтение каталога при RLS). */
export const SUPABASE_URL = "https://iwobtaovpqvdrbedbzzk.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_eYUf7beFuRo14pIWgKp10Q_NNo4Z3JH";

/** Secret key — только сервер (.env → SUPABASE_SECRET_KEY). Не коммитить в git. */
export function getSupabaseSecretKey(): string {
  if (typeof process === "undefined") return "";
  return process.env["SUPABASE_SECRET_KEY"]?.trim() ?? "";
}
