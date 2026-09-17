import type { Product } from "./types";

const bySlug = new Map<string, Product>();

export function rememberDbProducts(products: Product[]): void {
  for (const product of products) {
    bySlug.set(product.slug, product);
  }
}

export function getCachedDbProduct(slug: string): Product | undefined {
  return bySlug.get(slug);
}

export function hasCachedDbProduct(slug: string): boolean {
  return bySlug.has(slug);
}
