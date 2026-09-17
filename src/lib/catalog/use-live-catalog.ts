import { useEffect, useState } from "react";

import { listCategoriesAsync } from "./category-repository";
import type { Category } from "./types";
import { fetchProductCountsByCategoryFromSupabase } from "@/lib/supabase/queries";

export function useLiveCatalog(
  initialCategories: Category[],
  initialProductCountByCategoryId: Readonly<Record<string, number>>,
) {
  const [categories, setCategories] = useState(initialCategories);
  const [productCountByCategoryId, setProductCountByCategoryId] = useState(
    initialProductCountByCategoryId,
  );

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const [nextCategories, nextCounts] = await Promise.all([
          listCategoriesAsync(),
          fetchProductCountsByCategoryFromSupabase(),
        ]);
        if (cancelled) return;
        setCategories(nextCategories);
        setProductCountByCategoryId(nextCounts);
      } catch (error) {
        console.warn("[catalog] не удалось обновить категории из Supabase", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, productCountByCategoryId };
}
