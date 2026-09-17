import { getCachedDbCategoryById, getCachedDbCategoryBySlug } from "./category-db-cache";
import type { Category, CategoryId } from "./types";

/** Категории хранятся только в Supabase (см. scripts/supabase-seed-categories.sql). */
export const CATEGORIES: Category[] = [];

export const CATEGORIES_BY_ORDER: Category[] = [];

export function getCategoryById(id: CategoryId): Category {
  const cached = getCachedDbCategoryById(id);
  if (cached) return cached;
  throw new Error(`Unknown category id: ${id}`);
}

export function findCategoryBySlug(slug: string): Category | undefined {
  return getCachedDbCategoryBySlug(slug);
}

export function getStaticCategorySlugs(): string[] {
  return [];
}
