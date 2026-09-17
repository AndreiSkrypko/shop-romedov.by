import { getSupabase } from "@/lib/supabase/client";
import { mapCategoryRow } from "@/lib/supabase/map-category";
import type { CategoryRow } from "@/lib/supabase/types";
import type { Category } from "@/lib/catalog/types";

import { ADMIN_RPC_SECRET } from "./constants";
import type { AdminCategoryInput } from "./category-input";

function rpcError(error: { message: string; code?: string }, fallback: string): never {
  if (error.message.includes("forbidden")) {
    throw new Error("RPC админки не настроен в Supabase (scripts/supabase-admin-rpc.sql)");
  }
  if (error.message.includes("category_has_products")) {
    throw new Error("Нельзя удалить категорию: в ней есть товары в базе");
  }
  if (error.message.includes("not_found")) {
    throw new Error("Категория не найдена в базе");
  }
  if (error.code === "23505") {
    throw new Error("Категория с таким id или slug уже есть");
  }
  throw new Error(error.message || fallback);
}

export async function listAdminCategoriesFromDb(): Promise<Category[]> {
  const { data, error } = await getSupabase().rpc("admin_list_categories", {
    admin_secret: ADMIN_RPC_SECRET,
  });

  if (error) rpcError(error, "Не удалось загрузить категории");
  return (data ?? []).map((row) => mapCategoryRow(row as CategoryRow));
}

export async function insertAdminCategory(input: AdminCategoryInput): Promise<string> {
  const { data, error } = await getSupabase().rpc("admin_insert_category", {
    admin_secret: ADMIN_RPC_SECRET,
    p_id: input.id,
    p_slug: input.slug,
    p_name: input.name,
    p_menu_name: input.menuName,
    p_tagline: input.tagline,
    p_description: input.description,
    p_image: input.image,
    p_sort_order: input.sortOrder,
    p_dimension_label: input.dimensionLabel,
    p_seo_title: input.seoTitle ?? input.name,
    p_seo_description: input.seoDescription ?? input.description,
    p_is_published: input.isPublished,
  });

  if (error) rpcError(error, "Не удалось создать категорию");
  return String(data);
}

export async function updateAdminCategory(input: AdminCategoryInput): Promise<void> {
  const { error } = await getSupabase().rpc("admin_update_category", {
    admin_secret: ADMIN_RPC_SECRET,
    p_id: input.id,
    p_slug: input.slug,
    p_name: input.name,
    p_menu_name: input.menuName,
    p_tagline: input.tagline,
    p_description: input.description,
    p_image: input.image,
    p_sort_order: input.sortOrder,
    p_dimension_label: input.dimensionLabel,
    p_seo_title: input.seoTitle ?? input.name,
    p_seo_description: input.seoDescription ?? input.description,
    p_is_published: input.isPublished,
  });

  if (error) rpcError(error, "Не удалось обновить категорию");
}

export async function deleteAdminCategory(id: string): Promise<void> {
  const { error } = await getSupabase().rpc("admin_delete_category", {
    admin_secret: ADMIN_RPC_SECRET,
    p_id: id,
  });

  if (error) rpcError(error, "Не удалось удалить категорию");
}
