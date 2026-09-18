import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";

import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { ProductMedia } from "@/components/shop/ProductMedia";
import { QuantityStepper } from "@/components/shop/QuantityStepper";
import { Shell } from "@/components/shop/Shell";
import { useCart } from "@/lib/cart-context";
import {
  formatDecimal,
  formatPrice,
  formatWeight,
  categoryFromList,
  minQuantity,
  useCatalogCategories,
  quantityStep,
  saleUnitLabel,
  unitPrice,
} from "@/lib/catalog";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/contacts";
import { shoppingTrailCrumbs } from "@/lib/last-catalog-path";
import { buildSeo } from "@/lib/seo";
import { PRICE_NOTE } from "@/lib/site";

export const Route = createFileRoute("/cart")({
  head: () =>
    buildSeo({
      title: "Корзина — Ромедов Металл",
      description:
        "Проверьте состав заказа: количество, вес и стоимость каждой позиции металлопроката. Оформление за 2 минуты.",
      path: "/cart",
    }),
  component: CartPage,
});

function CartPage() {
  const categories = useCatalogCategories();
  const { ready, entries, positions, totalPrice, totalWeightKg, setQuantity, remove, clear } =
    useCart();

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <Breadcrumbs items={shoppingTrailCrumbs("cart")} />

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-3xl font-semibold uppercase sm:text-4xl">Корзина</h1>
          {ready && positions > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="text-xs text-muted-foreground underline decoration-dotted underline-offset-4 transition-colors hover:text-destructive"
            >
              Очистить корзину
            </button>
          ) : null}
        </div>

        {!ready ? (
          <p className="mt-10 text-sm text-muted-foreground">Загружаем корзину…</p>
        ) : positions === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border p-10 text-center sm:p-16">
            <ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-5 font-display text-xl font-semibold uppercase">Корзина пуста</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Выберите сортамент в каталоге — вес и стоимость по вашему объёму посчитаются
              автоматически.
            </p>
            <Link
              to="/catalog"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.12em] text-brand-foreground transition-transform hover:-translate-y-0.5"
            >
              Перейти в каталог
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
            <ul className="space-y-4">
              {entries.map((entry) => {
                const { product } = entry;
                const category = categoryFromList(categories, product.categoryId);
                const unit = saleUnitLabel(product.saleUnit);

                return (
                  <li
                    key={product.slug}
                    className="flex flex-col gap-4 rounded-2xl border border-border p-4 sm:flex-row sm:items-center"
                  >
                    <Link
                      to="/product/$slug"
                      params={{ slug: product.slug }}
                      className="flex h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-white"
                    >
                      <ProductMedia
                        product={product}
                        variant="card"
                        className="size-full min-h-0 min-w-0"
                        imgClassName="size-full object-contain p-1.5"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-lime-deep">
                        {category?.name ?? "Каталог"}
                      </p>
                      <Link
                        to="/product/$slug"
                        params={{ slug: product.slug }}
                        className="mt-1 block font-display text-sm font-semibold uppercase leading-snug transition-colors hover:text-lime-deep"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatPrice(unitPrice(product))} / {unit} ·{" "}
                        {formatDecimal(product.weightKg)} кг/{unit}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                      <QuantityStepper
                        value={entry.quantity}
                        step={quantityStep(product)}
                        min={minQuantity(product)}
                        unitLabel={unit}
                        onChange={(value) => setQuantity(product.slug, value)}
                        size="sm"
                      />
                      <p className="text-right">
                        <span className="block font-display text-base font-semibold">
                          {formatPrice(entry.total)}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {formatWeight(entry.weightKg)}
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(product.slug)}
                      aria-label={`Удалить ${product.name}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>

            <aside className="sticky top-28 rounded-2xl border border-border bg-secondary/40 p-6">
              <h2 className="font-display text-base font-semibold uppercase">Итого</h2>

              <dl className="mt-5 space-y-2.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Позиций</dt>
                  <dd className="font-medium">{positions}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Общий вес</dt>
                  <dd className="font-medium">{formatWeight(totalWeightKg)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-border pt-3">
                  <dt className="font-display text-xs uppercase tracking-[0.12em]">К оплате</dt>
                  <dd className="font-display text-2xl font-semibold">{formatPrice(totalPrice)}</dd>
                </div>
              </dl>

              <Link
                to="/checkout"
                className="mt-6 flex h-13 items-center justify-center gap-2 rounded-full bg-brand font-display text-sm font-semibold uppercase tracking-[0.12em] text-brand-foreground transition-transform hover:-translate-y-0.5"
              >
                Оформить заказ
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/catalog"
                className="mt-3 flex items-center justify-center text-xs text-muted-foreground underline decoration-dotted underline-offset-4"
              >
                Продолжить покупки
              </Link>

              <p className="mt-5 border-t border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
                {PRICE_NOTE} Вопросы по сортаменту —{" "}
                <a href={PHONE_HREF} className="text-lime-deep">
                  {PHONE_DISPLAY}
                </a>
              </p>
            </aside>
          </div>
        )}
      </div>
    </Shell>
  );
}
