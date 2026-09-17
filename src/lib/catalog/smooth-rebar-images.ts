import type { Product } from "./types";

import { REBAR_SMOOTH_CATEGORY_ID } from "./rebar-visual";

/** Артикулы гладкой витрины с уникальной иллюстрацией в UI. */
export const SMOOTH_REBAR_CATALOG_ARTICLES = new Set([
  "10388",
  "08583",
  "08729",
  "11533",
  "10510",
  "12420",
  "09228",
]);

function articleFromSlug(slug: string): string | undefined {
  return slug.match(/-art-(\d{5})$/i)?.[1];
}

function normalizeArticle(
  article: string | undefined,
  allowed: Set<string>,
): string | undefined {
  if (!article) return undefined;
  if (allowed.has(article)) return article;
  const digits = article.replace(/\D/g, "");
  if (digits.length >= 5) {
    const key = digits.slice(-5).padStart(5, "0");
    if (allowed.has(key)) return key;
  }
  return undefined;
}

export function smoothRebarCatalogArticle(product: Product): string | undefined {
  const fromSlug = normalizeArticle(articleFromSlug(product.slug), SMOOTH_REBAR_CATALOG_ARTICLES);
  if (fromSlug) return fromSlug;

  if (product.categoryId !== REBAR_SMOOTH_CATEGORY_ID) return undefined;

  return normalizeArticle(product.article, SMOOTH_REBAR_CATALOG_ARTICLES);
}

export function smoothRebarCatalogImagePath(product: Product): string | undefined {
  const art = smoothRebarCatalogArticle(product);
  if (!art) return undefined;
  return `/products/rebar-catalog/smooth/art-${art}.svg`;
}

export function isSmoothRebarCatalogImage(path: string | undefined): boolean {
  return Boolean(path?.includes("/rebar-catalog/smooth/art-"));
}
