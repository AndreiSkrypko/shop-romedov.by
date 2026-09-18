import type { ReactNode } from "react";

import { CatalogSidebar } from "@/components/shop/CatalogSidebar";
import { ShopBreadcrumbs } from "@/components/shop/ShopBreadcrumbs";
import type { Crumb } from "@/components/shop/Breadcrumbs";
import { Shell } from "@/components/shop/Shell";
import { EMPTY_FILTERS } from "@/lib/catalog";
import type { CategoryId, CatalogFilters } from "@/lib/catalog";
import { jsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

type CatalogStorefrontLayoutProps = {
  breadcrumbs: Crumb[];
  title: string;
  subtitle?: string;
  activeCategoryId?: CategoryId | undefined;
  showProductFilters?: boolean;
  steelOptions?: string[];
  filters?: CatalogFilters;
  onFiltersChange?: (filters: CatalogFilters) => void;
  onResetFilters?: () => void;
  jsonLdName?: string;
  jsonLdPath?: string;
  children: ReactNode;
};

export function CatalogStorefrontLayout({
  breadcrumbs,
  title,
  subtitle,
  activeCategoryId,
  showProductFilters = false,
  steelOptions = [],
  filters,
  onFiltersChange,
  onResetFilters,
  jsonLdName,
  jsonLdPath,
  children,
}: CatalogStorefrontLayoutProps) {
  const breadcrumbLd =
    jsonLdName && jsonLdPath
      ? jsonLd({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Каталог", item: `${SITE_URL}/catalog` },
            {
              "@type": "ListItem",
              position: 3,
              name: jsonLdName,
              item: `${SITE_URL}${jsonLdPath}`,
            },
          ],
        })
      : jsonLd({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Каталог", item: `${SITE_URL}/catalog` },
          ],
        });

  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={breadcrumbLd} />

      <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-8">
        <ShopBreadcrumbs items={breadcrumbs} />

        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle ? (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <CatalogSidebar
            activeCategoryId={activeCategoryId}
            showProductFilters={showProductFilters}
            steelOptions={steelOptions}
            filters={filters}
            onFiltersChange={onFiltersChange}
            onlyInStock={filters?.onlyInStock ?? false}
            onOnlyInStockChange={(value) =>
              onFiltersChange?.({ ...(filters ?? EMPTY_FILTERS), onlyInStock: value })
            }
            onResetFilters={onResetFilters ?? (() => {})}
          />

          <div>{children}</div>
        </div>
      </div>
    </Shell>
  );
}
