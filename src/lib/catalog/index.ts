import { CATEGORIES, CATEGORIES_BY_ORDER, findCategoryBySlug, getCategoryById } from "./categories";
import {
  fiberglassDiagramKind,
  fiberglassPlaceholderSrc,
  shouldShowFiberglassPlaceholder,
} from "./fiberglass-visual";
import { ribbedRebarCatalogImagePath } from "./ribbed-rebar-images";
import { smoothRebarCatalogImagePath } from "./smooth-rebar-images";
import { resolvePublicAssetUrl } from "@/lib/utils";
import { PRODUCTS } from "./products";
import {
  listProductsByCategory,
  listProductsByCategoryAsync,
  resolveProduct,
  resolveProductAsync,
} from "./repository";
import type { Category, CategoryId, Product, SaleUnit, StockState } from "./types";

export { CATEGORIES, CATEGORIES_BY_ORDER, findCategoryBySlug, getCategoryById };
export {
  findCategoryBySlugAsync,
  getCategoryByIdAsync,
  listCategoriesAsync,
} from "./category-repository";
export {
  CatalogCategoriesProvider,
  categoryFromList,
  useCatalogCategories,
  useProductCountByCategory,
  useTotalPublishedProductCount,
} from "./catalog-context";
export { PRODUCTS };
export {
  hydrateDbProductsForSlugs,
  listProductsByCategory,
  listProductsByCategoryAsync,
  resolveProduct,
  resolveProductAsync,
} from "./repository";
export type { Category, CategoryId, Product, SaleUnit, StockState };
export {
  countSubcategoryProducts,
  filterProductsBySubcategory,
  findSubcategory,
  subcategoryBelongsToCategory,
} from "./subcategories";
export type { Subcategory } from "./subcategories";
export { listSubcategoriesByCategoryAsync } from "./subcategory-repository";

export function findProductBySlug(slug: string): Product | undefined {
  return resolveProduct(slug);
}

export async function findProductBySlugAsync(slug: string): Promise<Product | undefined> {
  return resolveProductAsync(slug);
}

export function getProductsByCategory(categoryId: CategoryId): Product[] {
  return listProductsByCategory(categoryId);
}

export async function getProductsByCategoryAsync(categoryId: CategoryId): Promise<Product[]> {
  return listProductsByCategoryAsync(categoryId);
}

export function productImage(product: Product): string {
  const ribbedArt = ribbedRebarCatalogImagePath(product);
  if (ribbedArt) return resolvePublicAssetUrl(ribbedArt);

  const smoothArt = smoothRebarCatalogImagePath(product);
  if (smoothArt) return resolvePublicAssetUrl(smoothArt);

  if (shouldShowFiberglassPlaceholder(product)) {
    return resolvePublicAssetUrl(fiberglassPlaceholderSrc(fiberglassDiagramKind(product)));
  }

  const img = product.image?.trim();
  if (img) return resolvePublicAssetUrl(img);

  try {
    return resolvePublicAssetUrl(getCategoryById(product.categoryId).image);
  } catch {
    return resolvePublicAssetUrl("/products/supplies.webp");
  }
}

export function productCardTitle(product: Product): string {
  return product.cardTitle ?? product.name;
}

/** Цена и единица для плитки каталога (приоритет — цена за метр). */
export function catalogCardPrice(product: Product): { value: number; unitLabel: string } {
  if (product.pricePerMeter != null) {
    return { value: product.pricePerMeter, unitLabel: "м" };
  }
  if (product.pricePerTon != null) {
    return { value: product.pricePerTon, unitLabel: "т" };
  }
  return { value: unitPrice(product), unitLabel: saleUnitLabel(product.saleUnit) };
}

export { fetchPopularProductsFromSupabase as getPopularProductsAsync } from "@/lib/supabase/queries";

/** Похожие позиции из той же категории — для карточки товара. */
export function getRelatedProducts(product: Product, peers: Product[], limit = 4): Product[] {
  return peers
    .filter((item) => item.slug !== product.slug)
    .sort(
      (a, b) =>
        Math.abs(a.dimension - product.dimension) - Math.abs(b.dimension - product.dimension),
    )
    .slice(0, limit);
}

// --- Цены и вес -------------------------------------------------------------

/** Цена за одну единицу продажи (метр, лист, карту, штуку), BYN. */
export function unitPrice(product: Product): number {
  if (product.pricePerUnit !== null) return product.pricePerUnit;
  if (product.pricePerTon !== null) return (product.weightKg / 1000) * product.pricePerTon;
  if (product.pricePerMeter != null) return product.pricePerMeter;
  return 0;
}

/** Цена за тонну, BYN — если товар тарифицируется по весу. */
export function tonPrice(product: Product): number | null {
  return product.pricePerTon;
}

export function lineWeightKg(product: Product, quantity: number): number {
  return product.weightKg * quantity;
}

export function lineTotal(product: Product, quantity: number): number {
  return unitPrice(product) * quantity;
}

/** Шаг заказа: метраж целыми метрами, штучное — целыми единицами. */
export function quantityStep(product: Product): number {
  return 1;
}

export function minQuantity(product: Product): number {
  return 1;
}

/** Округляет количество до допустимого шага (минимум 1). */
export function clampOrderQuantity(product: Product, quantity: number): number {
  const step = quantityStep(product);
  const min = minQuantity(product);
  if (!Number.isFinite(quantity)) return min;
  return Math.max(min, Math.round(quantity / step) * step);
}

export function stockStatusLabel(stock: StockState): string {
  switch (stock) {
    case "in":
      return "В наличии";
    case "out":
      return "Нет в наличии";
    case "order":
      return "Под заказ";
  }
}

