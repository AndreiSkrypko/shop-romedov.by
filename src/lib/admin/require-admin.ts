import { redirect } from "@tanstack/react-router";

import { fetchAdminSession } from "./admin-auth.functions";

export async function requireAdminSession(): Promise<void> {
  const session = await fetchAdminSession();
  if (!session.authenticated) {
    throw redirect({ to: "/admin/login" });
  }
}
