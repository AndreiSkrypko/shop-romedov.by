import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { CatalogSortBar } from "@/components/shop/CatalogSortBar";
import { CatalogStorefrontLayout } from "@/components/shop/CatalogStorefrontLayout";
import { ProductCardCatalog } from "@/components/shop/ProductCardCatalog";
import {
  EMPTY_FILTERS,
  applyFilters,
  findCategoryBySlug,
  getProductsByCategoryAsync,
  getSteelOptions,
  unitPrice,
} from "@/lib/catalog";
import type { CatalogFilters } from "@/lib/catalog";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/contacts";
import { buildSeo } from "@/lib/seo";
import { PRICE_NOTE } from "@/lib/site";

export const Route = createFileRoute("/catalog/$category")({
  loader: async ({ params }) => {
    const category = findCategoryBySlug(params.category);
    if (!category) throw notFound();
    const products = await getProductsByCategoryAsync(category.id);
    return { category, products };
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
  const { category, products } = Route.useLoaderData();

  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(9999);

  const steelOptions = useMemo(() => getSteelOptions(products), [products]);

  const priceCeiling = useMemo(() => {
    if (products.length === 0) return 100;
    return Math.ceil(Math.max(...products.map((p) => unitPrice(p))) * 1.2);
  }, [products]);

  const filtered = useMemo(() => {
    let list = applyFilters(products, filters);
    list = list.filter((p) => {
      const price = unitPrice(p);
      return price >= priceMin && price <= priceMax;
    });
    return list;
  }, [products, filters, priceMin, priceMax]);

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
        { label: category.name, kind: "current" },
      ]}
      title={category.name}
      subtitle={category.description}
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
      <CatalogSortBar
        filters={filters}
        onChange={setFilters}
        shown={filtered.length}
        total={products.length}
      />

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Нет товаров по выбранным фильтрам.{" "}
          <a href={PHONE_HREF} className="text-lime-deep">
            {PHONE_DISPLAY}
          </a>
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
