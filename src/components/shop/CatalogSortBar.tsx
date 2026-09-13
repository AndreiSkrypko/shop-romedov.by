import type { CatalogFilters, SortKey } from "@/lib/catalog";

type CatalogSortBarProps = {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  shown: number;
  total: number;
};

const SORT_BUTTONS: Array<{ key: SortKey; label: string }> = [
  { key: "popular", label: "По популярности" },
  { key: "size-asc", label: "По алфавиту" },
  { key: "price-asc", label: "По цене" },
];

export function CatalogSortBar({ filters, onChange, shown, total }: CatalogSortBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 text-sm text-muted-foreground">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span>Сортировка:</span>
        {SORT_BUTTONS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange({ ...filters, sort: key })}
            className={
              filters.sort === key ? "font-semibold text-foreground" : "hover:text-foreground"
            }
          >
            {label}
          </button>
        ))}
      </div>
      <p>
        Показано <span className="font-semibold text-foreground">{shown}</span> из {total}
      </p>
    </div>
  );
}
