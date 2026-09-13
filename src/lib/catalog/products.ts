import type { CategoryId, Product, SaleUnit, StockState } from "./types";

/** Плотность стали 7,85 г/см³ → кг/м = 0,00785 × площадь сечения в мм². */
const STEEL_KG_PER_MM2_M = 0.00785;

function round(value: number, digits = 3): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function circleWeight(diameterMm: number): number {
  return round(Math.PI * (diameterMm / 2) ** 2 * STEEL_KG_PER_MM2_M);
}

function solidWeight(areaMm2: number): number {
  return round(areaMm2 * STEEL_KG_PER_MM2_M);
}

function sheetWeight(thicknessMm: number, widthM: number, lengthM: number): number {
  return round(thicknessMm * widthM * lengthM * 7.85, 1);
}

type Draft = {
  slug: string;
  name: string;
  size: string;
  dimension: number;
  steel: string;
  gost: string;
  lengthM: number | null;
  saleUnit: SaleUnit;
  weightKg: number;
  pricePerTon?: number;
  pricePerUnit?: number;
  stock?: StockState;
  popular?: boolean;
};

function build(categoryId: CategoryId, drafts: Draft[]): Product[] {
  return drafts.map((draft) => ({
    slug: draft.slug,
    categoryId,
    name: draft.name,
    size: draft.size,
    dimension: draft.dimension,
    steel: draft.steel,
    gost: draft.gost,
    lengthM: draft.lengthM,
    saleUnit: draft.saleUnit,
    weightKg: draft.weightKg,
    pricePerTon: draft.pricePerTon ?? null,
    pricePerUnit: draft.pricePerUnit ?? null,
    stock: draft.stock ?? "in",
    popular: draft.popular ?? false,
  }));
}

// --- Арматура рифлёная А500С ------------------------------------------------

const RIBBED_PRICE: Record<number, number> = {
  6: 3250,
  8: 3080,
  10: 2960,
  12: 2890,
  14: 2870,
  16: 2860,
  18: 2880,
  20: 2890,
  22: 2920,
  25: 2950,
  28: 3010,
  32: 3080,
};

const REBAR_RIBBED = build(
  "rebar-ribbed",
  [6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32].map((d) => ({
    slug: `armatura-riflenaya-${d}`,
    name: `Арматура рифлёная Ø${d} мм А500С`,
    size: `Ø${d} мм`,
    dimension: d,
    steel: "А500С",
    gost: "ГОСТ 34028-2016",
    lengthM: 11.7,
    saleUnit: "м" as SaleUnit,
    weightKg: circleWeight(d),
    pricePerTon: RIBBED_PRICE[d] ?? 2900,
    popular: d === 10 || d === 12 || d === 8,
  })),
);

// --- Арматура гладкая А240 --------------------------------------------------

const SMOOTH_PRICE: Record<number, number> = {
  6: 3300,
  8: 3120,
  10: 3000,
  12: 2950,
  14: 2930,
  16: 2920,
  18: 2950,
  20: 2960,
};

const REBAR_SMOOTH = build(
  "rebar-smooth",
  [6, 8, 10, 12, 14, 16, 18, 20].map((d) => ({
    slug: `armatura-gladkaya-${d}`,
    name: `Арматура гладкая Ø${d} мм А240`,
    size: `Ø${d} мм`,
    dimension: d,
    steel: "А240 (А1)",
    gost: "ГОСТ 34028-2016",
    lengthM: 11.7,
    saleUnit: "м" as SaleUnit,
    weightKg: circleWeight(d),
    pricePerTon: SMOOTH_PRICE[d] ?? 2960,
    popular: d === 8 || d === 10,
  })),
);

// --- Арматура стеклопластиковая (продаётся метрами) -------------------------

const FIBERGLASS: Array<[number, number, number]> = [
  // [диаметр, вес кг/м, цена BYN/м]
  [4, 0.02, 0.72],
  [6, 0.05, 1.05],
  [8, 0.07, 1.68],
  [10, 0.12, 2.55],
  [12, 0.2, 3.6],
  [14, 0.25, 4.9],
  [16, 0.3, 6.3],
];

