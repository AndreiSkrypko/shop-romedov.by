import type { Product } from "@/lib/catalog/types";
import { resolvePublicAssetUrl } from "../utils";

import type { ProductRow } from "./types";

export function mapProductRow(row: ProductRow): Product {
  return {
    slug: row.slug,
    categoryId: row.category_id,
    subcategoryId: row.subcategory_id ?? undefined,
    name: row.name,
    size: row.size,
    dimension: Number(row.dimension),
    steel: row.steel,
    gost: row.gost,
    lengthM: row.length_m === null ? null : Number(row.length_m),
    saleUnit: row.sale_unit,
    weightKg: Number(row.weight_kg),
    pricePerTon: row.price_per_ton === null ? null : Number(row.price_per_ton),
    pricePerUnit: row.price_per_unit === null ? null : Number(row.price_per_unit),
    pricePerMeter: row.price_per_meter === null ? null : Number(row.price_per_meter),
    metersPerSaleUnit:
      row.meters_per_sale_unit === null ? null : Number(row.meters_per_sale_unit),
    stock: row.stock,
    popular: row.popular,
    source: "db",
    article: row.article ?? undefined,
    cardTitle: row.card_title ?? undefined,
    image: row.image ? resolvePublicAssetUrl(row.image) : undefined,
    catalogSort: Number(row.sort_order ?? 0),
    isPublished: row.is_published,
  };
}
