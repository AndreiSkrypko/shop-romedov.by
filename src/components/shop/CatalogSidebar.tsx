import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { useCatalogCategories } from "@/lib/catalog";
import type { CatalogFilters, Category, CategoryId } from "@/lib/catalog";

type CatalogSidebarProps = {
  activeCategoryId?: CategoryId | undefined;
  showProductFilters?: boolean | undefined;
  steelOptions?: string[] | undefined;
  filters?: CatalogFilters | undefined;
  onFiltersChange?: ((filters: CatalogFilters) => void) | undefined;
  onlyInStock: boolean;
  onOnlyInStockChange: (value: boolean) => void;
  priceMin: number;
  priceMax: number;
  priceCeiling: number;
  onPriceMinChange: (value: number) => void;
  onPriceMaxChange: (value: number) => void;
  onResetFilters: () => void;
};

export function CatalogSidebar({
  activeCategoryId,
  showProductFilters = false,
  steelOptions = [],
  filters,
  onFiltersChange,
  onlyInStock,
  onOnlyInStockChange,
  priceMin,
  priceMax,
  priceCeiling,
  onPriceMinChange,
  onPriceMaxChange,
  onResetFilters,
}: CatalogSidebarProps) {
  const categories = useCatalogCategories();

  const toggleSteel = (steel: string) => {
    if (!filters || !onFiltersChange) return;
    const next = filters.steel.includes(steel)
      ? filters.steel.filter((item) => item !== steel)
      : [...filters.steel, steel];
    onFiltersChange({ ...filters, steel: next });
  };

  return (
    <aside className="space-y-6">
      <nav className="overflow-hidden rounded-lg border border-border bg-background">
        <p className="border-b border-border bg-secondary/50 px-4 py-3 text-sm font-semibold">
          Каталог
        </p>
        <ul className="divide-y divide-border text-sm">
          <li>
            <Link
              to="/catalog"
              className={`flex items-center justify-between gap-2 px-4 py-3 transition-colors ${
                activeCategoryId === undefined
                  ? "bg-brand font-medium text-brand-foreground"
                  : "text-foreground hover:bg-secondary/60"
              }`}
            >
              <span>Все категории</span>
              <ChevronRight className="h-4 w-4 shrink-0 opacity-40" />
            </Link>
          </li>
          {categories.map((category: Category) => {
            const active = category.id === activeCategoryId;
            return (
              <li key={category.id}>
                <Link
                  to="/catalog/$category"
                  params={{ category: category.slug }}
                  className={`flex items-center justify-between gap-2 px-4 py-3 transition-colors ${
                    active
                      ? "bg-brand font-medium text-brand-foreground"
                      : "text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <span className="min-w-0 leading-snug">{category.menuName}</span>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 ${active ? "opacity-90" : "opacity-40"}`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {showProductFilters ? (
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">Фильтр по параметрам</p>
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-lime-deep underline decoration-dotted underline-offset-2"
            >
              Сбросить фильтр
            </button>
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(event) => onOnlyInStockChange(event.target.checked)}
              className="h-4 w-4 rounded border-border accent-lime-deep"
            />
            В наличии
          </label>

          {steelOptions.length > 1 ? (
            <div className="mt-5">
              <p className="text-sm font-semibold">Марка стали</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {steelOptions.map((steel) => {
                  const active = filters?.steel.includes(steel) ?? false;
                  return (
                    <button
                      key={steel}
                      type="button"
                      onClick={() => toggleSteel(steel)}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        active
                          ? "border-lime-deep bg-lime/15 text-lime-deep"
                          : "border-border text-muted-foreground hover:border-lime-deep"
                      }`}
                    >
                      {steel}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-5">
            <p className="text-sm font-semibold">Цена, BYN</p>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={priceMax}
                value={priceMin}
                onChange={(event) => onPriceMinChange(Number(event.target.value) || 0)}
                className="w-full rounded-md border border-border px-2 py-1.5 text-sm"
                aria-label="Цена от"
              />
              <span className="text-muted-foreground">—</span>
              <input
                type="number"
                min={priceMin}
                max={priceCeiling}
                value={priceMax}
                onChange={(event) => onPriceMaxChange(Number(event.target.value) || priceCeiling)}
                className="w-full rounded-md border border-border px-2 py-1.5 text-sm"
                aria-label="Цена до"
              />
            </div>
            <input
              type="range"
              min={0}
              max={priceCeiling}
              value={priceMax}
              onChange={(event) => onPriceMaxChange(Number(event.target.value))}
              className="mt-3 w-full accent-lime-deep"
              aria-label="Максимальная цена"
            />
          </div>
        </div>
      ) : null}
    </aside>
  );
}
