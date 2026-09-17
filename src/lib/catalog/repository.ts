import {
  fetchProductBySlugFromSupabase,
  fetchProductsByCategoryFromSupabase,
  fetchProductsBySlugsFromSupabase,
  fetchSupabaseProductSlugs,
} from "@/lib/supabase/queries";

import { getCachedDbProduct, rememberDbProducts } from "./db-cache";
import type { CategoryId, Product } from "./types";

export function getStaticProductSlugs(): string[] {
  return [];
}

/** Slug товаров для пререндера и sitemap (только Supabase). */
export function getAllProductSlugs(): string[] {
  return [];
}

export { fetchSupabaseProductSlugs };

export function resolveProduct(slug: string): Product | undefined {
  return getCachedDbProduct(slug);
}

export async function resolveProductAsync(slug: string): Promise<Product | undefined> {
  const cached = getCachedDbProduct(slug);
  if (cached) return cached;

  const fromDb = await fetchProductBySlugFromSupabase(slug);
  if (fromDb) {
    rememberDbProducts([fromDb]);
    return fromDb;
  }

  return undefined;
}

export function listProductsByCategory(_categoryId: CategoryId): Product[] {
  return [];
}

export async function listProductsByCategoryAsync(categoryId: CategoryId): Promise<Product[]> {
  const fromDb = await fetchProductsByCategoryFromSupabase(categoryId);
  rememberDbProducts(fromDb);
  return fromDb;
}

export async function hydrateDbProductsForSlugs(slugs: string[]): Promise<void> {
  const missing = slugs.filter((slug) => !getCachedDbProduct(slug));
  if (missing.length === 0) return;

  const fromDb = await fetchProductsBySlugsFromSupabase(missing);
  rememberDbProducts(fromDb);
}