const REBAR_FIBERGLASS = build(
  "fiberglass-rebar",
  FIBERGLASS.map(([d, weight, price]) => ({
    slug: `armatura-kompozitnaya-${d}`,
    name: `Арматура стеклопластиковая АКП Ø${d} мм`,
    size: `Ø${d} мм`,
    dimension: d,
    steel: "Стеклоровинг АКП",
    gost: "ГОСТ 31938-2012",
    lengthM: d <= 8 ? null : 6,
    saleUnit: "м" as SaleUnit,
    weightKg: weight,
    pricePerUnit: price,
    popular: d === 6 || d === 8,
  })),
);

// --- Листы стальные ---------------------------------------------------------

const SHEET_HOT: number[] = [2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20];

const SHEET = build("sheet", [
  ...SHEET_HOT.map((t) => ({
    slug: `list-goryachekatanyy-${String(t).replace(".", "-")}`,
    name: `Лист горячекатаный ${t} мм Ст3сп5`,
    size: `${t} × 1500 × 6000 мм`,
    dimension: t,
    steel: "Ст3сп5",
    gost: "ГОСТ 19903-2015",
    lengthM: 6,
    saleUnit: "лист" as SaleUnit,
    weightKg: sheetWeight(t, 1.5, 6),
    pricePerTon: t <= 3 ? 3480 : t <= 6 ? 3260 : 3180,
    popular: t === 3 || t === 4,
  })),
  ...[0.5, 0.55, 0.7, 0.8, 1, 1.2].map((t) => ({
    slug: `list-otsinkovannyy-${String(t).replace(".", "-")}`,
    name: `Лист оцинкованный ${t} мм`,
    size: `${t} × 1250 × 2500 мм`,
    dimension: t,
    steel: "Оцинковка 08пс",
    gost: "ГОСТ 14918-2020",
    lengthM: 2.5,
    saleUnit: "лист" as SaleUnit,
    weightKg: sheetWeight(t, 1.25, 2.5),
    pricePerTon: 4680,
    popular: t === 0.5 || t === 0.8,
  })),
  ...[0.8, 1, 1.5, 2, 3].map((t) => ({
    slug: `list-nerzhaveyushchiy-${String(t).replace(".", "-")}`,
    name: `Лист нержавеющий ${t} мм AISI 304`,
    size: `${t} × 1000 × 2000 мм`,
    dimension: t,
    steel: "AISI 304 (08Х18Н10)",
    gost: "ГОСТ 5582-75",
    lengthM: 2,
    saleUnit: "лист" as SaleUnit,
    weightKg: sheetWeight(t, 1, 2),
    pricePerTon: 21800,
    stock: t === 3 ? ("order" as StockState) : ("in" as StockState),
  })),
]);

// --- Трубы ------------------------------------------------------------------

const PIPE_PROFILE: Array<[string, number, number]> = [
  // [сечение, основной размер, вес кг/м по ГОСТ]
  ["20×20×1,5", 20, 0.85],
  ["25×25×1,5", 25, 1.08],
  ["30×30×2", 30, 1.68],
  ["40×20×2", 40, 1.68],
  ["40×40×2", 40, 2.31],
  ["50×25×2", 50, 2.23],
  ["50×50×2", 50, 2.93],
  ["60×40×2", 60, 2.98],
  ["60×60×3", 60, 5.19],
  ["80×80×3", 80, 7.07],
  ["100×100×4", 100, 11.9],
];

const PIPE_ROUND: Array<[string, number, number]> = [
  ["Ø57×3,5", 57, 4.62],
  ["Ø76×3,5", 76, 6.26],
  ["Ø89×4", 89, 8.38],
  ["Ø108×4", 108, 10.26],
  ["Ø159×4,5", 159, 17.15],
];

