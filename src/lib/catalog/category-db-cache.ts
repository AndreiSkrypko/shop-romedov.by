import type { Category } from "./types";

const byId = new Map<string, Category>();
const bySlug = new Map<string, Category>();

export function rememberDbCategories(categories: Category[]): void {
  for (const category of categories) {
    byId.set(category.id, category);
    bySlug.set(category.slug, category);
  }
}

export function getCachedDbCategoryBySlug(slug: string): Category | undefined {
  return bySlug.get(slug);
}

export function getCachedDbCategoryById(id: string): Category | undefined {
  return byId.get(id);
}
