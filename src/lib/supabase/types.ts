import type { CategoryId, SaleUnit, StockState } from "@/lib/catalog/types";

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  menu_name: string;
  tagline: string;
  description: string;
  image: string;
  sort_order: number;
  dimension_label: string;
  seo_title: string;
  seo_description: string;
  is_published: boolean;
  updated_at: string;
};

export type SubcategoryRow = {
  id: string;
  category_id: CategoryId;
  slug: string;
  name: string;
  image: string;
  sort_order: number;
  is_published: boolean;
  updated_at: string;
};

export type ProductRow = {
  id: number;
  slug: string;
  category_id: CategoryId;
  subcategory_id: string | null;
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
  sort_order?: number;
  is_published: boolean;
  updated_at: string;
};