const PIPE_VGP: Array<[string, number, number]> = [
  ["Ø15×2,8", 15, 1.28],
  ["Ø20×2,8", 20, 1.66],
  ["Ø25×3,2", 25, 2.39],
  ["Ø32×3,2", 32, 3.09],
  ["Ø40×3,5", 40, 3.84],
  ["Ø50×3,5", 50, 4.88],
];

const PIPE = build("pipe", [
  ...PIPE_PROFILE.map(([size, dimension, weight]) => ({
    slug: `truba-profilnaya-${size.replace(/×/g, "x").replace(/,/g, "-")}`,
    name: `Труба профильная ${size} мм`,
    size: `${size} мм`,
    dimension,
    steel: "Ст3сп/пс",
    gost: "ГОСТ 8639-82",
    lengthM: 6,
    saleUnit: "м" as SaleUnit,
    weightKg: weight,
    pricePerTon: 3420,
    popular: size === "40×40×2" || size === "20×20×1,5",
  })),
  ...PIPE_ROUND.map(([size, dimension, weight]) => ({
    slug: `truba-elektrosvarnaya-${size.replace(/[Ø×]/g, (m) => (m === "Ø" ? "" : "x")).replace(/,/g, "-")}`,
    name: `Труба электросварная ${size} мм`,
    size: `${size} мм`,
    dimension,
    steel: "Ст3сп/пс",
    gost: "ГОСТ 10704-91",
    lengthM: 6,
    saleUnit: "м" as SaleUnit,
    weightKg: weight,
    pricePerTon: 3310,
  })),
  ...PIPE_VGP.map(([size, dimension, weight]) => ({
    slug: `truba-vgp-${size.replace(/[Ø×]/g, (m) => (m === "Ø" ? "" : "x")).replace(/,/g, "-")}`,
    name: `Труба ВГП ${size} мм`,
    size: `${size} мм`,
    dimension,
    steel: "Ст3сп/пс",
    gost: "ГОСТ 3262-75",
    lengthM: 6,
    saleUnit: "м" as SaleUnit,
    weightKg: weight,
    pricePerTon: 3640,
    popular: size === "Ø25×3,2",
  })),
]);

// --- Уголок -----------------------------------------------------------------

const ANGLE: Array<[string, number, number]> = [
  ["25×25×4", 25, 1.46],
  ["32×32×4", 32, 1.91],
  ["35×35×4", 35, 2.1],
  ["40×40×4", 40, 2.42],
  ["45×45×5", 45, 3.39],
  ["50×50×5", 50, 3.77],
  ["63×63×5", 63, 4.81],
  ["63×63×6", 63, 5.72],
  ["75×75×6", 75, 6.89],
  ["90×90×7", 90, 9.64],
  ["100×100×8", 100, 12.25],
];

const ANGLE_PRODUCTS = build(
  "angle",
  ANGLE.map(([size, dimension, weight]) => ({
    slug: `ugolok-${size.replace(/×/g, "x")}`,
    name: `Уголок стальной ${size} мм`,
    size: `${size} мм`,
    dimension,
    steel: "Ст3сп5",
    gost: "ГОСТ 8509-93",
    lengthM: dimension >= 63 ? 11.7 : 6,
    saleUnit: "м" as SaleUnit,
    weightKg: weight,
    pricePerTon: 3120,
    popular: size === "50×50×5" || size === "40×40×4",
  })),
);

// --- Швеллер ----------------------------------------------------------------

const CHANNEL: Array<[string, number, number]> = [
  ["5П", 5, 4.84],
  ["6,5П", 6.5, 5.9],
  ["8П", 8, 7.05],
  ["10П", 10, 8.59],
  ["12П", 12, 10.4],
  ["14П", 14, 12.3],
  ["16П", 16, 14.2],
  ["18П", 18, 16.3],
  ["20П", 20, 18.4],
];

