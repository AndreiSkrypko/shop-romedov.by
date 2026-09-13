/** Единица, в которой товар продаётся и считается в корзине. */
export type SaleUnit = "м" | "лист" | "шт" | "карта" | "боб";

/** Источник данных: статический каталог или выгрузка из БД (демо). */
export type ProductSource = "static" | "db";

export type StockState = "in" | "order";

export type CategoryId =
  | "rebar-ribbed"
  | "rebar-smooth"
  | "fiberglass-rebar"
  | "sheet"
  | "pipe"
  | "angle"
  | "channel"
  | "square"
  | "strip"
  | "mesh"
  | "supplies";

export type Category = {
  id: CategoryId;
  slug: string;
  name: string;
  /** Короткое название для меню и хлебных крошек. */
  menuName: string;
  tagline: string;
  description: string;
  image: string;
  order: number;
  /** Заголовок колонки основного размера в таблице и фильтрах. */
  dimensionLabel: string;
  seoTitle: string;
  seoDescription: string;
};

export type Product = {
  slug: string;
  categoryId: CategoryId;
  /** Полное название: «Арматура рифлёная Ø12 А500С». */
  name: string;
  /** Типоразмер: «Ø12 мм», «40×40×2 мм». */
  size: string;
  /** Основной размер числом — для сортировки и фильтра. */
  dimension: number;
  /** Марка стали или материал. */
  steel: string;
  gost: string;
  /** Длина хлыста/листа в метрах; null — если не применимо. */
  lengthM: number | null;
  saleUnit: SaleUnit;
  /** Вес одной единицы продажи, кг. */
  weightKg: number;
  /** Цена за тонну, BYN. Для проката. */
  pricePerTon: number | null;
  /** Цена за единицу продажи, BYN. Для штучных позиций. */
  pricePerUnit: number | null;
  stock: StockState;
  popular: boolean;
  source?: ProductSource;
  /** Артикул для витрины, например «15191». */
  article?: string;
  /** Название в плитке каталога (короче полного). */
  cardTitle?: string;
  /** Своё фото товара; иначе — изображение категории. */
  image?: string;
  /** Цена за метр, если в корзине считаем бухты/упаковки. */
  pricePerMeter?: number | null;
  /** Метров в одной единице продажи (бухта, упаковка). */
  metersPerSaleUnit?: number | null;
};
