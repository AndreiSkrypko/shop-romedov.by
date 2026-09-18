import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { useRememberCatalogCategory } from "@/lib/last-catalog-path";

import { CatalogSortBar } from "@/components/shop/CatalogSortBar";
import { CatalogStorefrontLayout } from "@/components/shop/CatalogStorefrontLayout";
import { CatalogSubcategoryNav } from "@/components/shop/CatalogSubcategoryNav";
import { ProductCardCatalog } from "@/components/shop/ProductCardCatalog";
import {
  EMPTY_FILTERS,
  applyFilters,
  filterProductsBySubcategory,
  findCategoryBySlugAsync,
  findSubcategory,
  getProductsByCategoryAsync,
  getSteelOptions,
  listSubcategoriesByCategoryAsync,
} from "@/lib/catalog";
import { useLiveCategoryPage } from "@/lib/catalog/use-live-category-page";
import type { CatalogFilters } from "@/lib/catalog";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/contacts";
import { buildSeo } from "@/lib/seo";
import { CATALOG_PRODUCTS_ANCHOR_ID, PRICE_NOTE } from "@/lib/site";

type CategorySearch = {
  sub?: string;
};

export const Route = createFileRoute("/catalog/$category")({
  validateSearch: (search: Record<string, unknown>): CategorySearch => ({
    sub: typeof search.sub === "string" && search.sub.length > 0 ? search.sub : undefined,
  }),
  loader: async ({ params }) => {
    const category = await findCategoryBySlugAsync(params.category);
    if (!category) throw notFound();
    const [products, subcategories] = await Promise.all([
      getProductsByCategoryAsync(category.id),
      listSubcategoriesByCategoryAsync(category.id),
    ]);
    return { category, products, subcategories };
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
  const { category: categorySlug } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const { category, products, subcategories } = useLiveCategoryPage(categorySlug, loaderData);
  const { sub: subSlug } = Route.useSearch();
  const activeSub = findSubcategory(subcategories, subSlug);
  const categoryProducts = useMemo(
    () => filterProductsBySubcategory(products, activeSub),
    [products, activeSub],
  );

  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);

  const steelOptions = useMemo(() => getSteelOptions(categoryProducts), [categoryProducts]);

  const filtered = useMemo(
    () => applyFilters(categoryProducts, filters),
    [categoryProducts, filters],
  );

  const resetSidebarFilters = () => {
    setFilters(EMPTY_FILTERS);
  };

  useRememberCatalogCategory(category);

  useEffect(() => {
    if (!subSlug) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(CATALOG_PRODUCTS_ANCHOR_ID)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [subSlug]);

  return (
    <CatalogStorefrontLayout
      breadcrumbs={[
        { label: "Каталог", kind: "catalog" },
        ...(activeSub
          ? ([
              { label: category.name, kind: "category" as const, slug: category.slug },
              { label: activeSub.name, kind: "current" as const },
            ] as const)
          : ([{ label: category.name, kind: "current" as const }] as const)),
      ]}
      title={category.name}
      subtitle={
        activeSub ? `${activeSub.name}. ${category.description}` : category.description
      }
      activeCategoryId={category.id}
      showProductFilters
      steelOptions={steelOptions}
      filters={filters}
      onFiltersChange={setFilters}
      onResetFilters={resetSidebarFilters}
      jsonLdName={category.name}
      jsonLdPath={`/catalog/${category.slug}`}
    >
      {subcategories.length > 0 ? (
        <CatalogSubcategoryNav
          category={category}
          subcategories={subcategories}
          activeSubSlug={activeSub?.slug}
        />
      ) : null}

      <section
        id={CATALOG_PRODUCTS_ANCHOR_ID}
        className="scroll-mt-24"
        aria-label="Товары категории"
      >
        <CatalogSortBar
          filters={filters}
          onChange={setFilters}
          shown={filtered.length}
          total={categoryProducts.length}
        />

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {activeSub ? (
            <>
              В подкатегории «{activeSub.name}» пока нет товаров — назначьте подкатегорию в{" "}
              <Link to="/admin/products" className="text-lime-deep">
                админке
              </Link>{" "}
              или{" "}
              <Link
                to="/catalog/$category"
                params={{ category: category.slug }}
                search={{}}
                className="text-lime-deep"
              >
                смотрите всю категорию
              </Link>
              .
            </>
          ) : (
            <>
              Нет товаров по выбранным фильтрам.{" "}
              <a href={PHONE_HREF} className="text-lime-deep">
                {PHONE_DISPLAY}
              </a>
            </>
          )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCardCatalog key={product.slug} product={product} />
            ))}
          </div>
        )}

        <p className="mt-6 text-xs text-muted-foreground">{PRICE_NOTE}</p>
      </section>
    </CatalogStorefrontLayout>
  );
}
