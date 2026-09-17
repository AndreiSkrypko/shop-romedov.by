import { useId } from "react";

import { formatDecimal } from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import {
  rebarDiagramDiameterMm,
  rebarDiagramLengthM,
} from "@/lib/catalog/rebar-visual";

type RibbedRebarCatalogIllustrationProps = {
  article: string;
  product: Product;
  variant?: "detail" | "card";
  className?: string;
};

function RibbedBar({
  id,
  x,
  y,
  width,
  height,
  rotate = 0,
  ribs = 18,
}: {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
  ribs?: number;
}) {
  const cx = x + width / 2;
  const cy = y + height / 2;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate}) translate(${-width / 2} ${-height / 2})`}>
      <rect x={0} y={0} width={width} height={height} rx={height / 2} fill={`url(#steel-${id})`} />
      <rect
        x={width * 0.03}
        y={height * 0.15}
        width={width * 0.88}
        height={height * 0.25}
        rx={height / 4}
        fill={`url(#shine-${id})`}
      />
      {Array.from({ length: ribs }, (_, i) => (
        <ellipse
          key={i}
          cx={8 + i * (width / ribs)}
          cy={height / 2}
          rx={Math.max(2, height * 0.12)}
          ry={height * 0.38}
          fill="#4f565f"
          opacity={0.32}
        />
      ))}
      <ellipse cx={width - 2} cy={height / 2} rx={height / 2} ry={height / 2} fill="#6c737c" />
    </g>
  );
}

export function RibbedRebarCatalogIllustration({
  article,
  product,
  variant = "card",
  className = "",
}: RibbedRebarCatalogIllustrationProps) {
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
        <linearGradient id={`steel-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8eaed" />
          <stop offset="35%" stopColor="#9aa1aa" />
          <stop offset="100%" stopColor="#5d636c" />
        </linearGradient>
        <linearGradient id={`shine-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
        <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#1a1f24" floodOpacity={0.2} />
        </filter>
      </defs>

      <rect width="520" height="360" fill="#f4f5f7" />
      <ellipse cx="260" cy={compact ? 268 : 272} rx="150" ry="12" fill="#dfe2e6" opacity={0.75} />

      <g filter={`url(#shadow-${uid})`}>
        {article === "08152" ? (
          <>
            <RibbedBar id={uid} x={70} y={108} width={380} height={14} ribs={24} />
            <RibbedBar id={uid} x={70} y={158} width={380} height={14} ribs={24} />
            <RibbedBar id={uid} x={70} y={208} width={380} height={14} ribs={24} />
          </>
        ) : null}

        {article === "16068" ? (
          <RibbedBar id={uid} x={90} y={150} width={340} height={36} rotate={-26} ribs={20} />
        ) : null}

        {article === "10311" ? (
          <>
            <RibbedBar id={uid} x={120} y={100} width={280} height={16} rotate={-14} ribs={22} />
            <RibbedBar id={uid} x={130} y={122} width={260} height={16} rotate={-10} ribs={20} />
            <RibbedBar id={uid} x={140} y={144} width={240} height={16} rotate={-6} ribs={18} />
            <RibbedBar id={uid} x={150} y={166} width={220} height={16} rotate={-2} ribs={16} />
            <RibbedBar id={uid} x={160} y={188} width={200} height={16} rotate={4} ribs={14} />
          </>
        ) : null}

        {article === "05862" ? (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <RibbedBar
                key={i}
                id={uid}
                x={88}
                y={92 + i * 28}
                width={344}
                height={18}
                ribs={26}
              />
            ))}
          </>
        ) : null}

        {article === "08492" ? (
          <>
            {[-10, -5, 0, 5, 10, 15, 20, 25].map((rot, i) => (
              <RibbedBar
                key={i}
                id={uid}
                x={130}
                y={78 + i * 18}
                width={260}
                height={22}
                rotate={rot}
                ribs={22}
              />
            ))}
          </>
        ) : null}

        {article === "06626" || article === "08663" || article === "08750" ? (
          <>
            <RibbedBar
              id={uid}
              x={72}
              y={168}
              width={320}
              height={article === "08663" ? 34 : article === "08750" ? 30 : 28}
              rotate={-22}
              ribs={24}
            />
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
        ) : null}
      </g>
    </svg>
  );
}
