import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminCatalogThumb } from "@/components/admin/AdminCatalogThumb";
import { AdminFieldInstructions } from "@/components/admin/AdminFieldInstructions";
import { AdminFormScreen } from "@/components/admin/AdminFormScreen";
import { AdminShell } from "@/components/admin/AdminShell";
import { SubcategoryForm } from "@/components/admin/SubcategoryForm";
import { AdminCatalogLoading } from "@/components/admin/AdminCatalogLoading";
import {
  adminCreateSubcategory,
  adminDeleteSubcategory,
  adminUpdateSubcategory,
} from "@/lib/admin/admin-catalog";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { useAdminCatalogSnapshot } from "@/lib/admin/useAdminCatalogSnapshot";
import { adminCardClass, adminLabelClass } from "@/lib/admin/ui";
import { countSubcategoryProducts } from "@/lib/catalog";
import type { Subcategory } from "@/lib/catalog/types";

type SubSearch = {
  category?: string;
};

export const Route = createFileRoute("/admin/subcategories")({
  beforeLoad: requireAdminSession,
  validateSearch: (search: Record<string, unknown>): SubSearch => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
    title: "Подкатегории — админка",
  }),
  component: AdminSubcategoriesPage,
});

function AdminSubcategoriesPage() {
  const router = useRouter();
  const { snapshot, loading, error, refresh } = useAdminCatalogSnapshot();
  const { category: categoryIdFromUrl } = Route.useSearch();

  const categories = snapshot?.categories.map((row) => row.category) ?? [];
  const [categoryId, setCategoryId] = useState(
    categoryIdFromUrl ?? categories[0]?.id ?? "",
  );
  const [panel, setPanel] = useState<"none" | "create" | "edit">("none");
  const [editing, setEditing] = useState<Subcategory | null>(null);
  const formOpen = panel !== "none";

  const closeForm = () => {
    setPanel("none");
    setEditing(null);
  };

  const categoryRow = snapshot?.categories.find((r) => r.category.id === categoryId);
  const category = categoryRow?.category;
  const subsForCategory = useMemo(
    () =>
      (snapshot?.subcategories ?? [])
        .filter((s) => s.categoryId === categoryId)
        .sort((a, b) => a.order - b.order),
    [snapshot, categoryId],
  );

  const orphanedSubs = snapshot?.orphanedSubcategories ?? [];

  const dbProducts = snapshot?.products.map((r) => r.product) ?? [];

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить подкатегорию «${name}»?`)) return;
    try {
      await adminDeleteSubcategory(id);
      toast.success("Подкатегория удалена");
      closeForm();
      refresh();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Не удалось удалить");
    }
  };

  if (loading || !snapshot) {
    return (
      <AdminShell title="Подкатегории">
        {error ? <p className="mt-6 text-sm text-destructive">{error}</p> : null}
        <AdminCatalogLoading />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={
        formOpen
          ? panel === "create"
            ? "Новая подкатегория"
            : (editing?.name ?? "Редактирование подкатегории")
          : "Подкатегории"
      }
      subtitle={
        formOpen
          ? "Сохраните изменения или вернитесь к списку."
          : "Второй уровень внутри категории: плитки на витрине. Товары привязываются к подкатегории в разделе «Товары»."
      }
    >
      {formOpen ? (
        <AdminFormScreen onBack={closeForm}>
          <AdminFieldInstructions topic="subcategory" />
          <p className="text-sm text-muted-foreground">
            Категория: <strong className="text-foreground">{category?.name}</strong>
          </p>
          <SubcategoryForm
            mode={panel === "create" ? "create" : "edit"}
            categoryId={categoryId}
            initial={editing ?? undefined}
            onCancel={closeForm}
            onSubmit={async (formData) => {
              if (panel === "create") {
                await adminCreateSubcategory(formData);
                toast.success("Подкатегория создана");
              } else {
                await adminUpdateSubcategory(formData);
                toast.success("Сохранено");
              }
              closeForm();
              refresh();
            }}
          />
        </AdminFormScreen>
      ) : (
        <>
      <div className="mt-6 flex flex-wrap items-end gap-4">
        <div>
          <label className={adminLabelClass}>Родительская категория</label>
          <select
            className="mt-1 block min-w-[260px] rounded-lg border border-border bg-background px-3 py-2 text-sm"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPanel("none");
              void router.navigate({
                to: "/admin/subcategories",
                search: { category: e.target.value },
              });
            }}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {category ? (
          <>
            <Link
              to="/catalog/$category"
              params={{ category: category.slug }}
              className="inline-flex items-center gap-1 text-sm text-lime-deep"
            >
              Страница на сайте <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/admin/products"
              search={{ category: category.id }}
              className="text-sm text-lime-deep hover:underline"
            >
              Товары категории ({categoryRow?.productCount ?? 0})
            </Link>
          </>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setPanel("create");
          }}
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 font-display text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-foreground"
        >
          <Plus className="h-4 w-4" />
          Подкатегория
        </button>
      </div>

      {category ? (
        <p className="mt-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{category.name}</span>
          {subsForCategory.length > 0
            ? ` → ${subsForCategory.length} подкатегорий · на сайте фильтр ?sub=…`
            : " → подкатегорий пока нет, товары идут напрямую в категорию"}
        </p>
      ) : null}

      {orphanedSubs.length > 0 ? (
        <div className={`${adminCardClass} mt-8 border-amber-500/30 bg-amber-500/5`}>
          <h3 className="font-display text-[10px] font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-100">
            Без категории в админке ({orphanedSubs.length})
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Родительская категория отсутствует в таблице categories (например id{" "}
            <code className="text-xs">pipe</code>). На сайте эти подкатегории не отображаются, пока не
            добавите категорию или не удалите записи.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {orphanedSubs.map((sub) => (
              <li
                key={sub.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2"
              >
                <span>
                  {sub.name}{" "}
                  <span className="text-xs text-muted-foreground">({sub.categoryId})</span>
                </span>
                <button
                  type="button"
                  title="Редактировать"
                  onClick={() => {
                    setEditing(sub);
                    setPanel("edit");
                  }}
                  className="rounded-lg border border-border p-2 hover:bg-muted"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className={`${adminCardClass} mt-8 overflow-hidden p-0`}>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 font-display text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Подкатегория</th>
                <th className="px-4 py-3">Товаров</th>
                <th className="px-4 py-3">Фильтр на сайте</th>
                <th className="w-28 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {subsForCategory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    В «{category?.name}» нет подкатегорий. Создайте первую или добавляйте товары
                    сразу в категорию.
                  </td>
                </tr>
              ) : (
                subsForCategory.map((sub) => (
                  <tr key={sub.id} className="border-b border-border/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <AdminCatalogThumb src={sub.image} alt={sub.name} />
                        <div>
                          <p className="font-medium">{sub.name}</p>
                          <p className="text-xs text-muted-foreground">id: {sub.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to="/admin/products"
                        search={{ category: categoryId, q: sub.slug }}
                        className="text-lime-deep hover:underline"
                      >
                        {countSubcategoryProducts(dbProducts, sub)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      ?sub={sub.slug}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          title="Редактировать"
                          onClick={() => {
                            setEditing(sub);
                            setPanel("edit");
                          }}
                          className="rounded-lg border border-border p-2 hover:bg-muted"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Удалить"
                          onClick={() => void handleDelete(sub.id, sub.name)}
                          className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
      </div>
        </>
      )}
    </AdminShell>
  );
}
