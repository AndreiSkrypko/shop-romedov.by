import {
  CATALOG_USE_DEMO_DB,
  DEMO_DB_CATEGORY_ID,
  DEMO_DB_PRODUCTS,
  loadProductFromDemoDb,
  loadProductsFromDemoDb,
} from "./demo-db";
import { PRODUCTS } from "./products";
import type { CategoryId, Product } from "./types";

const STATIC_BY_SLUG = new Map<string, Product>(PRODUCTS.map((item) => [item.slug, item]));

/** Все slug для пререндера и sitemap. */
export function getAllProductSlugs(): string[] {
  const slugs = new Set(PRODUCTS.map((p) => p.slug));
  for (const product of DEMO_DB_PRODUCTS) {
    slugs.add(product.slug);
  }
  return [...slugs];
}

export function resolveProduct(slug: string): Product | undefined {
  if (CATALOG_USE_DEMO_DB) {
    const fromDb = loadProductFromDemoDb(slug);
    if (fromDb) return fromDb;
  }
  return STATIC_BY_SLUG.get(slug);
}

export function listProductsByCategory(categoryId: CategoryId): Product[] {
  const staticInCategory = PRODUCTS.filter((product) => product.categoryId === categoryId);

  if (CATALOG_USE_DEMO_DB && categoryId === DEMO_DB_CATEGORY_ID) {
    const fromDb = loadProductsFromDemoDb(categoryId);
    const dbSlugs = new Set(fromDb.map((item) => item.slug));
    const staticRest = staticInCategory.filter((item) => !dbSlugs.has(item.slug));
    return [...fromDb, ...staticRest];
  }

  return staticInCategory;
}
