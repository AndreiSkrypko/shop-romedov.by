import { getSupabase } from "@/lib/supabase/client";
import { mapProductRow } from "@/lib/supabase/map-product";
import type { ProductRow } from "@/lib/supabase/types";

import { ADMIN_RPC_SECRET } from "./constants";
import type { AdminProductInput } from "./product-input";

function rpcError(error: { message: string; code?: string }, fallback: string): never {
  if (error.message.includes("forbidden")) {
    throw new Error("RPC админки не настроен в Supabase (scripts/supabase-admin-rpc.sql)");
  }
  if (error.message.includes("not_found")) {
    throw new Error("Товар не найден в базе");
  }
  if (error.code === "23505") {
    throw new Error("Товар с таким slug уже есть");
  }
  throw new Error(error.message || fallback);
}

function productRpcPayload(input: AdminProductInput) {
  return {
    admin_secret: ADMIN_RPC_SECRET,
    p_slug: input.slug,
    p_category_id: input.categoryId,
    p_subcategory_id: input.subcategoryId ?? "",
    p_name: input.name,
    p_size: input.size,
    p_dimension: input.dimension,
    p_steel: input.steel,
    p_gost: input.gost,
    p_length_m: input.lengthM,
    p_sale_unit: input.saleUnit,
    p_weight_kg: input.weightKg,
    p_price_per_ton: input.pricePerTon,
    p_price_per_unit: input.pricePerUnit,
    p_price_per_meter: input.pricePerMeter,
    p_meters_per_sale_unit: input.metersPerSaleUnit,
    p_stock: input.stock,
    p_popular: input.popular,
    p_article: input.article ?? null,
    p_card_title: input.cardTitle ?? null,
    p_image: input.image ?? null,
    p_is_published: input.isPublished,
  };
}

export async function listAdminProductsFromDb() {
  const { data, error } = await getSupabase().rpc("admin_list_products", {
    admin_secret: ADMIN_RPC_SECRET,
  });

  if (error) rpcError(error, "Не удалось загрузить товары");
  return (data ?? []).map((row) => mapProductRow(row as ProductRow));
}

export async function insertAdminProduct(input: AdminProductInput): Promise<number> {
  const { data, error } = await getSupabase().rpc("admin_insert_product", productRpcPayload(input));
  if (error) rpcError(error, "Не удалось создать товар");
  return Number(data);
}

export async function updateAdminProduct(input: AdminProductInput): Promise<void> {
  const { error } = await getSupabase().rpc("admin_update_product", productRpcPayload(input));
  if (error) rpcError(error, "Не удалось обновить товар");
}

export async function deleteAdminProduct(slug: string): Promise<void> {
  const { error } = await getSupabase().rpc("admin_delete_product", {
    admin_secret: ADMIN_RPC_SECRET,
    p_slug: slug,
  });
  if (error) rpcError(error, "Не удалось удалить товар");
}
