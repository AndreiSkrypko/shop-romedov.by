import { createFileRoute } from "@tanstack/react-router";

import { CatalogStorefrontLayout } from "@/components/shop/CatalogStorefrontLayout";
import { CategoryCard } from "@/components/shop/CategoryCard";
import { CATEGORIES_BY_ORDER, PRODUCTS } from "@/lib/catalog";
import { buildSeo } from "@/lib/seo";

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
    <CatalogStorefrontLayout
      breadcrumbs={[{ label: "Металлопрокат", kind: "current" }]}
      title="Металлопрокат"
      subtitle={`Выберите категорию — внутри полный сортамент с марками стали, ГОСТами и ценой за единицу. Всего в каталоге ${PRODUCTS.length} позиций.`}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CATEGORIES_BY_ORDER.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </CatalogStorefrontLayout>
  );
}
