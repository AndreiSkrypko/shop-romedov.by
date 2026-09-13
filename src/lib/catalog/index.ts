import { CATEGORIES, CATEGORIES_BY_ORDER, findCategoryBySlug, getCategoryById } from "./categories";
import { PRODUCTS } from "./products";
import type { Category, CategoryId, Product, SaleUnit } from "./types";

export { CATEGORIES, CATEGORIES_BY_ORDER, findCategoryBySlug, getCategoryById };
export { PRODUCTS };
export type { Category, CategoryId, Product, SaleUnit };

const PRODUCT_BY_SLUG = new Map<string, Product>(PRODUCTS.map((item) => [item.slug, item]));

export function findProductBySlug(slug: string): Product | undefined {
  return PRODUCT_BY_SLUG.get(slug);
}

export function getProductsByCategory(categoryId: CategoryId): Product[] {
  return PRODUCTS.filter((product) => product.categoryId === categoryId);
}

export function countProductsByCategory(categoryId: CategoryId): number {
  return getProductsByCategory(categoryId).length;
}

export function getPopularProducts(limit = 8): Product[] {
  return PRODUCTS.filter((product) => product.popular).slice(0, limit);
}

/** Похожие позиции из той же категории — для карточки товара. */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return getProductsByCategory(product.categoryId)
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

/** Минимальный шаг заказа: метраж кратен 0,1 м, штучное — целыми. */
export function quantityStep(product: Product): number {
  return product.saleUnit === "м" ? 0.5 : 1;
}

export function minQuantity(product: Product): number {
  return quantityStep(product);
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
  }
}

/** «кг/м», «кг/лист» — подпись к удельному весу. */
export function weightUnitLabel(product: Product): string {
  return `кг/${saleUnitLabel(product.saleUnit)}`;
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
  { key: "price-asc", label: "Цена: сначала дешевле" },
  { key: "price-desc", label: "Цена: сначала дороже" },
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
        return a.dimension - b.dimension;
      });
  }
}

// --- Поиск ------------------------------------------------------------------

export function searchProducts(query: string, limit = 24): Product[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];

  const words = needle.split(/\s+/);

  return PRODUCTS.filter((product) => {
    const haystack = [
      product.name,
      product.size,
      product.steel,
      product.gost,
      getCategoryById(product.categoryId).name,
    ]
      .join(" ")
      .toLowerCase();

    return words.every((word) => haystack.includes(word));
  }).slice(0, limit);
}
