import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import type { Category, Subcategory } from "@/lib/catalog";
import { CATALOG_PRODUCTS_ANCHOR_ID } from "@/lib/site";
import { resolvePublicAssetUrl } from "@/lib/utils";

type CatalogSubcategoryNavProps = {
  category: Category;
  subcategories: Subcategory[];
  activeSubSlug?: string;
};

function resolveSubcategoryImage(sub: Subcategory, category: Category): string {
  const img = sub.image?.trim();
  if (img && img.length > 0 && !img.endsWith("/supplies.webp")) {
    return resolvePublicAssetUrl(img);
  }
  return resolvePublicAssetUrl(category.image);
}

type TileProps = {
  category: Category;
  name: string;
  image: string;
  active: boolean;
  to: { search: { sub?: string }; hash?: string };
};

function SubcategoryTile({ category, name, image, active, to }: TileProps) {
  const fallback = resolvePublicAssetUrl(category.image);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    setUseFallback(false);
  }, [image]);

  const src = useFallback ? fallback : image;

  const scrollToProducts = () => {
    if (!to.hash) return;
    requestAnimationFrame(() => {
      document
        .getElementById(CATALOG_PRODUCTS_ANCHOR_ID)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <Link
      to="/catalog/$category"
      params={{ category: category.slug }}
      search={to.search}
      hash={to.hash}
      onClick={scrollToProducts}
      className={`group flex w-[calc(50%-0.375rem)] flex-col overflow-hidden rounded-md border bg-white transition-colors sm:w-[11.25rem] ${
        active
          ? "border-brand shadow-[inset_0_0_0_1px_hsl(var(--brand))]"
          : "border-border hover:border-lime-deep/40 hover:bg-secondary/20"
      }`}
    >
      <div className="flex h-24 items-center justify-center bg-white p-2 sm:h-28">
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setUseFallback(true)}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <p className="border-t border-border px-2 py-2.5 text-center text-[11px] font-medium leading-snug text-foreground sm:text-xs sm:leading-snug">
        {name}
      </p>
    </Link>
  );
}

/** Компактные плитки подкатегорий (как на классической витрине). */
export function CatalogSubcategoryNav({
  category,
  subcategories,
  activeSubSlug,
}: CatalogSubcategoryNavProps) {
  if (subcategories.length === 0) return null;

  return (
    <nav aria-label="Подкатегории" className="mb-6 border-b border-border pb-6">
      <div className="flex flex-wrap gap-3">
        <SubcategoryTile
          category={category}
          name="Вся категория"
          image={resolvePublicAssetUrl(category.image)}
          active={!activeSubSlug}
          to={{ search: {} }}
        />
        {subcategories.map((sub) => (
          <SubcategoryTile
            key={sub.id}
            category={category}
            name={sub.name}
            image={resolveSubcategoryImage(sub, category)}
            active={activeSubSlug === sub.slug}
            to={{ search: { sub: sub.slug }, hash: CATALOG_PRODUCTS_ANCHOR_ID }}
          />
        ))}
      </div>
    </nav>
  );
}
