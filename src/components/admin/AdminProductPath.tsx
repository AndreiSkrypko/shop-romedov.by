import { AlertTriangle } from "lucide-react";

import type { AdminProductRow } from "@/lib/admin/catalog-snapshot.server";

export function AdminProductPath({ row }: { row: AdminProductRow }) {
  const { categoryName, subcategoryName, placement } = row;

  if (placement === "in_subcategory" && subcategoryName) {
    return (
      <p className="text-xs text-muted-foreground">
        <span className="text-foreground/80">{categoryName}</span>
        <span className="mx-1 text-muted-foreground/60">→</span>
        <span className="font-medium text-foreground/90">{subcategoryName}</span>
      </p>
    );
  }

  if (placement === "needs_subcategory") {
    return (
      <p className="flex flex-wrap items-center gap-1.5 text-xs text-amber-800 dark:text-amber-200">
        <span>
          <span className="text-foreground/80">{categoryName}</span>
          <span className="mx-1 text-muted-foreground/60">·</span>
          без подкатегории
        </span>
        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
          <AlertTriangle className="h-3 w-3" aria-hidden />
          Назначьте подкатегорию
        </span>
      </p>
    );
  }

  return (
    <p className="text-xs text-muted-foreground">
      <span className="text-foreground/80">{categoryName}</span>
      <span className="mx-1 text-muted-foreground/60">·</span>
      весь раздел категории
    </p>
  );
}
