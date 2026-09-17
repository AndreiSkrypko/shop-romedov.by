import { ADMIN_PASSWORD, ADMIN_USERNAME } from "./constants";
import { clearAdminSession, isAdminSessionValid, setAdminSession } from "./session";

type LoginPayload = { username: string; password: string };

export function fetchAdminSession(): { authenticated: boolean } {
  return { authenticated: isAdminSessionValid() };
}

export async function adminLogin(payload: LoginPayload): Promise<{ ok: true }> {
  const username = String(payload.username ?? "").trim();
  const password = String(payload.password ?? "");

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    throw new Error("Неверный логин или пароль");
  }

  setAdminSession();
  return { ok: true };
}

export async function adminLogout(): Promise<{ ok: true }> {
  clearAdminSession();
  return { ok: true };
}
