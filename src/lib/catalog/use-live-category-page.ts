import { useEffect, useState } from "react";

import { findCategoryBySlugAsync } from "./category-repository";
import { listProductsByCategoryAsync } from "./repository";
import { listSubcategoriesByCategoryAsync } from "./subcategory-repository";
import type { Category, Product, Subcategory } from "./types";

export type CategoryPageData = {
  category: Category;
  products: Product[];
  subcategories: Subcategory[];
};

export function useLiveCategoryPage(categorySlug: string, initial: CategoryPageData) {
  const [data, setData] = useState(initial);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const category = await findCategoryBySlugAsync(categorySlug);
        if (!category || cancelled) return;

        const [products, subcategories] = await Promise.all([
          listProductsByCategoryAsync(category.id),
          listSubcategoriesByCategoryAsync(category.id),
        ]);

        if (!cancelled) {
          setData({ category, products, subcategories });
        }
      } catch (error) {
        console.warn(`[catalog] не удалось обновить /catalog/${categorySlug}`, error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  return data;
}
