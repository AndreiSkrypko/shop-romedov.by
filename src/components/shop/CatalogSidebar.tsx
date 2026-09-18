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
    <aside className={`space-y-6 ${showProductFilters ? "" : "hidden lg:block"}`}>
      {/* На телефоне категории — в шапке (меню); здесь только десктоп */}
      <nav className="hidden overflow-hidden rounded-lg border border-border bg-background lg:block">
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
        </div>
      ) : null}
    </aside>
  );
}
