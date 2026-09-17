import type { Category } from "@/lib/catalog/types";

import type { CategoryRow } from "./types";

export function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    menuName: row.menu_name,
    tagline: row.tagline,
    description: row.description,
    image: row.image,
    order: row.sort_order,
    dimensionLabel: row.dimension_label,
    seoTitle: row.seo_title || row.name,
    seoDescription: row.seo_description || row.description,
    isPublished: row.is_published,
  };
}
