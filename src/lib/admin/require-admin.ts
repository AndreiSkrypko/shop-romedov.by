import { redirect } from "@tanstack/react-router";

import { fetchAdminSession } from "./admin-auth";

export async function requireAdminSession(): Promise<void> {
  if (typeof window === "undefined") return;

  const session = fetchAdminSession();
  if (!session.authenticated) {
    throw redirect({ to: "/admin/login" });
  }
}
