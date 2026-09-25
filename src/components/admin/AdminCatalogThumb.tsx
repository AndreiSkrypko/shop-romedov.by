import { ImageIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { FiberglassDiagramImage } from "@/components/shop/FiberglassDiagramImage";
import { RibbedRebarCatalogIllustration } from "@/components/shop/RibbedRebarCatalogIllustration";
import { SmoothRebarCatalogIllustration } from "@/components/shop/SmoothRebarCatalogIllustration";
import {
  fiberglassDiagramKind,
  shouldShowFiberglassPlaceholder,
} from "@/lib/catalog/fiberglass-visual";
import type { Product } from "@/lib/catalog/types";
import { ribbedRebarCatalogArticle } from "@/lib/catalog/ribbed-rebar-images";
import { productHasCustomImage } from "@/lib/catalog/rebar-visual";
import { smoothRebarCatalogArticle } from "@/lib/catalog/smooth-rebar-images";
import { resolvePublicAssetUrl } from "@/lib/utils";

const frameClass =
  "flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-white";

type AdminCatalogThumbProps = {
  product?: Product;
  src?: string | null;
  alt?: string;
};

export function AdminCatalogThumb({ product, src, alt = "" }: AdminCatalogThumbProps) {
  const [tryFallback, setTryFallback] = useState(false);
  const [failed, setFailed] = useState(false);

  const showFiberglass = product ? shouldShowFiberglassPlaceholder(product) : false;
  const ribbedArticle = product ? ribbedRebarCatalogArticle(product) : undefined;
  const smoothArticle = product ? smoothRebarCatalogArticle(product) : undefined;

  const imageUrl = useMemo(() => {
    if (product && productHasCustomImage(product)) {
      return resolvePublicAssetUrl(product.image!.trim());
    }
    const primary = src?.trim();
    if (primary) return resolvePublicAssetUrl(primary);
    return undefined;
  }, [product, src]);

  if (product && productHasCustomImage(product) && imageUrl && !failed) {
    return (
      <img
        key={imageUrl}
        src={imageUrl}
        alt={alt}
        className={`${frameClass} object-contain`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  if (showFiberglass && product) {
    return (
      <div className={`${frameClass} bg-white p-0.5`} title={alt}>
        <FiberglassDiagramImage
          product={product}
          kind={fiberglassDiagramKind(product)}
          variant="card"
          className="size-full"
        />
      </div>
    );
  }

  if (ribbedArticle && product) {
    return (
      <div className={`${frameClass} bg-[#f4f5f7] p-0.5`} title={alt}>
        <RibbedRebarCatalogIllustration
          article={ribbedArticle}
          product={product}
          variant="card"
          className="size-full"
        />
      </div>
    );
  }

  if (smoothArticle && product) {
    return (
      <div className={`${frameClass} bg-[#f6f7f9] p-0.5`} title={alt}>
        <SmoothRebarCatalogIllustration
          article={smoothArticle}
          product={product}
          variant="card"
          className="size-full"
        />
      </div>
    );
  }

  if (!imageUrl || failed) {
    return (
      <div className={`${frameClass} bg-muted/40 text-muted-foreground`} title="Нет фото">
        <ImageIcon className="h-5 w-5 opacity-45" aria-hidden />
      </div>
    );
  }

  return (
    <img
      key={imageUrl}
      src={imageUrl}
      alt={alt}
      className={`${frameClass} object-contain`}
      loading="lazy"
      onError={() => {
        if (!tryFallback) {
          setTryFallback(true);
          return;
        }
        setFailed(true);
      }}
    />
  );
}
