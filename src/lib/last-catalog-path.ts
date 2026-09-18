import { useEffect } from "react";

import type { Crumb } from "@/components/shop/Breadcrumbs";

const STORAGE_KEY = "romedov:last-catalog-category";

type StoredCategory = {
  slug: string;
  name: string;
};

export function rememberCatalogCategory(category: StoredCategory) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(category));
  } catch {
    /* private mode / quota */
  }
}

export function readLastCatalogCategory(): StoredCategory | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCategory;
    if (typeof parsed.slug === "string" && typeof parsed.name === "string") return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

/** Крошки после «Главная» для корзины и оформления заказа. */
export function shoppingTrailCrumbs(page: "cart" | "checkout"): Crumb[] {
  const last = readLastCatalogCategory();
  const items: Crumb[] = [{ label: "Каталог", kind: "catalog" }];
  if (last) {
    items.push({ label: last.name, kind: "category", slug: last.slug });
  }
  if (page === "checkout") {
    items.push({ label: "Корзина", kind: "cart" });
    items.push({ label: "Оформление заказа", kind: "current" });
  } else {
    items.push({ label: "Корзина", kind: "current" });
  }
  return items;
}

export function useRememberCatalogCategory(category: StoredCategory | null | undefined) {
  useEffect(() => {
    if (category) rememberCatalogCategory(category);
  }, [category?.slug, category?.name, category]);
}
