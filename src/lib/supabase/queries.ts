import type { Category, CategoryId, Product, Subcategory } from "@/lib/catalog/types";

import { getSupabase } from "./client";
import { mapCategoryRow } from "./map-category";
import { mapProductRow } from "./map-product";
import { mapSubcategoryRow } from "./map-subcategory";
import type { CategoryRow, ProductRow, SubcategoryRow } from "./types";

function productsTable() {
  return getSupabase().from("products");
}

function categoriesTable() {
  return getSupabase().from("categories");
}

function subcategoriesTable() {
  return getSupabase().from("subcategories");
}

export async function fetchSubcategoriesByCategoryFromSupabase(
  categoryId: CategoryId,
): Promise<Subcategory[]> {
  const { data, error } = await subcategoriesTable()
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.warn(`[supabase] subcategories ${categoryId}:`, error.message);
    return [];
  }

  return (data ?? []).map((row) => mapSubcategoryRow(row as SubcategoryRow));
}

export async function fetchSupabaseCategorySlugs(): Promise<string[]> {
  const { data, error } = await categoriesTable()
    .select("slug")
    .eq("is_published", true);

  if (error) {
    console.warn("[supabase] category slugs:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.slug);
}

export async function fetchPublishedCategoriesFromSupabase(): Promise<Category[]> {
  const { data, error } = await categoriesTable()
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.warn("[supabase] categories:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapCategoryRow(row as CategoryRow));
}

export async function fetchSupabaseProductSlugs(): Promise<string[]> {
  const { data, error } = await productsTable()
    .select("slug")
    .eq("is_published", true);

  if (error) {
    console.warn("[supabase] slug list:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.slug);
}

export async function fetchProductBySlugFromSupabase(slug: string): Promise<Product | undefined> {
  const { data, error } = await productsTable()
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.warn(`[supabase] product ${slug}:`, error.message);
    return undefined;
  }

  if (!data) return undefined;
  return mapProductRow(data as ProductRow);
}

export async function fetchProductsByCategoryFromSupabase(
  categoryId: CategoryId,
): Promise<Product[]> {
  const { data, error } = await productsTable()
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_published", true)
    .order("dimension", { ascending: true });

  if (error) {
    console.warn(`[supabase] category ${categoryId}:`, error.message);
    return [];
  }

  return (data ?? [])
    .map((row) => mapProductRow(row as ProductRow))
    .sort(
      (a, b) =>
        (a.catalogSort ?? 0) - (b.catalogSort ?? 0) ||
        a.dimension - b.dimension ||
        a.slug.localeCompare(b.slug, "ru"),
    );
}

export async function searchProductsInSupabase(query: string, limit: number): Promise<Product[]> {
  const needle = query.trim();
  if (needle.length < 2) return [];

  const pattern = `%${needle.replace(/%/g, "")}%`;
  const { data, error } = await productsTable()
    .select("*")
    .eq("is_published", true)
    .or(
      `name.ilike.${pattern},size.ilike.${pattern},steel.ilike.${pattern},gost.ilike.${pattern},article.ilike.${pattern}`,
    )
    .limit(limit);

  if (error) {
    console.warn("[supabase] search:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapProductRow(row as ProductRow));
}

export async function fetchProductsBySlugsFromSupabase(slugs: string[]): Promise<Product[]> {
  if (slugs.length === 0) return [];

  const { data, error } = await productsTable()
    .select("*")
    .in("slug", slugs)
    .eq("is_published", true);

  if (error) {
    console.warn("[supabase] batch slugs:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapProductRow(row as ProductRow));
}

export async function fetchProductCountsByCategoryFromSupabase(): Promise<Record<string, number>> {
  const { data, error } = await productsTable().select("category_id").eq("is_published", true);

  if (error) {
    console.warn("[supabase] product counts:", error.message);
    return {};
  }

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const id = row.category_id as string;
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}

export async function fetchPopularProductsFromSupabase(limit: number): Promise<Product[]> {
  const { data, error } = await productsTable()
    .select("*")
    .eq("is_published", true)
    .eq("popular", true)
    .order("category_id", { ascending: true })
    .order("dimension", { ascending: true })
    .limit(limit);

  if (error) {
    console.warn("[supabase] popular products:", error.message);
    return [];
  }

  return (data ?? [])
    .map((row) => mapProductRow(row as ProductRow))
    .filter((product) => product.popular === true);
}
