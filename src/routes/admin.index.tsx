import { Link, createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

import { AdminCatalogGuide } from "@/components/admin/AdminCatalogGuide";
import { AdminProductPath } from "@/components/admin/AdminProductPath";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCatalogLoading } from "@/components/admin/AdminCatalogLoading";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { useAdminCatalogSnapshot } from "@/lib/admin/useAdminCatalogSnapshot";
import { adminCardClass } from "@/lib/admin/ui";

export const Route = createFileRoute("/admin/")({
  beforeLoad: requireAdminSession,
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
    title: "Обзор каталога — админка",
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { snapshot, loading, error } = useAdminCatalogSnapshot();

  if (loading || !snapshot) {
    return (
      <AdminShell title="Обзор каталога" subtitle="Загрузка данных из Supabase…">
        {error ? <p className="mt-6 text-sm text-destructive">{error}</p> : null}
        <AdminCatalogLoading />
      </AdminShell>
    );
  }

  const { stats } = snapshot;

  return (
    <AdminShell
      title="Обзор каталога"
      subtitle="Категории → подкатегории (если нужны) → товары. Всё редактируется здесь."
    >
      <AdminCatalogGuide variant="compact" />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Категорий"
          value={stats.categories}
          hint={
            stats.categories > 0 ? (
              <Link to="/admin/categories" className="text-lime-deep hover:underline">
                Тот же список в «Категории»
              </Link>
            ) : (
              "Запустите scripts/supabase-seed-categories.sql в Supabase"
            )
          }
        />
        <StatCard
          label="Подкатегорий"
          value={stats.subcategories}
          warn={stats.orphanedSubcategories > 0}
          hint={
            stats.orphanedSubcategories > 0 ? (
              <Link to="/admin/subcategories" className="text-lime-deep hover:underline">
                Ещё {stats.orphanedSubcategories} скрыты — нет родительской категории
              </Link>
            ) : (
              "У выбранных категорий в структуре ниже"
            )
          }
        />
        <StatCard label="Товаров" value={stats.products} />
        <StatCard
          label="Без подкатегории"
          value={stats.productsNeedSubcategory}
          warn={stats.productsNeedSubcategory > 0}
          hint={
            stats.productsNeedSubcategory > 0 ? (
              <Link to="/admin/products" search={{ needsSub: true }} className="text-lime-deep hover:underline">
                Исправить в товарах
              </Link>
            ) : (
              "Всё привязано"
            )
          }
        />
      </div>

      <section className={`${adminCardClass} mt-10`}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-sm font-semibold uppercase">Структура каталога</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link to="/admin/categories" className="text-lime-deep hover:underline">
              Категории
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/admin/subcategories" className="text-lime-deep hover:underline">
              Подкатегории
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/admin/products" className="text-lime-deep hover:underline">
              Товары
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/admin/help" className="text-lime-deep hover:underline">
              Справка по полям
            </Link>
          </div>
        </div>

        {snapshot.categories.length === 0 ? (
          <p className="mt-5 text-sm text-muted-foreground">
            В Supabase пока нет категорий. Выполните{" "}
            <code className="text-xs">scripts/supabase-seed-categories.sql</code> или создайте категорию
            в разделе{" "}
            <Link to="/admin/categories" className="text-lime-deep hover:underline">
              Категории
            </Link>
            .
          </p>
        ) : (
        <ul className="mt-5 space-y-4">
          {snapshot.categories.map((row) => (
            <li key={row.category.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{row.category.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    /catalog/{row.category.slug}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/admin/subcategories"
                    search={{ category: row.category.id }}
                    className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide hover:bg-muted"
                  >
                    Подкатегории ({row.subcategoryCount})
                  </Link>
                  <Link
                    to="/admin/products"
                    search={{ category: row.category.id }}
                    className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide hover:bg-muted"
                  >
                    Товары ({row.productCount})
                  </Link>
                </div>
              </div>

              {row.subcategoryCount > 0 ? (
                <ul className="mt-3 space-y-1 border-l-2 border-border pl-4 text-sm">
                  {snapshot.subcategories
                    .filter((s) => s.categoryId === row.category.id)
                    .sort((a, b) => a.order - b.order)
                    .map((sub) => {
                      const count = snapshot.products.filter(
                        (p) => p.product.subcategoryId === sub.id,
                      ).length;
                      return (
                        <li key={sub.id} className="flex flex-wrap justify-between gap-2 text-muted-foreground">
                          <span>{sub.name}</span>
                          <span className="text-xs">{count} тов.</span>
                        </li>
                      );
                    })}
                  {row.unassignedToSubcategory > 0 ? (
                    <li className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-200">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {row.unassignedToSubcategory} без подкатегории — не попадут в плитки на сайте
                    </li>
                  ) : null}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Подкатегорий нет — товары показываются сразу в категории.
                </p>
              )}
            </li>
          ))}
        </ul>
        )}

        {snapshot.orphanedSubcategories.length > 0 ? (
          <div className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 text-sm">
            <p className="font-medium text-amber-950 dark:text-amber-100">
              В базе {snapshot.orphanedSubcategories.length} подкатегорий без категории в админке
            </p>
            <p className="mt-1 text-muted-foreground">
              Обычно это пример из{" "}
              <code className="text-xs">scripts/supabase-subcategories.sql</code> для «Трубы» (id{" "}
              <code className="text-xs">pipe</code>), если полный seed категорий не запускали.
            </p>
            <ul className="mt-2 list-inside list-disc text-xs text-muted-foreground">
              {snapshot.orphanedSubcategories.map((sub) => (
                <li key={sub.id}>
                  {sub.name} → category_id: <code>{sub.categoryId}</code>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs">
              <Link to="/admin/subcategories" className="text-lime-deep hover:underline">
                Подкатегории
              </Link>
              {" · "}
              <code className="text-xs">supabase-seed-categories.sql</code> или{" "}
              <code className="text-xs">supabase-cleanup-pipe-subcategories.sql</code>
            </p>
          </div>
        ) : null}
      </section>

      <section className={`${adminCardClass} mt-8`}>
        <h2 className="font-display text-sm font-semibold uppercase">Товары (последние по списку)</h2>
        <ul className="mt-4 max-h-[360px] space-y-2 overflow-y-auto text-sm">
          {snapshot.products.slice(0, 30).map((row) => (
            <li
              key={row.product.slug}
              className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-border/70 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{row.product.name}</p>
                <AdminProductPath row={row} />
              </div>
              <Link
                to="/admin/products"
                search={{ category: row.product.categoryId, q: row.product.slug }}
                className="shrink-0 text-xs text-lime-deep hover:underline"
              >
                Открыть
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </AdminShell>
  );
}

function StatCard({
  label,
  value,
  hint,
  warn,
}: {
  label: string;
  value: string | number;
  hint?: ReactNode;
  warn?: boolean;
}) {
  return (
    <div className={`${adminCardClass} ${warn ? "border-amber-500/40 bg-amber-500/5" : ""}`}>
      <p className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  );
}
