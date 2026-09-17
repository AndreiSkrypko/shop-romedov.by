import { CATEGORIES } from "./categories";
import { PRODUCTS } from "./products";

/** Списки для пререндера в vite.config.ts и генерации sitemap.xml. */
export const CATEGORY_SLUGS: string[] = CATEGORIES.map((category) => category.slug);

/** Статические slug; при сборке vite.config дополняет slug из Supabase. */
export const PRODUCT_SLUGS: string[] = PRODUCTS.map((product) => product.slug);
