import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/lib/cart-context";
import { ProductMedia } from "@/components/shop/ProductMedia";
import {
  canAddProductToCart,
  catalogCardPrice,
  formatPriceByn,
  isProductInStock,
  minQuantity,
  productCardTitle,
  productIsOnOrder,
  stockStatusInlineClass,
  stockStatusLabel,
} from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import { SHOW_PRICES } from "@/lib/site";

/** Плитка товара в стиле классической витрины (сетка категории). */
export function ProductCardCatalog({ product }: { product: Product }) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const { value: cardPrice, unitLabel } = catalogCardPrice(product);

  const inStock = isProductInStock(product);
  const onOrder = productIsOnOrder(product);
  const canAdd = canAddProductToCart(product);

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
        className="relative block aspect-square overflow-hidden bg-white"
      >
        <ProductMedia
          product={product}
          variant="card"
          className="size-full"
          imgClassName="size-full object-contain"
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
          <span className={stockStatusInlineClass(product.stock)}>
            {stockStatusLabel(product.stock)}
          </span>
        </div>

        {SHOW_PRICES && canAdd ? (
          <p className="mt-3 text-center">
            <span className="text-lg font-bold text-foreground">{formatPriceByn(cardPrice)}</span>
            <span className="text-sm text-muted-foreground"> /{unitLabel}</span>
          </p>
        ) : (
          <p className="mt-3 text-center text-sm font-semibold text-muted-foreground">
            {inStock ? "Цена по запросу" : "Узнать цену"}
          </p>
        )}

        <div className={`mt-4 grid gap-2 ${canAdd || onOrder ? "grid-cols-2" : "grid-cols-1"}`}>
          {canAdd ? (
            <button
              type="button"
              onClick={handleAdd}
              className={`flex h-10 items-center justify-center gap-1 rounded-md text-sm font-semibold transition-colors ${
                justAdded ? "bg-lime text-ink" : "bg-brand text-brand-foreground hover:bg-brand/90"
              }`}
            >
              {justAdded ? <Check className="h-4 w-4" /> : null}В корзину
            </button>
          ) : onOrder ? (
            <Link
              to="/product/$slug"
              params={{ slug: product.slug }}
              hash="zayavka"
              resetScroll={false}
              className="flex h-10 items-center justify-center rounded-md bg-brand text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
            >
              Заявка
            </Link>
          ) : null}
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="flex h-10 items-center justify-center rounded-md border border-border bg-secondary/80 text-sm font-medium text-foreground transition-colors hover:border-lime-deep"
          >
            {onOrder ? "Подробнее" : "Просмотр"}
          </Link>
        </div>
      </div>
    </article>
  );
}
