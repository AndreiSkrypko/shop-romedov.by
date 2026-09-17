import { createFileRoute } from "@tanstack/react-router";

import { AdminHelpPageContent } from "@/components/admin/AdminFieldInstructions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminSession } from "@/lib/admin/require-admin";

export const Route = createFileRoute("/admin/help")({
  beforeLoad: requireAdminSession,
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
    title: "Справка — админка",
  }),
  component: AdminHelpPage,
});

function AdminHelpPage() {
  return (
    <AdminShell
      title="Справка для администратора"
      subtitle="Как заполнять id, slug и остальные поля каталога."
    >
      <AdminHelpPageContent />
    </AdminShell>
  );
}
