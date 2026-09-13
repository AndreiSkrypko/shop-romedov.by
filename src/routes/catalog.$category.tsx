import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { LayoutGrid, List } from "lucide-react";
import { useMemo, useState } from "react";

import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { CatalogToolbar } from "@/components/shop/CatalogToolbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductTable } from "@/components/shop/ProductTable";
import { Shell } from "@/components/shop/Shell";
import {
  CATEGORIES_BY_ORDER,
  EMPTY_FILTERS,
  applyFilters,
  findCategoryBySlug,
  getProductsByCategory,
  getSteelOptions,
} from "@/lib/catalog";
import type { CatalogFilters } from "@/lib/catalog";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/contacts";
import { buildSeo, jsonLd } from "@/lib/seo";
import { PRICE_NOTE, SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/catalog/$category")({
  loader: ({ params }) => {
    const category = findCategoryBySlug(params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { category } = loaderData;
    return buildSeo({
      title: category.seoTitle,
      description: category.seoDescription,
      path: `/catalog/${category.slug}`,
      keywords: `${category.name.toLowerCase()}, купить ${category.name.toLowerCase()}, цена, минск, борисов, беларусь`,
    });
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);
  const [view, setView] = useState<"table" | "grid">("table");

  const products = useMemo(() => getProductsByCategory(category.id), [category.id]);
  const steelOptions = useMemo(() => getSteelOptions(products), [products]);
  const visible = useMemo(() => applyFilters(products, filters), [products, filters]);

  const otherCategories = CATEGORIES_BY_ORDER.filter((item) => item.id !== category.id);

  return (
    <Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Каталог", item: `${SITE_URL}/catalog` },
            {
              "@type": "ListItem",
              position: 3,
              name: category.name,
              item: `${SITE_URL}/catalog/${category.slug}`,
            },
          ],
        })}
      />

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <Breadcrumbs
          items={[
            { label: "Металлопрокат", kind: "catalog" },
            { label: category.name, kind: "current" },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-start">
          <div>
            <h1 className="font-display text-3xl font-semibold uppercase sm:text-4xl">
              {category.name}
            </h1>
            <p className="mt-2 font-display text-sm uppercase tracking-[0.12em] text-lime-deep">
              {category.tagline}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {category.description}
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-white">
            <img
              src={category.image}
              alt={category.name}
              className="h-40 w-full object-contain p-4 lg:h-48"
            />
          </div>
        </div>

        <div className="mt-10 space-y-5">
          <CatalogToolbar
            steelOptions={steelOptions}
            filters={filters}
            onChange={setFilters}
            total={products.length}
            shown={visible.length}
          />

          <div className="flex items-center justify-end gap-2">
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Вид
            </span>
            <div className="flex overflow-hidden rounded-full border border-border">
              <button
                type="button"
                onClick={() => setView("table")}
                aria-pressed={view === "table"}
                aria-label="Таблицей"
                className={`flex h-9 w-10 items-center justify-center transition-colors ${
                  view === "table" ? "bg-brand text-brand-foreground" : "text-muted-foreground"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
                aria-label="Плиткой"
                className={`flex h-9 w-10 items-center justify-center transition-colors ${
                  view === "grid" ? "bg-brand text-brand-foreground" : "text-muted-foreground"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center">
              <p className="font-display text-base font-semibold uppercase">Ничего не найдено</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Сбросьте фильтры или позвоните — подберём нужный сортамент вручную:{" "}
                <a href={PHONE_HREF} className="text-lime-deep">
                  {PHONE_DISPLAY}
                </a>
              </p>
            </div>
          ) : view === "table" ? (
            <ProductTable products={visible} dimensionLabel={category.dimensionLabel} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}

          <p className="text-xs leading-relaxed text-muted-foreground">{PRICE_NOTE}</p>
        </div>

        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-display text-xl font-semibold uppercase">Другие категории</h2>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {otherCategories.map((item) => (
              <Link
                key={item.id}
                to="/catalog/$category"
                params={{ category: item.slug }}
                className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-lime-deep hover:text-lime-deep"
              >
                {item.menuName}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
