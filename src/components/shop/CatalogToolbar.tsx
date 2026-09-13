import { SORT_OPTIONS } from "@/lib/catalog";
import type { CatalogFilters, SortKey } from "@/lib/catalog";

type CatalogToolbarProps = {
  steelOptions: string[];
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  total: number;
  shown: number;
};

export function CatalogToolbar({
  steelOptions,
  filters,
  onChange,
  total,
  shown,
}: CatalogToolbarProps) {
  const toggleSteel = (steel: string) => {
    const next = filters.steel.includes(steel)
      ? filters.steel.filter((item) => item !== steel)
      : [...filters.steel, steel];
    onChange({ ...filters, steel: next });
  };

  const hasFilters = filters.steel.length > 0 || filters.onlyInStock;

  return (
    <div className="rounded-2xl border border-border bg-secondary/40 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          Показано <span className="font-semibold text-foreground">{shown}</span> из {total}
        </p>

        <label className="flex items-center gap-2 text-xs">
          <span className="uppercase tracking-[0.14em] text-muted-foreground">Сортировка</span>
          <select
            value={filters.sort}
            onChange={(event) => onChange({ ...filters, sort: event.target.value as SortKey })}
            className="rounded-full border border-border bg-background px-3 py-2 text-xs outline-none focus:border-lime-deep"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => onChange({ ...filters, onlyInStock: !filters.onlyInStock })}
          aria-pressed={filters.onlyInStock}
          className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
            filters.onlyInStock
              ? "border-lime-deep bg-lime/15 text-lime-deep"
              : "border-border bg-background text-muted-foreground hover:border-lime-deep"
          }`}
        >
          Только в наличии
        </button>

        {steelOptions.length > 1
          ? steelOptions.map((steel) => {
              const active = filters.steel.includes(steel);
              return (
                <button
                  key={steel}
                  type="button"
                  onClick={() => toggleSteel(steel)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                    active
                      ? "border-lime-deep bg-lime/15 text-lime-deep"
                      : "border-border bg-background text-muted-foreground hover:border-lime-deep"
                  }`}
                >
                  {steel}
                </button>
              );
            })
          : null}

        {hasFilters ? (
          <button
            type="button"
            onClick={() => onChange({ ...filters, steel: [], onlyInStock: false })}
            className="ml-auto text-xs text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-ink"
          >
            Сбросить фильтры
          </button>
        ) : null}
      </div>
    </div>
  );
}
