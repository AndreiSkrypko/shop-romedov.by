import { useId } from "react";

import { formatDecimal } from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import {
  rebarDiagramDiameterMm,
  rebarDiagramLengthM,
} from "@/lib/catalog/rebar-visual";

type SmoothRebarCatalogIllustrationProps = {
  article: string;
  product: Product;
  variant?: "detail" | "card";
  className?: string;
};

function SmoothBar({
  id,
  x,
  y,
  width,
  height,
  rotate = 0,
}: {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
}) {
  const cx = x + width / 2;
  const cy = y + height / 2;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate}) translate(${-width / 2} ${-height / 2})`}>
      <rect x={0} y={0} width={width} height={height} rx={height / 2} fill={`url(#smooth-steel-${id})`} />
      <rect
        x={width * 0.04}
        y={height * 0.12}
        width={width * 0.86}
        height={height * 0.28}
        rx={height / 4}
        fill={`url(#smooth-shine-${id})`}
      />
      <ellipse cx={width - 2} cy={height / 2} rx={height / 2} ry={height / 2} fill="#727983" />
    </g>
  );
}

function DimensionLabels({
  compact,
  lengthLabel,
  diameterLabel,
}: {
  compact: boolean;
  lengthLabel: string;
  diameterLabel: string;
}) {
  return (
    <>
      <g stroke="#848b93" strokeWidth={1.5} fill="none">
        <path d="M48 118 L48 248" />
        <path d="M44 118 L52 118" />
        <path d="M44 248 L52 248" />
        <path d="M400 200 L470 200" />
        <path d="M400 196 L400 204" />
        <path d="M470 196 L470 204" />
      </g>
      <text
        x={24}
        y={188}
        fontFamily="system-ui,sans-serif"
        fontSize={compact ? 18 : 22}
        fill="#525860"
        fontWeight={600}
      >
        {lengthLabel}
      </text>
      <text
        x={408}
        y={192}
        fontFamily="system-ui,sans-serif"
        fontSize={compact ? 16 : 20}
        fill="#525860"
        fontWeight={600}
      >
        {diameterLabel}
      </text>
    </>
  );
}

export function SmoothRebarCatalogIllustration({
  article,
  product,
  variant = "card",
  className = "",
}: SmoothRebarCatalogIllustrationProps) {
  const uid = useId().replace(/:/g, "");
  const compact = variant === "card";
  const lengthM = rebarDiagramLengthM(product);
  const diameter = rebarDiagramDiameterMm(product);
  const lengthLabel = `${formatDecimal(lengthM)} м`;
  const diameterLabel = `Ø${diameter} мм`;

  return (
    <svg
      viewBox="0 0 520 360"
      role="img"
      aria-label={product.name}
      className={`h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id={`smooth-steel-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#eceff2" />
          <stop offset="40%" stopColor="#b0b6bf" />
          <stop offset="100%" stopColor="#6e757e" />
        </linearGradient>
        <linearGradient id={`smooth-shine-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
        <filter id={`smooth-shadow-${uid}`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#1a1f24" floodOpacity={0.18} />
        </filter>
      </defs>

      <rect width="520" height="360" fill="#f6f7f9" />
      <ellipse cx="260" cy={compact ? 270 : 274} rx="148" ry="11" fill="#e3e6ea" opacity={0.8} />

      <g filter={`url(#smooth-shadow-${uid})`}>
        {article === "10510" ? (
          <>
            <SmoothBar id={uid} x={80} y={118} width={360} height={10} />
            <SmoothBar id={uid} x={90} y={168} width={340} height={10} />
            <SmoothBar id={uid} x={100} y={218} width={320} height={10} />
          </>
        ) : null}

        {article === "08729" ? (
          <>
            <SmoothBar id={uid} x={100} y={130} width={300} height={14} rotate={-12} />
            <SmoothBar id={uid} x={120} y={190} width={280} height={14} rotate={8} />
          </>
        ) : null}

        {article === "10388" ? (
          <SmoothBar id={uid} x={60} y={168} width={400} height={18} rotate={-8} />
        ) : null}

        {article === "11533" ? (
          <>
            <ellipse cx="260" cy="200" rx="72" ry="72" fill="none" stroke="#c5cad1" strokeWidth={3} />
            <SmoothBar id={uid} x={110} y={188} width={300} height={16} rotate={-18} />
          </>
        ) : null}

        {article === "08583" ? (
          <>
            <SmoothBar id={uid} x={110} y={175} width={260} height={22} rotate={-20} />
            <DimensionLabels
              compact={compact}
              lengthLabel={lengthLabel}
              diameterLabel={diameterLabel}
            />
          </>
        ) : null}

        {article === "09228" ? (
          <>
            <SmoothBar id={uid} x={72} y={168} width={320} height={28} rotate={-22} />
            <DimensionLabels
              compact={compact}
              lengthLabel={lengthLabel}
              diameterLabel={diameterLabel}
            />
          </>
        ) : null}

        {article === "12420" ? (
          <SmoothBar id={uid} x={85} y={145} width={350} height={38} rotate={-24} />
        ) : null}
      </g>
    </svg>
  );
}
