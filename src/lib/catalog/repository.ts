import {
  fetchProductBySlugFromSupabase,
  fetchProductsByCategoryFromSupabase,
  fetchProductsBySlugsFromSupabase,
  fetchSupabaseProductSlugs,
} from "@/lib/supabase/queries";

import { getCachedDbProduct, rememberDbProducts } from "./db-cache";
import { PRODUCTS } from "./products";
import type { CategoryId, Product } from "./types";

const STATIC_BY_SLUG = new Map<string, Product>(PRODUCTS.map((item) => [item.slug, item]));

export function getStaticProductSlugs(): string[] {
  return PRODUCTS.map((p) => p.slug);
}

/** Все slug для пререндера и sitemap (статика; Supabase дополняется при сборке). */
export function getAllProductSlugs(): string[] {
  return getStaticProductSlugs();
}

export { fetchSupabaseProductSlugs };

export function resolveProduct(slug: string): Product | undefined {
  const cached = getCachedDbProduct(slug);
  if (cached) return cached;
  return STATIC_BY_SLUG.get(slug);
}

export async function resolveProductAsync(slug: string): Promise<Product | undefined> {
  const staticProduct = STATIC_BY_SLUG.get(slug);
  if (staticProduct) return staticProduct;

  const cached = getCachedDbProduct(slug);
  if (cached) return cached;

  const fromDb = await fetchProductBySlugFromSupabase(slug);
  if (fromDb) rememberDbProducts([fromDb]);
  return fromDb;
}

export function listProductsByCategory(categoryId: CategoryId): Product[] {
  return PRODUCTS.filter((product) => product.categoryId === categoryId);
}

export async function listProductsByCategoryAsync(categoryId: CategoryId): Promise<Product[]> {
  const fromDb = await fetchProductsByCategoryFromSupabase(categoryId);
  rememberDbProducts(fromDb);

  const dbSlugs = new Set(fromDb.map((item) => item.slug));
  const staticRest = PRODUCTS.filter(
    (product) => product.categoryId === categoryId && !dbSlugs.has(product.slug),
  );

  return [...fromDb, ...staticRest];
}

export async function hydrateDbProductsForSlugs(slugs: string[]): Promise<void> {
  const missing = slugs.filter(
    (slug) => !STATIC_BY_SLUG.has(slug) && !getCachedDbProduct(slug),
  );
  if (missing.length === 0) return;

  const fromDb = await fetchProductsBySlugsFromSupabase(missing);
  rememberDbProducts(fromDb);
}
