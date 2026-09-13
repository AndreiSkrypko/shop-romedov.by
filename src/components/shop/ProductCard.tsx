import { Link } from "@tanstack/react-router";
import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/lib/cart-context";
import {
  formatDecimal,
  formatPrice,
  formatWeight,
  getCategoryById,
  minQuantity,
  saleUnitLabel,
  tonPrice,
  unitPrice,
  weightUnitLabel,
} from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import { SHOW_PRICES } from "@/lib/site";

export function ProductCard({ product }: { product: Product }) {
  const category = getCategoryById(product.categoryId);
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const unit = saleUnitLabel(product.saleUnit);
  const ton = tonPrice(product);

  const handleAdd = () => {
    add(product.slug, minQuantity(product));
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
    toast.success("Добавлено в корзину", { description: product.name });
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all hover:border-lime-deep hover:shadow-[0_12px_40px_-24px_rgba(0,0,0,0.28)]">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative aspect-[4/3] overflow-hidden bg-white"
      >
        <img
          src={category.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            product.stock === "in"
              ? "bg-lime/20 text-lime-deep"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {product.stock === "in" ? "В наличии" : "Под заказ"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-lime-deep">
          {category.name}
        </p>

        <h3 className="mt-2 font-display text-base font-semibold uppercase leading-snug">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="hover:text-lime-deep"
          >
            {product.size}
          </Link>
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {product.steel} · {product.gost}
        </p>

        <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between gap-2">
            <dt>Вес</dt>
            <dd className="font-medium text-foreground/80">
              {formatWeight(product.weightKg)}{" "}
              <span className="text-muted-foreground">/ {unit}</span>
            </dd>
          </div>
          {product.lengthM !== null ? (
            <div className="flex justify-between gap-2">
              <dt>Длина</dt>
              <dd className="font-medium text-foreground/80">{formatDecimal(product.lengthM)} м</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-4 flex-1" />

        {SHOW_PRICES ? (
          <div>
            <p className="font-display text-xl font-semibold">
              {formatPrice(unitPrice(product))}
              <span className="ml-1 text-xs font-medium text-muted-foreground">/ {unit}</span>
            </p>
            {ton !== null ? (
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {formatPrice(ton)} / т · {weightUnitLabel(product)}{" "}
                {formatDecimal(product.weightKg)}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="font-display text-sm font-semibold uppercase text-lime-deep">
            Цена по запросу
          </p>
        )}

        <button
          type="button"
          onClick={handleAdd}
          className={`mt-4 flex h-11 items-center justify-center gap-2 rounded-full font-display text-xs font-semibold uppercase tracking-[0.12em] transition-all ${
            justAdded ? "bg-lime text-ink" : "bg-brand text-brand-foreground hover:-translate-y-0.5"
          }`}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" /> В корзине
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" /> В корзину
            </>
          )}
        </button>
      </div>
    </article>
  );
}