const CHANNEL_PRODUCTS = build(
  "channel",
  CHANNEL.map(([size, dimension, weight]) => ({
    slug: `shveller-${String(dimension).replace(".", "-")}p`,
    name: `Швеллер стальной № ${size}`,
    size: `№ ${size}`,
    dimension,
    steel: "Ст3сп5",
    gost: "ГОСТ 8240-97",
    lengthM: 11.7,
    saleUnit: "м" as SaleUnit,
    weightKg: weight,
    pricePerTon: 3280,
    popular: size === "10П" || size === "12П",
  })),
);

// --- Квадрат ----------------------------------------------------------------

const SQUARE = build(
  "square",
  [10, 12, 14, 16, 20, 25, 30, 40].map((a) => ({
    slug: `kvadrat-${a}`,
    name: `Квадрат стальной ${a}×${a} мм`,
    size: `${a}×${a} мм`,
    dimension: a,
    steel: "Ст3сп/пс",
    gost: "ГОСТ 2591-2006",
    lengthM: 6,
    saleUnit: "м" as SaleUnit,
    weightKg: solidWeight(a * a),
    pricePerTon: 3180,
    popular: a === 12 || a === 20,
  })),
);

// --- Полоса -----------------------------------------------------------------

const STRIP: Array<[number, number]> = [
  [20, 4],
  [25, 4],
  [30, 4],
  [40, 4],
  [40, 5],
  [50, 5],
  [50, 6],
  [60, 6],
  [80, 8],
  [100, 10],
];

const STRIP_PRODUCTS = build(
  "strip",
  STRIP.map(([w, t]) => ({
    slug: `polosa-${w}x${t}`,
    name: `Полоса стальная ${w}×${t} мм`,
    size: `${w}×${t} мм`,
    dimension: w,
    steel: "Ст3сп/пс",
    gost: "ГОСТ 103-2006",
    lengthM: 6,
    saleUnit: "м" as SaleUnit,
    weightKg: solidWeight(w * t),
    pricePerTon: 3340,
    popular: w === 40 && t === 4,
  })),
);

// --- Сетка сварная (продаётся картами) --------------------------------------

const MESH: Array<[string, number, string, number, number, number]> = [
  // [ячейка, размер ячейки, размер карты, площадь м², вес карты кг, цена BYN/карта]
  ["50×50×3", 50, "1000 × 2000 мм", 2, 4.6, 24.5],
  ["100×100×4", 100, "2000 × 3000 мм", 6, 12.4, 61.9],
  ["100×100×5", 100, "2000 × 3000 мм", 6, 19.3, 94.8],
  ["150×150×4", 150, "2000 × 3000 мм", 6, 8.6, 43.8],
  ["200×200×5", 200, "2000 × 6000 мм", 12, 21.6, 106.5],
];

const MESH_PRODUCTS = build(
  "mesh",
  MESH.map(([cell, dimension, card, area, weight, price]) => ({
    slug: `setka-svarnaya-${cell.replace(/×/g, "x")}`,
    name: `Сетка сварная ${cell} мм, карта ${card}`,
    size: `Ячейка ${cell} мм · ${area} м²`,
    dimension,
    steel: "Вр-1 / А500С",
    gost: "ГОСТ 23279-2012",
    lengthM: null,
    saleUnit: "карта" as SaleUnit,
    weightKg: weight,
    pricePerUnit: price,
    popular: cell === "100×100×4",
  })),
);

// --- Сопутствующие товары ---------------------------------------------------

