import { fetchPublishedCategoriesFromSupabase } from "@/lib/supabase/queries";

import {
  getCachedDbCategoryById,
  getCachedDbCategoryBySlug,
  rememberDbCategories,
} from "./category-db-cache";
import type { Category } from "./types";

export async function listCategoriesAsync(): Promise<Category[]> {
  const fromDb = await fetchPublishedCategoriesFromSupabase();
  rememberDbCategories(fromDb);
  return [...fromDb].sort((a, b) => a.order - b.order);
}

export async function findCategoryBySlugAsync(slug: string): Promise<Category | undefined> {
  const cached = getCachedDbCategoryBySlug(slug);
  if (cached) return cached;

  const fromDb = (await fetchPublishedCategoriesFromSupabase()).find((c) => c.slug === slug);
  if (fromDb) {
    rememberDbCategories([fromDb]);
    return fromDb;
  }

  return undefined;
}

export async function getCategoryByIdAsync(id: string): Promise<Category> {
  const cached = getCachedDbCategoryById(id);
  if (cached) return cached;

  const fromDb = (await fetchPublishedCategoriesFromSupabase()).find((c) => c.id === id);
  if (fromDb) {
    rememberDbCategories([fromDb]);
    return fromDb;
  }

  throw new Error(`Unknown category id: ${id}`);
}
