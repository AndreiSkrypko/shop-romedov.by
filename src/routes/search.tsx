import { Link, createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { ProductCard } from "@/components/shop/ProductCard";
import { Shell } from "@/components/shop/Shell";
import { rememberDbProducts } from "@/lib/catalog/db-cache";
import { searchProductsInList, useCatalogCategories } from "@/lib/catalog";
import { listCategoriesAsync } from "@/lib/catalog/category-repository";
import type { Product } from "@/lib/catalog";
import { searchProductsInSupabase } from "@/lib/supabase/queries";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/contacts";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { q: string } => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: async ({ deps }) => {
    const query = deps.q.trim();
    if (query.length < 2) {
      return { results: [] as Product[] };
    }

    const dbHits = await searchProductsInSupabase(query, 48);
    rememberDbProducts(dbHits);
    const categories = await listCategoriesAsync();
    return {
      results: searchProductsInList(dbHits, categories, query, 48),
    };
  },
  head: () =>
    buildSeo({
      title: "Поиск по каталогу металлопроката — Ромедов",
      description:
        "Найдите нужный типоразмер металлопроката по названию, диаметру или марке стали: арматура, лист, труба, уголок, швеллер.",
      path: "/search",
    }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { results } = Route.useLoaderData();
  const categories = useCatalogCategories();
  const query = q.trim();

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <Breadcrumbs items={[{ label: "Поиск", kind: "current" }]} />

        <h1 className="mt-6 font-display text-3xl font-semibold uppercase sm:text-4xl">
          {query ? `Поиск: «${query}»` : "Поиск по каталогу"}
        </h1>

        {query.length < 2 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Введите название, диаметр или марку стали — например «арматура 12», «труба 40×40» или
            «швеллер».
          </p>
        ) : results.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="font-display text-lg font-semibold uppercase">Ничего не нашлось</p>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Проверьте написание или посмотрите категории целиком. Нужную позицию также можно
              уточнить по телефону:{" "}
              <a href={PHONE_HREF} className="font-semibold text-lime-deep">
                {PHONE_DISPLAY}
              </a>
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to="/catalog/$category"
                  params={{ category: category.slug }}
                  className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-lime-deep hover:text-lime-deep"
                >
                  {category.menuName}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            <p className="mt-4 text-sm text-muted-foreground">
              Найдено позиций:{" "}
              <span className="font-semibold text-foreground">{results.length}</span>
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
