import type { Product } from "./types";

export const FIBERGLASS_REBAR_CATEGORY_ID = "fiberglass-rebar";

export const FIBERGLASS_PLACEHOLDER_COIL = "/products/fiberglass/placeholder-coil.webp";
export const FIBERGLASS_PLACEHOLDER_RODS = "/products/fiberglass/placeholder-rods.webp";

export function isFiberglassRebar(product: Product): boolean {
  return product.categoryId === FIBERGLASS_REBAR_CATEGORY_ID;
}

export function isFiberglassCoil(product: Product): boolean {
  return isFiberglassRebar(product) && product.saleUnit === "боб";
}

export function isFiberglassRod(product: Product): boolean {
  return isFiberglassRebar(product) && product.saleUnit === "шт";
}

export function shouldShowFiberglassPlaceholder(product: Product): boolean {
  if (!isFiberglassRebar(product)) return false;
  if (!product.image) return true;
  return product.image === "/products/fiberglass-rebar.webp";
}

export type FiberglassDiagramKind = "coil" | "rod";

export function fiberglassDiagramKind(product: Product): FiberglassDiagramKind {
  return isFiberglassCoil(product) ? "coil" : "rod";
}

export function fiberglassPlaceholderSrc(kind: FiberglassDiagramKind): string {
  return kind === "coil" ? FIBERGLASS_PLACEHOLDER_COIL : FIBERGLASS_PLACEHOLDER_RODS;
}
