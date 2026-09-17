import type { CategoryId, SaleUnit, StockState } from "@/lib/catalog/types";

export type ProductRow = {
  id: number;
  slug: string;
  category_id: CategoryId;
  name: string;
  size: string;
  dimension: number;
  steel: string;
  gost: string;
  length_m: number | null;
  sale_unit: SaleUnit;
  weight_kg: number;
  price_per_ton: number | null;
  price_per_unit: number | null;
  price_per_meter: number | null;
  meters_per_sale_unit: number | null;
  stock: StockState;
  popular: boolean;
  article: string | null;
  card_title: string | null;
  image: string | null;
  is_published: boolean;
  updated_at: string;
};
