import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, setCookie } from "@tanstack/react-start/server";

import {
  ADMIN_PASSWORD,
  ADMIN_SESSION_COOKIE,
  ADMIN_USERNAME,
  adminSessionToken,
} from "./constants.server";
import { isAdminSessionValid } from "./session.server";

type LoginPayload = { username: string; password: string };

export const fetchAdminSession = createServerFn({ method: "GET" }).handler(async () => ({
  authenticated: isAdminSessionValid(),
}));

export const adminLogin = createServerFn({ method: "POST" })
  .validator((data: LoginPayload) => {
    if (!data || typeof data !== "object") throw new Error("Неверный запрос");
    return {
      username: String(data.username ?? "").trim(),
      password: String(data.password ?? ""),
    };
  })
  .handler(async ({ data }) => {
    if (data.username !== ADMIN_USERNAME || data.password !== ADMIN_PASSWORD) {
      throw new Error("Неверный логин или пароль");
    }

    setCookie(ADMIN_SESSION_COOKIE, adminSessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(ADMIN_SESSION_COOKIE, { path: "/" });
  return { ok: true as const };
});
