import { createContext, useContext } from "react";

import type { Product } from "@/lib/catalog";

export type CartLine = {
  slug: string;
  quantity: number;
};

export type CartEntry = {
  product: Product;
  quantity: number;
  total: number;
  weightKg: number;
};

export type CartContextValue = {
  /** true после гидратации из localStorage — до этого счётчики не показываем. */
  ready: boolean;
  entries: CartEntry[];
  positions: number;
  totalPrice: number;
  totalWeightKg: number;
  add: (slug: string, quantity: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  quantityOf: (slug: string) => number;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart должен использоваться внутри CartProvider");
  return context;
}
