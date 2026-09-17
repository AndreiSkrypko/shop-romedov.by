type Variant = "compact" | "full";

export function AdminCatalogGuide({ variant = "full" }: { variant?: Variant }) {
  if (variant === "compact") {
    return (
      <p className="text-sm text-muted-foreground">
        Сначала <strong className="font-medium text-foreground">категория</strong>, при необходимости{" "}
        <strong className="font-medium text-foreground">подкатегории</strong>, затем{" "}
        <strong className="font-medium text-foreground">товары</strong>. Если у категории есть
        подкатегории — у каждого товара нужно указать подкатегорию, иначе он виден только в «Вся
        категория» на сайте.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-muted/25 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
        Как устроен каталог на сайте
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-4">
        <li>
          <strong className="font-medium text-foreground">Категория</strong> — раздел каталога
          (/catalog/…): арматура, трубы, лист и т.д.
        </li>
        <li>
          <strong className="font-medium text-foreground">Подкатегория</strong> — необязательно.
          Нужна, если внутри категории несколько типов (например ВГП, профильная и круглая труба).
          На сайте это плитки-фильтры над списком товаров.
        </li>
        <li>
          <strong className="font-medium text-foreground">Товар</strong> всегда привязан к одной
          категории. Если у категории есть подкатегории — выберите подкатегорию в карточке товара,
          иначе позиция не попадёт в фильтр по плитке (останется только в «Вся категория»).
        </li>
      </ol>
    </div>
  );
}
