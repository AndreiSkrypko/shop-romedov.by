import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Check, FileText, Scissors, ShoppingCart, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { ProductCard } from "@/components/shop/ProductCard";
import { QuantityStepper } from "@/components/shop/QuantityStepper";
import { Shell } from "@/components/shop/Shell";
import { useCart } from "@/lib/cart-context";
import {
  findProductBySlug,
  formatDecimal,
  formatPrice,
  formatWeight,
  getCategoryById,
  getRelatedProducts,
  lineTotal,
  lineWeightKg,
  minQuantity,
  quantityStep,
  saleUnitLabel,
  tonPrice,
  unitPrice,
} from "@/lib/catalog";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/contacts";
import { buildSeo, jsonLd } from "@/lib/seo";
import { PRICE_NOTE, SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = findProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product, category: getCategoryById(product.categoryId) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { product, category } = loaderData;
    return buildSeo({
      title: `${product.name} — купить в Минске и Борисове | Ромедов`,
      description: `${product.name}, ${product.gost}. Вес ${formatDecimal(product.weightKg)} кг/${saleUnitLabel(product.saleUnit)}${
        product.lengthM !== null ? `, длина ${formatDecimal(product.lengthM)} м` : ""
      }. ${product.stock === "in" ? "В наличии на складе" : "Поставка под заказ"}, резка в размер, доставка по Беларуси.`,
      path: `/product/${product.slug}`,
      keywords: `${product.name.toLowerCase()}, ${category.name.toLowerCase()}, ${product.steel.toLowerCase()}, цена, минск`,
    });
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, category } = Route.useLoaderData();
  const { add } = useCart();
  const step = quantityStep(product);
  const [quantity, setQuantity] = useState(step === 1 ? 1 : 10);
  const [added, setAdded] = useState(false);

  const unit = saleUnitLabel(product.saleUnit);
  const ton = tonPrice(product);
  const related = getRelatedProducts(product, 4);

  const handleAdd = () => {
    add(product.slug, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
    toast.success("Добавлено в корзину", {
      description: `${product.name} — ${quantity} ${unit}`,
    });
  };

  const specs: Array<[string, string]> = [
    [category.dimensionLabel, product.size],
    ["Марка / материал", product.steel],
    ["Стандарт", product.gost],
    ["Единица продажи", unit],
    [`Вес, кг/${unit}`, formatDecimal(product.weightKg)],
    ...(product.lengthM !== null
      ? ([["Мерная длина", `${formatDecimal(product.lengthM)} м`]] as Array<[string, string]>)
      : []),
    ["Наличие", product.stock === "in" ? "На складе" : "Под заказ, 3–7 дней"],
    ...(ton !== null ? ([["Цена за тонну", formatPrice(ton)]] as Array<[string, string]>) : []),
  ];

  return (
    <Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          sku: product.slug,
          category: category.name,
          material: product.steel,
          image: `${SITE_URL}${category.image}`,
          description: `${product.name}, ${product.gost}. Вес ${formatDecimal(product.weightKg)} кг/${unit}.`,
          brand: { "@type": "Brand", name: "Ромедов" },
          offers: {
            "@type": "Offer",
            price: unitPrice(product).toFixed(2),
            priceCurrency: "BYN",
            availability:
              product.stock === "in" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
            url: `${SITE_URL}/product/${product.slug}`,
          },
        })}
      />

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <Breadcrumbs
          items={[
            { label: "Металлопрокат", kind: "catalog" },
            { label: category.name, kind: "category", slug: category.slug },
            { label: product.size, kind: "current" },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.15fr]">
          {/* Изображение */}
          <div className="overflow-hidden rounded-3xl border border-border bg-white">
            <img
              src={category.image}
              alt={product.name}
              className="h-full w-full object-contain p-8"
            />
          </div>

          {/* Основная информация */}
          <div>
            <Link
              to="/catalog/$category"
              params={{ category: category.slug }}
              className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-lime-deep"
            >
              {category.name}
            </Link>

            <h1 className="mt-3 font-display text-3xl font-semibold uppercase leading-tight sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                  product.stock === "in"
                    ? "bg-lime/20 text-lime-deep"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {product.stock === "in" ? "В наличии на складе" : "Под заказ 3–7 дней"}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-muted-foreground">
                {product.gost}
              </span>
            </div>

            {/* Цена и калькулятор */}
            <div className="mt-7 rounded-2xl border border-border bg-secondary/40 p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-3xl font-semibold">
                  {formatPrice(unitPrice(product))}
                </span>
                <span className="text-sm text-muted-foreground">за {unit}</span>
                {ton !== null ? (
                  <span className="ml-auto text-sm text-muted-foreground">
                    {formatPrice(ton)} / т
                  </span>
                ) : null}
              </div>

              <div className="mt-5 border-t border-border pt-5">
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Расчёт по вашему объёму
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <QuantityStepper
                    value={quantity}
                    step={step}
                    min={minQuantity(product)}
                    unitLabel={unit}
                    onChange={setQuantity}
                  />

                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      Вес:{" "}
                      <span className="font-semibold text-foreground">
                        {formatWeight(lineWeightKg(product, quantity))}
                      </span>
                    </p>
                    <p className="mt-0.5 font-display text-xl font-semibold">
                      {formatPrice(lineTotal(product, quantity))}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className={`mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-full font-display text-sm font-semibold uppercase tracking-[0.12em] transition-all sm:w-auto sm:px-10 ${
                    added
                      ? "bg-lime text-ink"
                      : "bg-brand text-brand-foreground hover:-translate-y-0.5"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" /> Добавлено
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" /> В корзину
                    </>
                  )}
                </button>

                {added ? (
                  <Link
                    to="/cart"
                    className="mt-3 inline-flex font-display text-xs font-semibold uppercase tracking-[0.12em] text-lime-deep"
                  >
                    Перейти в корзину →
                  </Link>
                ) : null}
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{PRICE_NOTE}</p>

            {/* Характеристики */}
            <h2 className="mt-9 font-display text-lg font-semibold uppercase">Характеристики</h2>
            <dl className="mt-4 divide-y divide-border rounded-2xl border border-border">
              {specs.map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-4 px-4 py-3">
                  <dt className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="text-right text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>

            {/* Услуги */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { Icon: Scissors, title: "Резка в размер", text: "Порежем под длину проекта" },
                { Icon: Truck, title: "Доставка", text: "Свой транспорт до 20 т" },
                { Icon: FileText, title: "Документы", text: "ТТН, счёт, сертификат" },
              ].map(({ Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-border p-4">
                  <Icon className="h-5 w-5 text-lime-deep" />
                  <p className="mt-2.5 font-display text-xs font-semibold uppercase">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Нужен другой типоразмер или партия больше склада? Позвоните:{" "}
              <a href={PHONE_HREF} className="font-semibold text-lime-deep">
                {PHONE_DISPLAY}
              </a>
            </p>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="font-display text-xl font-semibold uppercase">Похожие типоразмеры</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </Shell>
  );
}
