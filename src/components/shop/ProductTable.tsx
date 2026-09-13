import { Link } from "@tanstack/react-router";
import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { QuantityStepper } from "@/components/shop/QuantityStepper";
import { useCart } from "@/lib/cart-context";
import {
  formatDecimal,
  formatPrice,
  minQuantity,
  quantityStep,
  saleUnitLabel,
  tonPrice,
  unitPrice,
} from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import { SHOW_PRICES } from "@/lib/site";

const headCell =
  "px-3 py-3 text-left font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";

export function ProductTable({
  products,
  dimensionLabel,
}: {
  products: Product[];
  dimensionLabel: string;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[54rem] border-collapse text-sm">
        <thead className="bg-secondary/60">
          <tr>
            <th scope="col" className={headCell}>
              {dimensionLabel}
            </th>
            <th scope="col" className={headCell}>
              Марка / ГОСТ
            </th>
            <th scope="col" className={`${headCell} text-right`}>
              Длина
            </th>
            <th scope="col" className={`${headCell} text-right`}>
              Вес
            </th>
            {SHOW_PRICES ? (
              <th scope="col" className={`${headCell} text-right`}>
                Цена
              </th>
            ) : null}
            <th scope="col" className={headCell}>
              Наличие
            </th>
            <th scope="col" className={`${headCell} text-right`}>
              Заказ
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow key={product.slug} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  const { add } = useCart();
  const step = quantityStep(product);
  const [quantity, setQuantity] = useState(step === 1 ? 1 : 10);
  const [added, setAdded] = useState(false);
  const unit = saleUnitLabel(product.saleUnit);
  const ton = tonPrice(product);

  const handleAdd = () => {
    add(product.slug, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
    toast.success("Добавлено в корзину", {
      description: `${product.name} — ${quantity} ${unit}`,
    });
  };

  return (
    <tr className="border-t border-border transition-colors hover:bg-secondary/30">
      <td className="px-3 py-3.5">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="font-display text-sm font-semibold uppercase transition-colors hover:text-lime-deep"
        >
          {product.size}
        </Link>
      </td>

      <td className="px-3 py-3.5 text-xs text-muted-foreground">
        <span className="block text-foreground/80">{product.steel}</span>
        {product.gost}
      </td>

      <td className="px-3 py-3.5 text-right text-xs text-muted-foreground">
        {product.lengthM !== null ? `${formatDecimal(product.lengthM)} м` : "—"}
      </td>

      <td className="px-3 py-3.5 text-right text-xs">
        <span className="font-medium">{formatDecimal(product.weightKg)}</span>
        <span className="text-muted-foreground"> кг/{unit}</span>
      </td>

      {SHOW_PRICES ? (
        <td className="px-3 py-3.5 text-right">
          <span className="font-display text-sm font-semibold">
            {formatPrice(unitPrice(product))}
          </span>
          <span className="text-xs text-muted-foreground"> / {unit}</span>
          {ton !== null ? (
            <span className="block text-[11px] text-muted-foreground">{formatPrice(ton)} / т</span>
          ) : null}
        </td>
      ) : null}

      <td className="px-3 py-3.5">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            product.stock === "in"
              ? "bg-lime/20 text-lime-deep"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {product.stock === "in" ? "В наличии" : "Под заказ"}
        </span>
      </td>

      <td className="px-3 py-3.5">
        <div className="flex items-center justify-end gap-2">
          <QuantityStepper
            value={quantity}
            step={step}
            min={minQuantity(product)}
            unitLabel={unit}
            onChange={setQuantity}
            size="sm"
          />
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Добавить ${product.name} в корзину`}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
              added ? "bg-lime text-ink" : "bg-brand text-brand-foreground hover:bg-brand/85"
            }`}
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          </button>
        </div>
      </td>
    </tr>
  );
}
