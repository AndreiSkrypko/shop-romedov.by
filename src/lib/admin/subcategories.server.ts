import { getSupabase } from "@/lib/supabase/client";
import { mapSubcategoryRow } from "@/lib/supabase/map-subcategory";
import type { SubcategoryRow } from "@/lib/supabase/types";
import type { Subcategory } from "@/lib/catalog/types";

import { ADMIN_RPC_SECRET } from "./constants.server";
import type { AdminSubcategoryInput } from "./subcategory-input";

function rpcError(error: { message: string; code?: string }, fallback: string): never {
  if (error.message.includes("forbidden")) {
    throw new Error("RPC не настроен — выполните scripts/supabase-subcategories.sql");
  }
  if (error.message.includes("subcategory_has_products")) {
    throw new Error("Нельзя удалить: в подкатегории есть товары");
  }
  if (error.message.includes("not_found")) {
    throw new Error("Подкатегория не найдена");
  }
  if (error.code === "23505") {
    throw new Error("Подкатегория с таким id или slug уже есть");
  }
  throw new Error(error.message || fallback);
}

export async function listAdminSubcategoriesFromDb(
  categoryId?: string,
): Promise<Subcategory[]> {
  const { data, error } = await getSupabase().rpc("admin_list_subcategories", {
    admin_secret: ADMIN_RPC_SECRET,
    p_category_id: categoryId ?? null,
  });

  if (error) rpcError(error, "Не удалось загрузить подкатегории");
  return (data ?? []).map((row) => mapSubcategoryRow(row as SubcategoryRow));
}

export async function insertAdminSubcategory(input: AdminSubcategoryInput): Promise<string> {
  const { data, error } = await getSupabase().rpc("admin_insert_subcategory", {
    admin_secret: ADMIN_RPC_SECRET,
    p_id: input.id,
    p_category_id: input.categoryId,
    p_slug: input.slug,
    p_name: input.name,
    p_image: input.image,
    p_sort_order: input.sortOrder,
    p_is_published: input.isPublished,
  });

  if (error) rpcError(error, "Не удалось создать подкатегорию");
  return String(data);
}

export async function updateAdminSubcategory(input: AdminSubcategoryInput): Promise<void> {
  const { error } = await getSupabase().rpc("admin_update_subcategory", {
    admin_secret: ADMIN_RPC_SECRET,
    p_id: input.id,
    p_category_id: input.categoryId,
    p_slug: input.slug,
    p_name: input.name,
    p_image: input.image,
    p_sort_order: input.sortOrder,
    p_is_published: input.isPublished,
  });

  if (error) rpcError(error, "Не удалось обновить подкатегорию");
}

export async function deleteAdminSubcategory(id: string): Promise<void> {
  const { error } = await getSupabase().rpc("admin_delete_subcategory", {
    admin_secret: ADMIN_RPC_SECRET,
    p_id: id,
  });

  if (error) rpcError(error, "Не удалось удалить подкатегорию");
}
