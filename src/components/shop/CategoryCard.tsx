import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { useProductCountByCategory } from "@/lib/catalog";
import type { Category } from "@/lib/catalog";

function plural(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "позиция";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "позиции";
  return "позиций";
}

export function CategoryCard({ category }: { category: Category }) {
  const count = useProductCountByCategory(category.id);

  return (
    <Link
      to="/catalog/$category"
      params={{ category: category.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all hover:border-lime-deep hover:shadow-[0_16px_44px_-28px_rgba(0,0,0,0.3)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.05]"
        />
        <span className="absolute right-3 top-3 rounded-full bg-secondary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {count} {plural(count)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-semibold uppercase leading-snug">
          {category.name}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{category.tagline}</p>

        <span className="mt-4 inline-flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-lime-deep">
          Смотреть сортамент
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
