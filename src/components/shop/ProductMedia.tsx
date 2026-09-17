import { productImage } from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import { ribbedRebarCatalogArticle } from "@/lib/catalog/ribbed-rebar-images";
import { smoothRebarCatalogArticle } from "@/lib/catalog/smooth-rebar-images";
import {
  fiberglassDiagramKind,
  shouldShowFiberglassPlaceholder,
} from "@/lib/catalog/fiberglass-visual";
import { shouldShowRebarDiagram } from "@/lib/catalog/rebar-visual";

import { FiberglassDiagramImage } from "./FiberglassDiagramImage";
import { RebarDiagramImage } from "./RebarDiagramImage";
import { RibbedRebarCatalogIllustration } from "./RibbedRebarCatalogIllustration";
import { SmoothRebarCatalogIllustration } from "./SmoothRebarCatalogIllustration";

type ProductMediaProps = {
  product: Product;
  variant?: "detail" | "card";
  className?: string;
  imgClassName?: string;
};

const detailFrameClass =
  "relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden sm:aspect-square lg:min-h-[28rem]";

export function ProductMedia({
  product,
  variant = "detail",
  className = "",
  imgClassName = "",
}: ProductMediaProps) {
  if (shouldShowFiberglassPlaceholder(product)) {
    if (variant === "card") {
      return (
        <FiberglassDiagramImage
          product={product}
          kind={fiberglassDiagramKind(product)}
          variant="card"
          className={className}
        />
      );
    }
    return (
      <div className={`${detailFrameClass} bg-white ${className}`}>
        <FiberglassDiagramImage
          product={product}
          kind={fiberglassDiagramKind(product)}
          variant="detail"
          className="size-full"
        />
      </div>
    );
  }

  const ribbedArticle = ribbedRebarCatalogArticle(product);

  if (ribbedArticle) {
    const illustration = (
      <RibbedRebarCatalogIllustration
        article={ribbedArticle}
        product={product}
        variant={variant}
        className="size-full"
      />
    );
    if (variant === "detail") {
      return (
        <div className={`${detailFrameClass} bg-[#f4f5f7] ${className}`}>{illustration}</div>
      );
    }
    return <div className={`size-full ${className}`}>{illustration}</div>;
  }

  const smoothArticle = smoothRebarCatalogArticle(product);

  if (smoothArticle) {
    const illustration = (
      <SmoothRebarCatalogIllustration
        article={smoothArticle}
        product={product}
        variant={variant}
        className="size-full"
      />
    );
    if (variant === "detail") {
      return (
        <div className={`${detailFrameClass} bg-[#f6f7f9] ${className}`}>{illustration}</div>
      );
    }
    return <div className={`size-full ${className}`}>{illustration}</div>;
  }

  if (shouldShowRebarDiagram(product)) {
    if (variant === "card") {
      return (
        <RebarDiagramImage product={product} variant="card" className={`size-full ${className}`} />
      );
    }
    return (
      <div className={`${detailFrameClass} bg-[#f4f5f7] ${className}`}>
        <RebarDiagramImage product={product} variant="detail" className="size-full" />
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className={`${detailFrameClass} bg-white ${className}`}>
        <img
          src={productImage(product)}
          alt={product.name}
          decoding="async"
          className={
            imgClassName ||
            "size-full scale-[1.08] object-contain sm:scale-[1.12]"
          }
        />
      </div>
    );
  }

  return (
    <img
      src={productImage(product)}
      alt={product.name}
      loading="lazy"
      decoding="async"
      className={imgClassName}
    />
  );
}
