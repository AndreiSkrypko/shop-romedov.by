import type { Product } from "./types";

import { REBAR_RIBBED_CATEGORY_ID } from "./rebar-visual";

/** Артикулы рифлёной витрины с уникальной иллюстрацией в UI. */
export const RIBBED_REBAR_CATALOG_ARTICLES = new Set([
  "08152",
  "16068",
  "10311",
  "06626",
  "08663",
  "05862",
  "08492",
  "08750",
]);

function ribbedArticleFromSlug(slug: string): string | undefined {
  return slug.match(/-art-(\d{5})$/i)?.[1];
}

function normalizeArticle(article: string | undefined): string | undefined {
  if (!article) return undefined;
  if (RIBBED_REBAR_CATALOG_ARTICLES.has(article)) return article;
  const digits = article.replace(/\D/g, "");
  if (digits.length >= 5) {
    const key = digits.slice(-5).padStart(5, "0");
    if (RIBBED_REBAR_CATALOG_ARTICLES.has(key)) return key;
  }
  return undefined;
}

/** Артикул для компонента RibbedRebarCatalogIllustration. */
export function ribbedRebarCatalogArticle(product: Product): string | undefined {
  const fromSlug = normalizeArticle(ribbedArticleFromSlug(product.slug));
  if (fromSlug) return fromSlug;

  if (product.categoryId !== REBAR_RIBBED_CATEGORY_ID) return undefined;

  return normalizeArticle(product.article);
}

/** @deprecated Используйте ribbedRebarCatalogArticle + React-иллюстрацию. */
export function ribbedRebarCatalogImagePath(product: Product): string | undefined {
  const art = ribbedRebarCatalogArticle(product);
  if (!art) return undefined;
  return `/products/rebar-catalog/ribbed/art-${art}.svg`;
}

export function isRibbedRebarCatalogImage(path: string | undefined): boolean {
  return Boolean(path?.includes("/rebar-catalog/ribbed/art-"));
}
