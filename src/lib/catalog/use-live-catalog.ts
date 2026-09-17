import { useEffect, useState } from "react";

import { listCategoriesAsync } from "./category-repository";
import type { Category } from "./types";
import { fetchProductCountsByCategoryFromSupabase } from "@/lib/supabase/queries";

async function fetchLiveCatalogFromSupabase(): Promise<{
  categories: Category[];
  productCountByCategoryId: Record<string, number>;
}> {
  let categories: Category[] = [];
  let productCountByCategoryId: Record<string, number> = {};

  try {
    categories = await listCategoriesAsync();
  } catch (error) {
    console.warn("[catalog] categories fetch failed", error);
  }

  try {
    productCountByCategoryId = await fetchProductCountsByCategoryFromSupabase();
  } catch (error) {
    console.warn("[catalog] product counts fetch failed", error);
  }

  return { categories, productCountByCategoryId };
}

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
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const live = await fetchLiveCatalogFromSupabase();
        if (cancelled) return;

        if (live.categories.length > 0) {
          setCategories(live.categories);
          setProductCountByCategoryId(live.productCountByCategoryId);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (initialCategories.length > categories.length) {
      setCategories(initialCategories);
      setProductCountByCategoryId(initialProductCountByCategoryId);
    }
  }, [initialCategories, initialProductCountByCategoryId, categories.length]);

  return { categories, productCountByCategoryId };
}