/** CSS-классы бейджа наличия на витрине. */
export function stockStatusBadgeClass(stock: StockState): string {
  switch (stock) {
    case "in":
      return "bg-lime/20 text-lime-deep";
    case "out":
      return "bg-destructive/10 text-destructive";
    case "order":
      return "bg-secondary text-muted-foreground";
  }
}

export function stockStatusInlineClass(stock: StockState): string {
  switch (stock) {
    case "in":
      return "font-medium text-lime-deep";
    case "out":
      return "font-medium text-destructive";
    case "order":
      return "font-medium text-amber-800 dark:text-amber-200";
  }
}

export function isProductInStock(product: Product): boolean {
  return product.stock === "in";
}

export function productIsOnOrder(product: Product): boolean {
  return product.stock === "order";
}

/** Корзина только для «В наличии» и при указанной цене. */
export function canAddProductToCart(product: Product): boolean {
  if (!isProductInStock(product)) return false;
  return (
    product.pricePerMeter != null ||
    product.pricePerTon != null ||
    product.pricePerUnit != null
  );
}

export function productRequestDefaultMessage(product: Product): string {
  const sizePart = product.size ? `, ${product.size}` : "";
  return `Интересует: ${product.name}${sizePart}. Объём и срок поставки: `;
}

export function saleUnitLabel(unit: SaleUnit): string {
  switch (unit) {
    case "м":
      return "м";
    case "лист":
      return "лист";
    case "карта":
      return "карта";
    case "шт":
      return "шт";
    case "боб":
      return "боб";
  }
}

/** Подпись единицы на витрине (бухта / пруток для композитной арматуры). */
export function saleUnitLabelForProduct(product: Product): string {
  if (product.categoryId === "fiberglass-rebar") {
    if (product.saleUnit === "боб") return "бухта";
    if (product.saleUnit === "шт") return "пруток";
  }
  return saleUnitLabel(product.saleUnit);
}

/** «кг/м», «кг/лист» — подпись к удельному весу. */
export function weightUnitLabel(product: Product): string {
  return `кг/${saleUnitLabelForProduct(product)}`;
}

// --- Форматирование ---------------------------------------------------------

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return `${priceFormatter.format(value)} р.`;
}

/** Цена в белорусских рублях для витрины (как на референсе). */
export function formatPriceByn(value: number): string {
  return `${priceFormatter.format(value)} BYN`;
}

export function formatPriceCompact(value: number): string {
  return `${compactFormatter.format(Math.round(value))} р.`;
}

export function formatQuantity(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(".", ",");
}

/** Число как есть, но с запятой в качестве разделителя: 10.4 → «10,4». */
export function formatDecimal(value: number): string {
  return String(value).replace(".", ",");
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2).replace(".", ",")} т`;
  if (kg >= 100) return `${kg.toFixed(0)} кг`;
  if (kg >= 1) return `${kg.toFixed(1).replace(".", ",")} кг`;
  return `${kg.toFixed(2).replace(".", ",")} кг`;
}

// --- Фильтры и сортировка ---------------------------------------------------

export type SortKey = "popular" | "price-asc" | "price-desc" | "size-asc" | "size-desc";

export const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: "popular", label: "По популярности" },
  { key: "size-asc", label: "Размер: по возрастанию" },
  { key: "size-desc", label: "Размер: по убыванию" },
];

export type CatalogFilters = {
  steel: string[];
  onlyInStock: boolean;
  sort: SortKey;
};

export const EMPTY_FILTERS: CatalogFilters = {
  steel: [],
  onlyInStock: false,
  sort: "popular",
};

export function getSteelOptions(products: Product[]): string[] {
  return [...new Set(products.map((product) => product.steel))].sort((a, b) =>
    a.localeCompare(b, "ru"),
  );
}

export function applyFilters(products: Product[], filters: CatalogFilters): Product[] {
  const filtered = products.filter((product) => {
    if (filters.onlyInStock && product.stock !== "in") return false;
    if (filters.steel.length > 0 && !filters.steel.includes(product.steel)) return false;
    return true;
  });

  return sortProducts(filtered, filters.sort);
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => unitPrice(a) - unitPrice(b));
    case "price-desc":
      return sorted.sort((a, b) => unitPrice(b) - unitPrice(a));
    case "size-asc":
      return sorted.sort((a, b) => a.dimension - b.dimension);
    case "size-desc":
      return sorted.sort((a, b) => b.dimension - a.dimension);
    case "popular":
      return sorted.sort((a, b) => {
        if (a.popular !== b.popular) return a.popular ? -1 : 1;
        const ao = a.catalogSort ?? a.dimension;
        const bo = b.catalogSort ?? b.dimension;
        if (ao !== bo) return ao - bo;
        return a.dimension - b.dimension;
      });
  }
}

// --- Поиск ------------------------------------------------------------------

function searchInProductList(products: Product[], query: string, limit: number): Product[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];

  const words = needle.split(/\s+/);

  return products
    .filter((product) => {
      const haystack = [
        product.name,
        product.size,
        product.steel,
        product.gost,
        product.article ?? "",
        getCategoryById(product.categoryId).name,
      ]
        .join(" ")
        .toLowerCase();

      return words.every((word) => haystack.includes(word));
    })
    .slice(0, limit);
}

export function searchProducts(query: string, limit = 24): Product[] {
  return searchInProductList([], query, limit);
}

export function searchProductsInList(
  products: Product[],
  categories: Category[],
  query: string,
  limit = 24,
): Product[] {
  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];

  const words = needle.split(/\s+/);

  return products
    .filter((product) => {
      const haystack = [
        product.name,
        product.size,
        product.steel,
        product.gost,
        product.article ?? "",
        categoryNameById.get(product.categoryId) ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return words.every((word) => haystack.includes(word));
    })
    .slice(0, limit);
}
