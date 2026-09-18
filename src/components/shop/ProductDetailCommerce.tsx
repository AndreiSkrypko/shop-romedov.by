import { Link } from "@tanstack/react-router";
import { Check, Heart, Loader2, Scale, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ProductMedia } from "@/components/shop/ProductMedia";
import { QuantityStepper } from "@/components/shop/QuantityStepper";
import { RequestFormPanel } from "@/components/shop/RequestFormPanel";
import { ShopBreadcrumbs } from "@/components/shop/ShopBreadcrumbs";
import { useCart } from "@/lib/cart-context";
import {
  canAddProductToCart,
  catalogCardPrice,
  formatDecimal,
  formatPrice,
  formatPriceByn,
  formatQuantity,
  formatWeight,
  lineTotal,
  lineWeightKg,
  clampOrderQuantity,
  minQuantity,
  productIsOnOrder,
  productRequestDefaultMessage,
  quantityStep,
  saleUnitLabelForProduct,
  stockStatusInlineClass,
  stockStatusLabel,
  tonPrice,
  unitPrice,
} from "@/lib/catalog";
import type { Category, Product } from "@/lib/catalog";
import { isFiberglassCoil, isFiberglassRebar, isFiberglassRod } from "@/lib/catalog/fiberglass-visual";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/contacts";
import { CATALOG_PRICE_DISCLAIMER } from "@/lib/site";

type ProductDetailCommerceProps = {
  product: Product;
  category: Category;
};

