import { ADMIN_SESSION_STORAGE_KEY, ADMIN_SESSION_VALUE } from "./constants";

export function isAdminSessionValid(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === ADMIN_SESSION_VALUE;
  } catch {
    return false;
  }
}

export function setAdminSession(): void {
  window.localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, ADMIN_SESSION_VALUE);
}

export function clearAdminSession(): void {
  window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
}

export function assertAdminSession(): void {
  if (!isAdminSessionValid()) {
    throw new Error("Требуется вход в админку");
  }
}
