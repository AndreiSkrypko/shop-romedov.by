import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/lib/cart-context";
import {
  catalogCardPrice,
  formatPriceByn,
  minQuantity,
  productCardTitle,
  productImage,
} from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import { SHOW_PRICES } from "@/lib/site";

/** Плитка товара в стиле классической витрины (сетка категории). */
export function ProductCardCatalog({ product }: { product: Product }) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const { value: cardPrice, unitLabel } = catalogCardPrice(product);

  const handleAdd = () => {
    add(product.slug, minQuantity(product));
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
    toast.success("Добавлено в корзину");
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative flex aspect-square items-center justify-center bg-white p-4"
      >
        <img
          src={productImage(product)}
          alt={productCardTitle(product)}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full object-contain"
        />
      </Link>

      <div className="flex flex-1 flex-col border-t border-border p-4">
        <h3 className="min-h-[2.75rem] text-center text-sm font-medium leading-snug">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="hover:text-lime-deep"
          >
            {productCardTitle(product)}
          </Link>
        </h3>

        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          {product.article ? <span>Арт. {product.article}</span> : <span />}
          <span
            className={
              product.stock === "in" ? "font-medium text-lime-deep" : "text-muted-foreground"
            }
          >
            {product.stock === "in" ? "В наличии" : "Под заказ"}
          </span>
        </div>

        {SHOW_PRICES ? (
          <p className="mt-3 text-center">
            <span className="text-lg font-bold text-foreground">{formatPriceByn(cardPrice)}</span>
            <span className="text-sm text-muted-foreground"> /{unitLabel}</span>
          </p>
        ) : (
          <p className="mt-3 text-center text-sm font-semibold text-lime-deep">Цена по запросу</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className={`flex h-10 items-center justify-center gap-1 rounded-md text-sm font-semibold transition-colors ${
              justAdded ? "bg-lime text-ink" : "bg-brand text-brand-foreground hover:bg-brand/90"
            }`}
          >
            {justAdded ? <Check className="h-4 w-4" /> : null}В корзину
          </button>
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="flex h-10 items-center justify-center rounded-md border border-border bg-secondary/80 text-sm font-medium text-foreground transition-colors hover:border-lime-deep"
          >
            Просмотр
          </Link>
        </div>
      </div>
    </article>
  );
}
