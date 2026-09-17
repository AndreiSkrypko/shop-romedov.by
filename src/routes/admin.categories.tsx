import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { AlertTriangle, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminCatalogThumb } from "@/components/admin/AdminCatalogThumb";
import { AdminFieldInstructions } from "@/components/admin/AdminFieldInstructions";
import { AdminFormScreen } from "@/components/admin/AdminFormScreen";
import { AdminShell } from "@/components/admin/AdminShell";
import { CategoryForm } from "@/components/admin/CategoryForm";
import {
  adminCreateCategory,
  adminDeleteCategory,
  adminGetCatalogSnapshot,
  adminUpdateCategory,
} from "@/lib/admin/admin-catalog.functions";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { adminCardClass } from "@/lib/admin/ui";
import type { Category } from "@/lib/catalog/types";

export const Route = createFileRoute("/admin/categories")({
  beforeLoad: requireAdminSession,
  loader: () => adminGetCatalogSnapshot(),
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
    title: "Категории — админка",
  }),
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const router = useRouter();
  const snapshot = Route.useLoaderData();
  const [panel, setPanel] = useState<"none" | "create" | "edit">("none");
  const [editing, setEditing] = useState<Category | null>(null);
  const [filter, setFilter] = useState("");
  const formOpen = panel !== "none";

  const closeForm = () => {
    setPanel("none");
    setEditing(null);
  };

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return snapshot.categories;
    return snapshot.categories.filter(
      (row) =>
        row.category.name.toLowerCase().includes(q) ||
        row.category.slug.toLowerCase().includes(q),
    );
  }, [filter, snapshot.categories]);

  const refresh = async () => {
    await router.invalidate();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить категорию «${name}»? Товары и подкатегории нужно удалить или перенести отдельно.`)) return;
    try {
      await adminDeleteCategory({ data: { id } });
      toast.success("Категория удалена");
      closeForm();
      await refresh();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Не удалось удалить");
    }
  };

  return (
    <AdminShell
      title={
        formOpen
          ? panel === "create"
            ? "Новая категория"
            : (editing?.name ?? "Редактирование категории")
          : "Категории"
      }
      subtitle={
        formOpen
          ? "Сохраните изменения или вернитесь к списку."
          : "Верхний уровень каталога. Для разделов с несколькими типами сначала добавьте подкатегории, затем товары."
      }
    >
      {formOpen ? (
        <AdminFormScreen onBack={closeForm}>
          <AdminFieldInstructions topic="category" />
          <CategoryForm
            mode={panel === "create" ? "create" : "edit"}
            initial={editing ?? undefined}
            onCancel={closeForm}
            onSubmit={async (formData) => {
              if (panel === "create") {
                await adminCreateCategory({ data: formData });
                toast.success("Категория создана");
              } else {
                await adminUpdateCategory({ data: formData });
                toast.success("Сохранено");
              }
              closeForm();
              await refresh();
            }}
          />
        </AdminFormScreen>
      ) : (
        <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <input
          className="max-w-sm flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm"
          placeholder="Поиск по названию или slug…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setPanel("create");
          }}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 font-display text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-foreground"
        >
          <Plus className="h-4 w-4" />
          Новая категория
        </button>
      </div>

      <div className={`${adminCardClass} mt-8 overflow-hidden p-0`}>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 font-display text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Категория</th>
                <th className="px-4 py-3">Подкатегории</th>
                <th className="px-4 py-3">Товары</th>
                <th className="px-4 py-3 w-36" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.category.slug} className="border-b border-border/70">
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <AdminCatalogThumb
                        src={row.category.image}
                        alt={row.category.name}
                      />
                      <div className="min-w-0">
                    <p className="font-medium">{row.category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      <Link
                        to="/catalog/$category"
                        params={{ category: row.category.slug }}
                        className="text-lime-deep"
                      >
                        /catalog/{row.category.slug}
                      </Link>
                    </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {row.subcategoryCount > 0 ? (
                      <Link
                        to="/admin/subcategories"
                        search={{ category: row.category.id }}
                        className="font-medium text-lime-deep hover:underline"
                      >
                        {row.subcategoryCount}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    <Link
                      to="/admin/products"
                      search={{ category: row.category.id }}
                      className="font-medium text-foreground hover:text-lime-deep"
                    >
                      {row.productCount}
                    </Link>
                    {row.subcategoryCount > 0 && row.productCount > 0 ? (
                      <p className="mt-0.5">
                        {row.productsInSubcategories} в подкат. · {row.productsInCategoryOnly} без
                        подкат.
                      </p>
                    ) : null}
                    {row.unassignedToSubcategory > 0 ? (
                      <p className="mt-1 flex items-center gap-1 text-amber-800 dark:text-amber-200">
                        <AlertTriangle className="h-3 w-3" aria-hidden />
                        {row.unassignedToSubcategory} нужно привязать
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1">
                      {row.subcategoryCount === 0 ? (
                        <Link
                          to="/admin/subcategories"
                          search={{ category: row.category.id }}
                          className="rounded-lg border border-border px-2 py-1.5 text-xs hover:bg-muted"
                        >
                          + Подкат.
                        </Link>
                      ) : (
                        <Link
                          to="/admin/subcategories"
                          search={{ category: row.category.id }}
                          className="rounded-lg border border-border px-2 py-1.5 text-xs hover:bg-muted"
                        >
                          Подкатегории
                        </Link>
                      )}
                      <button
                        type="button"
                        title="Редактировать"
                        onClick={() => {
                          setEditing(row.category);
                          setPanel("edit");
                        }}
                        className="rounded-lg border border-border p-2 hover:bg-muted"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Удалить"
                        onClick={() => void handleDelete(row.category.id, row.category.name)}
                        className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
        </>
      )}
    </AdminShell>
  );
}