const SUPPLIES = build("supplies", [
  {
    slug: "provoloka-vyazalnaya-1-2",
    name: "Проволока вязальная Ø1,2 мм, отожжённая",
    size: "Ø1,2 мм · моток 5 кг",
    dimension: 1.2,
    steel: "Ст3 отожжённая",
    gost: "ГОСТ 3282-74",
    lengthM: null,
    saleUnit: "шт",
    weightKg: 5,
    pricePerUnit: 21.9,
    popular: true,
  },
  {
    slug: "provoloka-vyazalnaya-1-6",
    name: "Проволока вязальная Ø1,6 мм, отожжённая",
    size: "Ø1,6 мм · моток 5 кг",
    dimension: 1.6,
    steel: "Ст3 отожжённая",
    gost: "ГОСТ 3282-74",
    lengthM: null,
    saleUnit: "шт",
    weightKg: 5,
    pricePerUnit: 20.4,
  },
  {
    slug: "elektrody-mr-3-3",
    name: "Электроды МР-3 Ø3 мм, упаковка 5 кг",
    size: "Ø3 мм · 5 кг",
    dimension: 3,
    steel: "МР-3",
    gost: "ГОСТ 9466-75",
    lengthM: null,
    saleUnit: "шт",
    weightKg: 5,
    pricePerUnit: 32.5,
    popular: true,
  },
  {
    slug: "elektrody-uoni-13-55-3",
    name: "Электроды УОНИ 13/55 Ø3 мм, упаковка 5 кг",
    size: "Ø3 мм · 5 кг",
    dimension: 3,
    steel: "УОНИ 13/55",
    gost: "ГОСТ 9466-75",
    lengthM: null,
    saleUnit: "шт",
    weightKg: 5,
    pricePerUnit: 41.8,
  },
  {
    slug: "disk-otreznoy-125",
    name: "Диск отрезной по металлу 125 × 1,2 мм",
    size: "125 × 1,2 × 22,2 мм",
    dimension: 125,
    steel: "Корунд",
    gost: "ГОСТ 21963-2002",
    lengthM: null,
    saleUnit: "шт",
    weightKg: 0.05,
    pricePerUnit: 2.4,
  },
  {
    slug: "disk-otreznoy-230",
    name: "Диск отрезной по металлу 230 × 2 мм",
    size: "230 × 2 × 22,2 мм",
    dimension: 230,
    steel: "Корунд",
    gost: "ГОСТ 21963-2002",
    lengthM: null,
    saleUnit: "шт",
    weightKg: 0.15,
    pricePerUnit: 5.8,
  },
  {
    slug: "anker-klinovoy-10x100",
    name: "Анкер клиновой 10 × 100 мм, оцинкованный",
    size: "10 × 100 мм",
    dimension: 10,
    steel: "Сталь, цинк",
    gost: "DIN 1481",
    lengthM: null,
    saleUnit: "шт",
    weightKg: 0.06,
    pricePerUnit: 1.35,
  },
  {
    slug: "grunt-emal-3v1-20",
    name: "Грунт-эмаль 3 в 1 по металлу, 20 кг",
    size: "20 кг · серый",
    dimension: 20,
    steel: "Алкидная",
    gost: "ТУ 2312",
    lengthM: null,
    saleUnit: "шт",
    weightKg: 20,
    pricePerUnit: 168,
    popular: true,
  },
  {
    slug: "krug-stalnoy-12",
    name: "Круг стальной Ø12 мм",
    size: "Ø12 мм",
    dimension: 12,
    steel: "Ст3сп/пс",
    gost: "ГОСТ 2590-2006",
    lengthM: 6,
    saleUnit: "м",
    weightKg: circleWeight(12),
    pricePerTon: 3240,
  },
  {
    slug: "krug-stalnoy-20",
    name: "Круг стальной Ø20 мм",
    size: "Ø20 мм",
    dimension: 20,
    steel: "Ст3сп/пс",
    gost: "ГОСТ 2590-2006",
    lengthM: 6,
    saleUnit: "м",
    weightKg: circleWeight(20),
    pricePerTon: 3210,
  },
]);

export const PRODUCTS: Product[] = [
  ...REBAR_RIBBED,
  ...REBAR_SMOOTH,
  ...REBAR_FIBERGLASS,
  ...SHEET,
  ...PIPE,
  ...ANGLE_PRODUCTS,
  ...CHANNEL_PRODUCTS,
  ...SQUARE,
  ...STRIP_PRODUCTS,
  ...MESH_PRODUCTS,
  ...SUPPLIES,
];
