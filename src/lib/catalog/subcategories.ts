import type { CategoryId, Product, Subcategory } from "./types";

export function findSubcategory(
  subcategories: Subcategory[],
  slug: string | undefined,
): Subcategory | undefined {
  if (!slug) return undefined;
  return subcategories.find((item) => item.slug === slug);
}

export function filterProductsBySubcategory(
  products: Product[],
  subcategory: Subcategory | undefined,
): Product[] {
  if (!subcategory) return products;
  return products.filter((product) => product.subcategoryId === subcategory.id);
}

export function countSubcategoryProducts(products: Product[], subcategory: Subcategory): number {
  return products.filter((product) => product.subcategoryId === subcategory.id).length;
}

export type { Subcategory };

export function subcategoryBelongsToCategory(
  subcategory: Subcategory,
  categoryId: CategoryId,
): boolean {
  return subcategory.categoryId === categoryId;
}
