import { isRibbedRebarCatalogImage, ribbedRebarCatalogArticle } from "./ribbed-rebar-images";
import { isSmoothRebarCatalogImage, smoothRebarCatalogArticle } from "./smooth-rebar-images";
import type { Product } from "./types";

export const REBAR_RIBBED_CATEGORY_ID = "rebar-ribbed";
export const REBAR_SMOOTH_CATEGORY_ID = "rebar-smooth";

const REBAR_DIAGRAM_CATEGORY_IDS = new Set([REBAR_RIBBED_CATEGORY_ID, REBAR_SMOOTH_CATEGORY_ID]);

/** Плейсхолдеры — заменяются схемой с размерами; своё фото из админки перекрывает. */
const REBAR_DIAGRAM_PLACEHOLDER_IMAGES = new Set([
  "/products/rebar-ribbed.webp",
  "/products/rebar-smooth.webp",
]);

export function isSmoothRebarDiagram(product: Product): boolean {
  return product.categoryId === REBAR_SMOOTH_CATEGORY_ID;
}

export function shouldShowRebarDiagram(product: Product): boolean {
  if (!REBAR_DIAGRAM_CATEGORY_IDS.has(product.categoryId)) return false;
  if (ribbedRebarCatalogArticle(product)) return false;
  if (smoothRebarCatalogArticle(product)) return false;
  if (isRibbedRebarCatalogImage(product.image)) return false;
  if (isSmoothRebarCatalogImage(product.image)) return false;
  if (!product.image) return true;
  return REBAR_DIAGRAM_PLACEHOLDER_IMAGES.has(product.image);
}

export function rebarDiagramDiameterMm(product: Product): number {
  if (Number.isFinite(product.dimension) && product.dimension > 0) return product.dimension;
  const match = product.size.match(/(\d+(?:[.,]\d+)?)/);
  return match ? Number(match[1].replace(",", ".")) : 12;
}

export function rebarDiagramLengthM(product: Product): number {
  return product.lengthM ?? 11.7;
}
