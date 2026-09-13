import type { CategoryId, Product } from "./types";

/** Включить выгрузку демо-товаров вместо статического сортамента в выбранной категории. */
export const CATALOG_USE_DEMO_DB = true;

/**
 * Имитация ответа БД для показа клиенту.
 * После подключения API замените вызовы на fetch и оставьте тот же тип Product.
 */
export const DEMO_DB_CATEGORY_ID: CategoryId = "fiberglass-rebar";

export const DEMO_DB_PRODUCTS: Product[] = [
  {
    slug: "sterzhen-stekloplastikovyy-ssp-8-50-buhta-50m",
    categoryId: DEMO_DB_CATEGORY_ID,
    name: "Стержень стеклопластиковый ССП-8-50 ТУ BY 291411223.001-2019",
    cardTitle: "Арматура стеклопластиковая ф. 8 бухта 50 м",
    article: "15191",
    size: "Ø8 мм",
    dimension: 8,
    steel: "ССП-8-50",
    gost: "ТУ BY 291411223.001-2019",
    lengthM: 50,
    saleUnit: "боб",
    weightKg: 3.6,
    pricePerTon: null,
    pricePerUnit: 59.5,
    pricePerMeter: 1.19,
    metersPerSaleUnit: 50,
    stock: "in",
    popular: true,
    source: "db",
    image: "/products/fiberglass-rebar.webp",
  },
];

const BY_CATEGORY = new Map<CategoryId, Product[]>(
  DEMO_DB_PRODUCTS.reduce((acc, product) => {
    const list = acc.get(product.categoryId) ?? [];
    list.push(product);
    acc.set(product.categoryId, list);
    return acc;
  }, new Map<CategoryId, Product[]>()),
);

/** Синхронный «запрос» — позже станет async fetch к API. */
export function loadProductsFromDemoDb(categoryId: CategoryId): Product[] {
  return BY_CATEGORY.get(categoryId) ?? [];
}

export function loadProductFromDemoDb(slug: string): Product | undefined {
  return DEMO_DB_PRODUCTS.find((item) => item.slug === slug);
}
