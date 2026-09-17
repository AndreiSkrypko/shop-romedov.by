import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { CartContext } from "@/lib/cart-context";
import type { CartContextValue, CartEntry, CartLine } from "@/lib/cart-context";
import {
  findProductBySlug,
  hydrateDbProductsForSlugs,
  lineTotal,
  lineWeightKg,
  minQuantity,
} from "@/lib/catalog";

const STORAGE_KEY = "romedov-cart-v1";

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((item): CartLine[] => {
      if (typeof item !== "object" || item === null) return [];
      const { slug, quantity } = item as { slug?: unknown; quantity?: unknown };
      if (typeof slug !== "string" || typeof quantity !== "number" || quantity <= 0) return [];
      return [{ slug, quantity }];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const stored = readStorage();
      const slugs = stored.map((line) => line.slug);
      await hydrateDbProductsForSlugs(slugs);
      if (cancelled) return;
      setLines(
        stored.filter((line) => findProductBySlug(line.slug)),
      );
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // приватный режим браузера — корзина живёт только в памяти
    }
  }, [lines, ready]);

  const add = useCallback((slug: string, quantity: number) => {
    const product = findProductBySlug(slug);
    if (!product) return;
    const amount = Math.max(minQuantity(product), quantity);

    setLines((prev) => {
      const existing = prev.find((line) => line.slug === slug);
      if (!existing) return [...prev, { slug, quantity: amount }];
      return prev.map((line) =>
        line.slug === slug ? { ...line, quantity: line.quantity + amount } : line,
      );
    });
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    if (!findProductBySlug(slug)) return;

    if (quantity <= 0) {
      setLines((prev) => prev.filter((line) => line.slug !== slug));
      return;
    }

    setLines((prev) => prev.map((line) => (line.slug === slug ? { ...line, quantity } : line)));
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((line) => line.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const entries = useMemo<CartEntry[]>(
    () =>
      lines.flatMap((line) => {
        const product = findProductBySlug(line.slug);
        if (!product) return [];
        return [
          {
            product,
            quantity: line.quantity,
            total: lineTotal(product, line.quantity),
            weightKg: lineWeightKg(product, line.quantity),
          },
        ];
      }),
    [lines],
  );

  const value = useMemo<CartContextValue>(() => {
    const totalPrice = entries.reduce((sum, entry) => sum + entry.total, 0);
    const totalWeightKg = entries.reduce((sum, entry) => sum + entry.weightKg, 0);

    return {
      ready,
      entries,
      positions: entries.length,
      totalPrice,
      totalWeightKg,
      add,
      setQuantity,
      remove,
      clear,
      quantityOf: (slug: string) => entries.find((e) => e.product.slug === slug)?.quantity ?? 0,
    };
  }, [entries, ready, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
