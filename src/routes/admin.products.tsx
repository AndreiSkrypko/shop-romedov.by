import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminCatalogThumb } from "@/components/admin/AdminCatalogThumb";
import { AdminFieldInstructions } from "@/components/admin/AdminFieldInstructions";
import { AdminFormScreen } from "@/components/admin/AdminFormScreen";
import { AdminProductPath } from "@/components/admin/AdminProductPath";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminCatalogLoading } from "@/components/admin/AdminCatalogLoading";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminUpdateProduct,
} from "@/lib/admin/admin-catalog";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { useAdminCatalogSnapshot } from "@/lib/admin/useAdminCatalogSnapshot";
import { adminCardClass } from "@/lib/admin/ui";
import { formatPrice, productImage, unitPrice } from "@/lib/catalog";
import type { Product } from "@/lib/catalog/types";

type ProductsSearch = {
  category?: string;
  needsSub?: boolean;
  q?: string;
};

export const Route = createFileRoute("/admin/products")({
  beforeLoad: requireAdminSession,
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    category: typeof search.category === "string" ? search.category : undefined,
    needsSub:
      search.needsSub === true || search.needsSub === "true" || search.needsSub === "1",
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
    title: "Товары — админка",
  }),
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const router = useRouter();
  const { snapshot, loading, error, refresh } = useAdminCatalogSnapshot();
  const { category: categoryFromUrl, needsSub, q: qFromUrl } = Route.useSearch();
  const [panel, setPanel] = useState<"none" | "create" | "edit">("none");
  const [editing, setEditing] = useState<Product | null>(null);
  const [filter, setFilter] = useState(qFromUrl ?? "");
  const [categoryFilter, setCategoryFilter] = useState(categoryFromUrl ?? "");
  const [onlyNeedsSub, setOnlyNeedsSub] = useState(needsSub ?? false);

  const categoriesForForm = snapshot?.categories.map((row) => row.category) ?? [];
  const formOpen = panel !== "none";

  const closeForm = () => {
    setPanel("none");
    setEditing(null);
  };

  const filtered = useMemo(() => {
    if (!snapshot) return [];
    const q = filter.trim().toLowerCase();
    return snapshot.products.filter((row) => {
      if (categoryFilter && row.product.categoryId !== categoryFilter) return false;
      if (onlyNeedsSub && row.placement !== "needs_subcategory") return false;
      if (!q) return true;
      return (
        row.product.name.toLowerCase().includes(q) ||
        row.product.slug.includes(q) ||
        row.categoryName.toLowerCase().includes(q) ||
        (row.subcategoryName?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [filter, snapshot, categoryFilter, onlyNeedsSub]);

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Удалить «${name}»?`)) return;
    try {
      await adminDeleteProduct(slug);
      toast.success("Товар удалён");
      closeForm();
      refresh();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Не удалось удалить");
    }
  };

  if (loading || !snapshot) {
    return (
      <AdminShell title="Товары">
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
            ? "Новый товар"
            : (editing?.name ?? "Редактирование товара")
          : "Товары"
      }
      subtitle={
        formOpen
          ? "Заполните поля и сохраните — после этого вернётесь к списку."
          : "Каждый товар в одной категории. Если у категории есть подкатегории — укажите её в карточке."
      }
    >
      {formOpen ? (
        <AdminFormScreen onBack={closeForm}>
          <AdminFieldInstructions topic="product" />
          <ProductForm
            mode={panel === "create" ? "create" : "edit"}
            categories={categoriesForForm}
            subcategories={snapshot.subcategories}
            initial={editing ?? undefined}
            defaultCategoryId={categoryFilter || undefined}
            onCancel={closeForm}
            onSubmit={async (formData) => {
              if (panel === "create") {
                await adminCreateProduct(formData);
                toast.success("Товар добавлен");
              } else {
                await adminUpdateProduct(formData);
                toast.success("Сохранено");
              }
              closeForm();
              refresh();
            }}
          />
        </AdminFormScreen>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <input
              className="min-w-[180px] flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm"
              placeholder="Поиск по названию, slug, категории…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <select
              className="rounded-full border border-border bg-background px-4 py-2 text-sm"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                void router.navigate({
                  to: "/admin/products",
                  search: {
                    category: e.target.value || undefined,
                    needsSub: onlyNeedsSub || undefined,
                  },
                });
              }}
            >
              <option value="">Все категории</option>
              {categoriesForForm.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs">
              <input
                type="checkbox"
                checked={onlyNeedsSub}
                onChange={(e) => {
                  setOnlyNeedsSub(e.target.checked);
                  void router.navigate({
                    to: "/admin/products",
                    search: {
                      category: categoryFilter || undefined,
                      needsSub: e.target.checked || undefined,
                    },
                  });
                }}
              />
              Без подкатегории (нужно исправить)
            </label>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setPanel("create");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 font-display text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-foreground"
            >
              <Plus className="h-4 w-4" />
              Новый товар
            </button>
          </div>

          <div className={`${adminCardClass} mt-8 overflow-hidden p-0`}>
            <p className="border-b border-border px-4 py-2 text-xs text-muted-foreground">
              Показано {filtered.length} из {snapshot.products.length}
            </p>
            <ul className="divide-y divide-border">
              {filtered.map((row) => (
                <li key={row.product.slug} className="flex flex-wrap items-start gap-3 px-4 py-3">
                  <AdminCatalogThumb
                    product={row.product}
                    src={productImage(row.product)}
                    alt={row.product.name}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug">
                      {row.product.name}
                      {row.product.popular ? (
                        <span className="ml-2 inline-flex rounded-full bg-brand/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-lime-deep">
                          На главной
                        </span>
                      ) : null}
                    </p>
                    <AdminProductPath row={row} />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatPrice(unitPrice(row.product))}
                    </p>
                    <p className="mt-1 text-xs">
                      <Link
                        to="/product/$slug"
                        params={{ slug: row.product.slug }}
                        className="inline-flex items-center gap-1 text-lime-deep"
                      >
                        /product/{row.product.slug}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(row.product);
                        setPanel("edit");
                      }}
                      className="rounded-lg border border-border p-2 hover:bg-muted"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(row.product.slug, row.product.name)}
                      className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </AdminShell>
  );
}
