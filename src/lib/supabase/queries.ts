import type { CategoryId, Product } from "@/lib/catalog/types";

import { getSupabase } from "./client";
import { mapProductRow } from "./map-product";
import type { ProductRow } from "./types";

function productsTable() {
  return getSupabase().from("products");
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

  return (data ?? []).map((row) => mapProductRow(row as ProductRow));
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
