import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import type { Category } from "./types";

type CatalogContextValue = {
  categories: Category[];
  productCountByCategoryId: Readonly<Record<string, number>>;
};

const CatalogContext = createContext<CatalogContextValue>({
  categories: [],
  productCountByCategoryId: {},
});

export function CatalogCategoriesProvider({
  categories,
  productCountByCategoryId = {},
  children,
}: {
  categories: Category[];
  productCountByCategoryId?: Readonly<Record<string, number>>;
  children: ReactNode;
}) {
  return (
    <CatalogContext.Provider value={{ categories, productCountByCategoryId }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalogCategories(): Category[] {
  return useContext(CatalogContext).categories;
}

export function useProductCountByCategory(categoryId: string): number {
  return useContext(CatalogContext).productCountByCategoryId[categoryId] ?? 0;
}

export function useTotalPublishedProductCount(): number {
  const counts = useContext(CatalogContext).productCountByCategoryId;
  return Object.values(counts).reduce((sum, n) => sum + n, 0);
}

export function categoryFromList(categories: Category[], categoryId: string): Category | undefined {
  return categories.find((item) => item.id === categoryId);
}
