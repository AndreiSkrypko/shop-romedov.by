import { Link } from "@tanstack/react-router";
import { Check, Heart, Loader2, Scale, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { QuantityStepper } from "@/components/shop/QuantityStepper";
import { ShopBreadcrumbs } from "@/components/shop/ShopBreadcrumbs";
import { useCart } from "@/lib/cart-context";
import {
  catalogCardPrice,
  formatDecimal,
  formatPrice,
  formatPriceByn,
  formatQuantity,
  formatWeight,
  lineTotal,
  lineWeightKg,
  minQuantity,
  productImage,
  quantityStep,
  saleUnitLabel,
  tonPrice,
  unitPrice,
} from "@/lib/catalog";
import type { Category, Product } from "@/lib/catalog";
import { PHONE_HREF } from "@/lib/contacts";
import { CATALOG_PRICE_DISCLAIMER } from "@/lib/site";

type ProductDetailCommerceProps = {
  product: Product;
  category: Category;
};

export function ProductDetailCommerce({ product, category }: ProductDetailCommerceProps) {
  const { add } = useCart();
  const unit = saleUnitLabel(product.saleUnit);
  const step = quantityStep(product);
  const ton = tonPrice(product);
  const metersPerUnit = product.metersPerSaleUnit ?? product.lengthM ?? 1;
  const dualUnit = product.saleUnit === "боб" && metersPerUnit > 1;
  const byMeter = product.saleUnit === "м";

  const [qtyUnits, setQtyUnits] = useState(1);
  const [qtyMeters, setQtyMeters] = useState(byMeter ? (step === 1 ? 1 : 10) : metersPerUnit);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const cardPrice = catalogCardPrice(product);
  const pricePerPackage = product.pricePerUnit ?? unitPrice(product);

  const syncMetersFromUnits = (units: number) => {
    setQtyUnits(units);
    setQtyMeters(units * metersPerUnit);
  };

  const syncUnitsFromMeters = (meters: number) => {
    const units = Math.max(minQuantity(product), Math.round(meters / metersPerUnit) || 1);
    setQtyMeters(meters);
    setQtyUnits(units);
  };

  const orderQuantity = dualUnit || !byMeter ? qtyUnits : qtyMeters;
  const lineSum = useMemo(() => lineTotal(product, orderQuantity), [product, orderQuantity]);
  const lineWeight = useMemo(() => lineWeightKg(product, orderQuantity), [product, orderQuantity]);

  const handleAdd = () => {
    setAdding(true);
    add(product.slug, orderQuantity);
    setAdding(false);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
    toast.success("Добавлено в корзину", {
      description: `${formatQuantity(orderQuantity)} ${byMeter && !dualUnit ? "м" : unit}`,
    });
  };

  const crumbLabel =
    product.cardTitle && product.cardTitle.length < 48
      ? product.cardTitle
      : product.name.slice(0, 48) + (product.name.length > 48 ? "…" : "");

  const specs: Array<[string, string]> = [
    [category.dimensionLabel, product.size],
    ["Марка / материал", product.steel],
    ["Стандарт", product.gost],
    ["Единица продажи", unit],
    [`Вес, кг/${unit}`, formatDecimal(product.weightKg)],
    ...(product.lengthM !== null
      ? ([["Мерная длина", `${formatDecimal(product.lengthM)} м`]] as Array<[string, string]>)
      : []),
    ["Наличие", product.stock === "in" ? "В наличии" : "Под заказ"],
    ...(ton !== null ? ([["Цена за тонну", formatPrice(ton)]] as Array<[string, string]>) : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-10">
      <ShopBreadcrumbs
        items={[
          { label: "Каталог", kind: "catalog" },
          { label: category.name, kind: "category", slug: category.slug },
          { label: crumbLabel, kind: "current" },
        ]}
      />

      <h1 className="mt-4 text-2xl font-bold leading-snug text-foreground sm:text-3xl">
        {product.name}
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <img
            src={productImage(product)}
            alt={product.name}
            className="mx-auto max-h-[min(520px,70vh)] w-full object-contain p-6 sm:p-10"
          />
        </div>

        <div className="rounded-lg border border-border bg-background p-5 sm:p-6">
          {product.article ? (
            <p className="text-sm text-muted-foreground">Арт. {product.article}</p>
          ) : null}

          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-3xl font-bold">{formatPriceByn(cardPrice.value)}</p>
              <p className="mt-1 text-sm text-muted-foreground">/ {cardPrice.unitLabel}</p>
              {dualUnit && product.pricePerUnit !== null ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatPrice(pricePerPackage)} / {unit}
                </p>
              ) : null}
              {ton !== null && byMeter ? (
                <p className="mt-1 text-sm text-muted-foreground">{formatPrice(ton)} / т</p>
              ) : null}
            </div>
            <div className="flex gap-2 text-muted-foreground">
              <button
                type="button"
                aria-label="В избранное"
                className="rounded-md p-2 hover:bg-secondary"
              >
                <Heart className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Сравнить"
                className="rounded-md p-2 hover:bg-secondary"
              >
                <Scale className="h-5 w-5" />
              </button>
            </div>
          </div>

          <p className="mt-3 flex items-center gap-2 text-sm font-medium text-lime-deep">
            <Check className="h-4 w-4" aria-hidden />
            {product.stock === "in" ? "В наличии" : "Под заказ"}
          </p>

          <button
            type="button"
            className="mt-2 text-sm text-lime-deep underline decoration-dotted underline-offset-4"
          >
            Нашли дешевле?
          </button>

          <div className="mt-6 space-y-3">
            {byMeter && !dualUnit ? (
              <QuantityStepper
                value={qtyMeters}
                step={step}
                min={minQuantity(product)}
                unitLabel="м"
                onChange={setQtyMeters}
              />
            ) : dualUnit ? (
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-md border border-border">
                  <button
                    type="button"
                    aria-label="Уменьшить"
                    className="px-3 py-2 text-lg text-muted-foreground hover:text-foreground"
                    onClick={() => syncMetersFromUnits(Math.max(1, qtyUnits - 1))}
                  >
                    −
                  </button>
                  <input
                    value={qtyUnits}
                    onChange={(event) =>
                      syncMetersFromUnits(Math.max(1, Number(event.target.value) || 1))
                    }
                    className="w-12 border-x border-border py-2 text-center text-sm font-semibold outline-none"
                    aria-label={`Количество, ${unit}`}
                  />
                  <button
                    type="button"
                    aria-label="Увеличить"
                    className="px-3 py-2 text-lg text-muted-foreground hover:text-foreground"
                    onClick={() => syncMetersFromUnits(qtyUnits + 1)}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">{unit}</span>
                <div className="flex items-center gap-2">
                  <input
                    value={formatQuantity(qtyMeters)}
                    onChange={(event) => {
                      const parsed = Number(event.target.value.replace(",", "."));
                      if (Number.isFinite(parsed)) syncUnitsFromMeters(parsed);
                    }}
                    className="w-20 rounded-md border border-border px-2 py-2 text-center text-sm outline-none focus:border-lime-deep"
                    aria-label="Количество, метры"
                  />
                  <span className="text-sm text-muted-foreground">м</span>
                </div>
              </div>
            ) : (
              <QuantityStepper
                value={qtyUnits}
                step={step}
                min={minQuantity(product)}
                unitLabel={unit}
                onChange={setQtyUnits}
              />
            )}

            <p className="text-sm text-muted-foreground">
              Итого: <span className="font-semibold text-foreground">{formatPrice(lineSum)}</span>
              <span className="mx-2 text-border">·</span>
              Вес: <span className="font-semibold text-foreground">{formatWeight(lineWeight)}</span>
            </p>
          </div>

          <div className="mt-5 space-y-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding}
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-md text-sm font-bold uppercase tracking-wide transition-colors ${
                added ? "bg-lime text-ink" : "bg-brand text-brand-foreground hover:bg-brand/90"
              }`}
            >
              {adding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : added ? (
                <Check className="h-4 w-4" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
              В корзину
            </button>

            <Link
              to="/checkout"
              className="flex h-12 w-full items-center justify-center rounded-md border border-border bg-secondary text-sm font-semibold transition-colors hover:border-lime-deep"
            >
              Купить в 1 клик
            </Link>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {CATALOG_PRICE_DISCLAIMER}
          </p>

          <dl className="mt-6 divide-y divide-border rounded-lg border border-border text-sm">
            {specs.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 px-3 py-2.5">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 text-sm text-muted-foreground">
            Вопросы по наличию:{" "}
            <a href={PHONE_HREF} className="font-medium text-lime-deep">
              позвонить менеджеру
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
