import { useId } from "react";

import { formatDecimal } from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import {
  isSmoothRebarDiagram,
  rebarDiagramDiameterMm,
  rebarDiagramLengthM,
} from "@/lib/catalog/rebar-visual";

type RebarDiagramImageProps = {
  product: Product;
  className?: string;
  variant?: "detail" | "card";
};

/** Объёмный прут без подписей на изображении (размеры — в характеристиках товара). */
export function RebarDiagramImage({
  product,
  className = "",
  variant = "detail",
}: RebarDiagramImageProps) {
  const lengthM = rebarDiagramLengthM(product);
  const diameter = rebarDiagramDiameterMm(product);
  const compact = variant === "card";
  const smooth = isSmoothRebarDiagram(product);
  const id = useId().replace(/:/g, "");
  const barH = compact ? 26 : 34;
  const ribCount = smooth ? 0 : 28;

  return (
    <svg
      viewBox="0 0 520 360"
      role="img"
      aria-label={`${product.name}, ${formatDecimal(lengthM)} м, Ø ${diameter} мм`}
      className={`h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id={`steel-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8eaed" />
          <stop offset="18%" stopColor="#aeb4bd" />
          <stop offset="50%" stopColor="#7b828c" />
          <stop offset="82%" stopColor="#5a6068" />
          <stop offset="100%" stopColor="#8a9098" />
        </linearGradient>
        <linearGradient id={`shine-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={`shadow-${id}`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#1a1f24" floodOpacity="0.22" />
        </filter>
      </defs>

      <rect width="520" height="360" fill="#f0f1f3" />
      <ellipse cx="260" cy="248" rx="168" ry="14" fill="#d8dbe0" opacity="0.65" />

      <g filter={`url(#shadow-${id})`} transform="translate(58, 148) rotate(-24 200 20)">
        <rect x="0" y="0" width="340" height={barH} rx={barH / 2} fill={`url(#steel-${id})`} />
        <rect
          x="8"
          y="3"
          width="300"
          height={Math.max(4, barH * 0.22)}
          rx={barH / 4}
          fill={`url(#shine-${id})`}
        />
        {!smooth
          ? Array.from({ length: ribCount }, (_, index) => {
              const x = 12 + index * 11.5;
              return (
                <ellipse
                  key={index}
                  cx={x}
                  cy={barH / 2}
                  rx="3.2"
                  ry={barH * 0.38}
                  fill="#4f565f"
                  opacity="0.35"
                />
              );
            })
          : null}
        <ellipse cx="338" cy={barH / 2} rx="5" ry={barH / 2} fill="#6c737c" />
        <ellipse cx="338" cy={barH / 2} rx="3" ry={barH * 0.35} fill="#9aa1a9" />
      </g>
    </svg>
  );
}
