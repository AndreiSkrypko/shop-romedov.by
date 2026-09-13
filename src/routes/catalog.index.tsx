import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { CategoryCard } from "@/components/shop/CategoryCard";
import { Shell } from "@/components/shop/Shell";
import { CATEGORIES_BY_ORDER, PRODUCTS } from "@/lib/catalog";
import { buildSeo, jsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/catalog/")({
  head: () =>
    buildSeo({
      title: "Каталог металлопроката — 11 категорий со склада | Ромедов",
      description:
        "Полный каталог металлопроката: арматура, листы, трубы, уголок, швеллер, квадрат, полоса, сетка и сопутствующие товары. Вес метра, цена за тонну, наличие на складе.",
      path: "/catalog",
      keywords:
        "каталог металлопроката, сортамент, арматура, трубы, уголок, швеллер, лист стальной, минск",
    }),
  component: CatalogPage,
});

function CatalogPage() {
  return (
    <Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Каталог", item: `${SITE_URL}/catalog` },
          ],
        })}
      />

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <Breadcrumbs items={[{ label: "Металлопрокат", kind: "current" }]} />

        <h1 className="mt-6 font-display text-3xl font-semibold uppercase sm:text-4xl lg:text-5xl">
          Металлопрокат
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Выберите категорию — внутри полный сортамент с диаметрами, марками стали, ГОСТами и весом
          погонного метра. Стоимость считается по фактическому весу вашего объёма, поэтому итог
          виден сразу в корзине. Всего в каталоге {PRODUCTS.length} позиций.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIES_BY_ORDER.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </Shell>
  );
}
