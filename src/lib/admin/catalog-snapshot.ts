import type { Category, Product, Subcategory } from "@/lib/catalog/types";

import { listAdminCategoriesFromDb } from "./admin-categories";
import { listAdminProductsFromDb } from "./admin-products";
import { listAdminSubcategoriesFromDb } from "./admin-subcategories";

export type ProductPlacement = "in_subcategory" | "in_category" | "needs_subcategory";

export type AdminCategoryRow = {
  category: Category;
  subcategoryCount: number;
  productCount: number;
  productsInSubcategories: number;
  productsInCategoryOnly: number;
  unassignedToSubcategory: number;
};

export type AdminProductRow = {
  product: Product;
  categoryName: string;
  subcategoryName: string | null;
  placement: ProductPlacement;
};

export type AdminCatalogSnapshot = {
  stats: {
    categories: number;
    subcategories: number;
    orphanedSubcategories: number;
    products: number;
    productsNeedSubcategory: number;
  };
  categories: AdminCategoryRow[];
  products: AdminProductRow[];
  subcategories: Subcategory[];
  orphanedSubcategories: Subcategory[];
  dbCategoryIds: string[];
};

function subsForCategory(subcategories: Subcategory[], categoryId: string): Subcategory[] {
  return subcategories.filter((s) => s.categoryId === categoryId);
}

function resolvePlacement(
  product: Product,
  categoryHasSubs: boolean,
  subcategoryName: string | null,
): ProductPlacement {
  if (product.subcategoryId && subcategoryName) return "in_subcategory";
  if (categoryHasSubs && !product.subcategoryId) return "needs_subcategory";
  return "in_category";
}

export async function buildAdminCatalogSnapshot(): Promise<AdminCatalogSnapshot> {
  let dbProducts: Product[] = [];
  let dbCategories: Category[] = [];
  let subcategories: Subcategory[] = [];

  try {
    dbProducts = await listAdminProductsFromDb();
  } catch {
    dbProducts = [];
  }

  try {
    dbCategories = await listAdminCategoriesFromDb();
  } catch {
    dbCategories = [];
  }

  try {
    subcategories = await listAdminSubcategoriesFromDb();
  } catch {
    subcategories = [];
  }

  const categoryIds = new Set(dbCategories.map((c) => c.id));
  const linkedSubcategories = subcategories.filter((s) => categoryIds.has(s.categoryId));
  const orphanedSubcategories = subcategories.filter((s) => !categoryIds.has(s.categoryId));

  const subcategoryById = new Map(subcategories.map((s) => [s.id, s]));
  const categoryNameById = new Map(dbCategories.map((c) => [c.id, c.name]));
  const subsCountByCategory = new Map<string, number>();
  for (const sub of subcategories) {
    subsCountByCategory.set(sub.categoryId, (subsCountByCategory.get(sub.categoryId) ?? 0) + 1);
  }

  const categories: AdminCategoryRow[] = dbCategories
    .map((category) => {
      const catProducts = dbProducts.filter((p) => p.categoryId === category.id);
      const subcategoryCount = subsCountByCategory.get(category.id) ?? 0;
      const productsInSubcategories = catProducts.filter((p) => p.subcategoryId).length;
      const productsInCategoryOnly = catProducts.filter((p) => !p.subcategoryId).length;
      const unassignedToSubcategory =
        subcategoryCount > 0 ? productsInCategoryOnly : 0;

      return {
        category,
        subcategoryCount,
        productCount: catProducts.length,
        productsInSubcategories,
        productsInCategoryOnly,
        unassignedToSubcategory,
      };
    })
    .sort((a, b) => a.category.order - b.category.order);

  const products: AdminProductRow[] = dbProducts
    .map((product) => {
      const categoryName =
        categoryNameById.get(product.categoryId) ?? product.categoryId;
      const sub = product.subcategoryId ? subcategoryById.get(product.subcategoryId) : undefined;
      const subcategoryName = sub?.name ?? null;
      const categoryHasSubs = (subsCountByCategory.get(product.categoryId) ?? 0) > 0;

      return {
        product,
        categoryName,
        subcategoryName,
        placement: resolvePlacement(product, categoryHasSubs, subcategoryName),
      };
    })
    .sort((a, b) => a.product.name.localeCompare(b.product.name, "ru"));

  const productsNeedSubcategory = products.filter((r) => r.placement === "needs_subcategory").length;

  return {
    stats: {
      categories: dbCategories.length,
      subcategories: linkedSubcategories.length,
      orphanedSubcategories: orphanedSubcategories.length,
      products: dbProducts.length,
      productsNeedSubcategory,
    },
    categories,
    products,
    subcategories,
    orphanedSubcategories,
    dbCategoryIds: dbCategories.map((c) => c.id),
  };
}
