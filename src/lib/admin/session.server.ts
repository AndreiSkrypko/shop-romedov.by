import { getCookie } from "@tanstack/react-start/server";

import { ADMIN_SESSION_COOKIE, adminSessionToken } from "./constants.server";

export function isAdminSessionValid(): boolean {
  const cookie = getCookie(ADMIN_SESSION_COOKIE);
  if (!cookie) return false;
  return cookie === adminSessionToken();
}

export function assertAdminSession(): void {
  if (!isAdminSessionValid()) {
    throw new Error("Требуется вход в админку");
  }
}
