import type { Subcategory } from "@/lib/catalog/types";

import type { SubcategoryRow } from "./types";

export function mapSubcategoryRow(row: SubcategoryRow): Subcategory {
  return {
    id: row.id,
    categoryId: row.category_id,
    slug: row.slug,
    name: row.name,
    image: row.image || "/products/supplies.webp",
    order: Number(row.sort_order),
    isPublished: row.is_published,
  };
}
