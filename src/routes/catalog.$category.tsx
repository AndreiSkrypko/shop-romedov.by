import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

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
  unitPrice,
} from "@/lib/catalog";
import type { CatalogFilters } from "@/lib/catalog";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/contacts";
import { buildSeo } from "@/lib/seo";
import { PRICE_NOTE } from "@/lib/site";

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
  const { category, products, subcategories } = Route.useLoaderData();
  const { sub: subSlug } = Route.useSearch();
  const activeSub = findSubcategory(subcategories, subSlug);
  const categoryProducts = useMemo(
    () => filterProductsBySubcategory(products, activeSub),
    [products, activeSub],
  );

  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(9999);

  const steelOptions = useMemo(() => getSteelOptions(categoryProducts), [categoryProducts]);

  const priceCeiling = useMemo(() => {
    if (categoryProducts.length === 0) return 100;
    return Math.ceil(Math.max(...categoryProducts.map((p) => unitPrice(p))) * 1.2);
  }, [categoryProducts]);

  const filtered = useMemo(() => {
    let list = applyFilters(categoryProducts, filters);
    list = list.filter((p) => {
      const price = unitPrice(p);
      return price >= priceMin && price <= priceMax;
    });
    return list;
  }, [categoryProducts, filters, priceMin, priceMax]);

  const resetSidebarFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPriceMin(0);
    setPriceMax(priceCeiling);
  };

  useEffect(() => {
    setPriceMax(priceCeiling);
  }, [priceCeiling]);

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
      priceMin={priceMin}
      priceMax={priceMax}
      priceCeiling={priceCeiling}
      onPriceMinChange={setPriceMin}
      onPriceMaxChange={setPriceMax}
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
    </CatalogStorefrontLayout>
  );
}