export function ProductDetailCommerce({ product, category }: ProductDetailCommerceProps) {
  const { add } = useCart();
  const unit = saleUnitLabelForProduct(product);
  const step = quantityStep(product);
  const ton = tonPrice(product);
  const metersPerUnit = product.metersPerSaleUnit ?? product.lengthM ?? 1;
  const dualUnit = product.saleUnit === "боб" && metersPerUnit > 1;
  const byMeter = product.saleUnit === "м";
  const showCart = canAddProductToCart(product);
  const showRequest = productIsOnOrder(product);

  const [qtyUnits, setQtyUnits] = useState(1);
  const [qtyMeters, setQtyMeters] = useState(byMeter ? 1 : metersPerUnit);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const cardPrice = catalogCardPrice(product);
  const pricePerPackage = product.pricePerUnit ?? unitPrice(product);
  const pricePerMeterLine =
    byMeter && ton !== null ? unitPrice(product) : product.pricePerMeter ?? null;
  const tonsFromMeters = (meters: number) => (meters * product.weightKg) / 1000;

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
    const qty = clampOrderQuantity(product, orderQuantity);
    add(product.slug, qty);
    setAdding(false);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
    toast.success("Добавлено в корзину", {
      description: `${formatQuantity(qty)} ${byMeter && !dualUnit ? "м" : unit}`,
    });
  };

  const crumbLabel =
    product.cardTitle && product.cardTitle.length < 48
      ? product.cardTitle
      : product.name.slice(0, 48) + (product.name.length > 48 ? "…" : "");

  const lengthSpecLabel = isFiberglassCoil(product)
    ? "Длина бухты"
    : isFiberglassRod(product)
      ? "Длина прутка"
      : "Мерная длина";

  const specs: Array<[string, string]> = [
    [category.dimensionLabel, product.size],
    ...(isFiberglassRebar(product)
      ? ([["Форма поставки", isFiberglassCoil(product) ? "Бухта" : "Пруток"]] as Array<
          [string, string]
        >)
      : []),
    ["Марка / материал", product.steel],
    ["Стандарт", product.gost],
    ["Единица продажи", unit],
    [`Вес, кг/${unit}`, formatDecimal(product.weightKg)],
    ...(product.lengthM !== null
      ? ([[lengthSpecLabel, `${formatDecimal(product.lengthM)} м`]] as Array<[string, string]>)
      : []),
    ...(product.pricePerMeter != null
      ? ([["Цена за метр", formatPriceByn(product.pricePerMeter)]] as Array<[string, string]>)
      : []),
    ["Наличие", stockStatusLabel(product.stock)],
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
          <ProductMedia product={product} variant="detail" className="w-full" />
        </div>

        <div className="rounded-lg border border-border bg-background p-5 sm:p-6">
          {product.article ? (
            <p className="text-sm text-muted-foreground">Арт. {product.article}</p>
          ) : null}

          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-3xl font-bold tracking-tight">{formatPriceByn(cardPrice.value)}</p>
              {product.pricePerMeter != null && (dualUnit || isFiberglassRod(product)) ? (
                <p className="mt-1 text-sm text-muted-foreground">/ м</p>
              ) : ton !== null && byMeter ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatPriceByn(pricePerMeterLine ?? unitPrice(product))} / м
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">/ {cardPrice.unitLabel}</p>
              )}
              {dualUnit && product.pricePerUnit != null ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatPriceByn(pricePerPackage)} / {unit}
                </p>
              ) : isFiberglassRod(product) && product.pricePerUnit != null ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatPriceByn(product.pricePerUnit)} / {unit}
                </p>
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

          <p className="mt-3 flex items-center gap-2 text-sm font-medium">
            <Check className={`h-4 w-4 ${product.stock === "in" ? "text-lime-deep" : "text-muted-foreground"}`} aria-hidden />
            <span className={stockStatusInlineClass(product.stock)}>
              {stockStatusLabel(product.stock)}
            </span>
          </p>

          <button
            type="button"
            className="mt-2 text-sm text-lime-deep underline decoration-dotted underline-offset-4"
          >
            Нашли дешевле?
          </button>

          {showRequest ? (
            <div id="zayavka" className="mt-6 scroll-mt-28">
              <RequestFormPanel
                compact
                embedded
                title="Заявка под заказ"
                description="Укажите объём и контакты — менеджер рассчитает срок и стоимость."
                source={`product-order:${product.slug}`}
                defaultMessage={productRequestDefaultMessage(product)}
                mobileTriggerLabel="Оставить заявку"
              />
            </div>
          ) : showCart ? (
          <>
          <div className="mt-6 space-y-3">
            {byMeter && !dualUnit ? (
              <>
                <QuantityStepper
                  value={qtyMeters}
                  step={step}
                  min={minQuantity(product)}
                  unitLabel="м"
                  onChange={setQtyMeters}
                />
                {ton !== null ? (
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{formatQuantity(qtyMeters)}</span>
                    <span>м</span>
                    <span aria-hidden>≈</span>
                    <input
                      value={formatDecimal(Number(tonsFromMeters(qtyMeters).toFixed(3)))}
                      onChange={(event) => {
                        const parsed = Number(event.target.value.replace(",", "."));
                        if (Number.isFinite(parsed) && product.weightKg > 0) {
                          setQtyMeters(
                            clampOrderQuantity(
                              product,
                              parsed / (product.weightKg / 1000),
                            ),
                          );
                        }
                      }}
                      className="w-24 rounded-md border border-border px-2 py-1.5 text-center text-sm outline-none focus:border-lime-deep"
                      aria-label="Масса, тонны"
                    />
                    <span>т</span>
                  </div>
                ) : null}
              </>
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
              <>
                <QuantityStepper
                  value={qtyUnits}
                  step={step}
                  min={minQuantity(product)}
                  unitLabel={unit}
                  onChange={setQtyUnits}
                />
                {isFiberglassRod(product) && product.lengthM ? (
                  <p className="text-sm text-muted-foreground">
                    {formatQuantity(qtyUnits)} {unit}
                    <span aria-hidden className="mx-2">
                      ≈
                    </span>
                    <span className="font-medium text-foreground">
                      {formatQuantity(qtyUnits * product.lengthM)} м
                    </span>
                  </p>
                ) : null}
              </>
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
          </>
          ) : (
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Сейчас нет на складе — уточните наличие по телефону{" "}
              <a href={PHONE_HREF} className="font-semibold text-lime-deep">
                {PHONE_DISPLAY}
              </a>
              .
            </p>
          )}

          {showCart ? (
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {CATALOG_PRICE_DISCLAIMER}
          </p>
          ) : null}

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

      <section className="mt-10 border-t border-border pt-8">
        <h2 className="text-lg font-bold">Описание</h2>
        <div className="prose prose-sm mt-4 max-w-3xl text-muted-foreground">
          {category.id === "rebar-ribbed" || category.id === "rebar-smooth" ? (
            <p>
              {category.id === "rebar-ribbed"
                ? "Рифлёная строительная арматура классов А400С и А500С — стержень круглого сечения с продольными и поперечными рёбрами для надёжного сцепления с бетоном."
                : "Гладкая арматура и круглый прокат — для хомутов, распределительной сетки, монтажных элементов и гибких связей в железобетоне."}
            </p>
          ) : null}
          <p className={category.id === "rebar-ribbed" || category.id === "rebar-smooth" ? "mt-3" : ""}>
            {category.description}
          </p>
        </div>
      </section>
    </div>
  );
}
