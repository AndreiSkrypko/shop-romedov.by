import type { Product } from "@/lib/catalog";
import type { FiberglassDiagramKind } from "@/lib/catalog/fiberglass-visual";
import { fiberglassPlaceholderSrc } from "@/lib/catalog/fiberglass-visual";

type FiberglassDiagramImageProps = {
  product: Product;
  kind: FiberglassDiagramKind;
  className?: string;
  variant?: "detail" | "card";
};

/** Фото-заглушка с референса (бухта / прутки), пока нет своего снимка в админке. */
export function FiberglassDiagramImage({
  product,
  kind,
  className = "",
  variant = "detail",
}: FiberglassDiagramImageProps) {
  const compact = variant === "card";

  return (
    <img
      src={fiberglassPlaceholderSrc(kind)}
      alt={product.name}
      decoding="async"
      className={
        compact
          ? `size-full scale-[1.12] object-contain ${className}`
          : `size-full scale-[1.45] object-contain drop-shadow-sm sm:scale-[1.55] lg:scale-[1.4] ${className}`
      }
    />
  );
}
