import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export type AdminInstructionTopic = "category" | "subcategory" | "product" | "all";

const slugRules = (
  <>
    Только латиница (<code className="text-xs">a-z</code>), цифры и дефисы. Без пробелов и кириллицы.
    Пример: <code className="text-xs">armatura-riflenaya</code>, <code className="text-xs">profilnye</code>.
  </>
);

function FieldBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-border/70 py-3 last:border-0">
      <p className="font-medium text-foreground">{title}</p>
      <div className="mt-1.5 space-y-1 text-xs leading-relaxed">{children}</div>
    </div>
  );
}

function CategoryFields() {
  return (
    <>
      <FieldBlock title="Id (ключ в базе) *">
        <p>
          Внутренний идентификатор категории. По нему в базе привязаны товары и подкатегории (поле{" "}
          <code className="text-xs">category_id</code>).
        </p>
        <p>
          Формат: {slugRules} Обычно совпадает со slug или короче:{" "}
          <code className="text-xs">rebar-ribbed</code>, <code className="text-xs">pipe</code>.
        </p>
        <p className="text-amber-800 dark:text-amber-200">
          После создания id не меняют — иначе «отвяжутся» товары. При редактировании поле
          заблокировано.
        </p>
      </FieldBlock>
      <FieldBlock title="Slug (в URL /catalog/…) *">
        <p>
          Часть адреса страницы категории:{" "}
          <code className="text-xs">/catalog/ваш-slug</code>
        </p>
        <p>Формат: {slugRules}</p>
        <p>Можно сгенерировать из названия (латиница в slug подставляется автоматически при blur).</p>
      </FieldBlock>
      <FieldBlock title="Название / В меню">
        <p>
          <strong>Название</strong> — заголовок на странице категории. <strong>В меню</strong> — короткая
          подпись в выпадающем каталоге (можно совпадать с названием).
        </p>
      </FieldBlock>
      <FieldBlock title="Подзаголовок и описание">
        <p>Подзаголовок — строка под заголовком. Описание — текст SEO и блок «о разделе» на витрине.</p>
      </FieldBlock>
      <FieldBlock title="Порядок">
        <p>
          Число для сортировки в каталоге: меньше — выше в списке (1, 2, 3…). У новых можно оставить 100.
        </p>
      </FieldBlock>
      <FieldBlock title="Колонка размера">
        <p>
          Подпись фильтра/таблицы в категории: «Диаметр», «Толщина», «Сечение» и т.д.
        </p>
      </FieldBlock>
      <FieldBlock title="Обложка">
        <p>Картинка плитки категории. Загрузка файла или путь вида /products/….webp</p>
      </FieldBlock>
      <FieldBlock title="SEO title / description">
        <p>Заголовок и описание для поисковиков (вкладка браузера, Google). Если пусто — подставится название.</p>
      </FieldBlock>
      <FieldBlock title="Показывать на сайте">
        <p>Снятая галочка скрывает категорию с витрины (запись остаётся в базе).</p>
      </FieldBlock>
    </>
  );
}

function SubcategoryFields() {
  return (
    <>
      <FieldBlock title="Id (ключ в базе) *">
        <p>
          Уникальный ключ подкатегории в таблице <code className="text-xs">subcategories</code>. В товаре
          сохраняется ссылка на этот id (<code className="text-xs">subcategory_id</code>), не на slug.
        </p>
        <p>
          Формат: латиница, цифры, дефисы. Удобно:{" "}
          <code className="text-xs">категория-краткое-имя</code>, например{" "}
          <code className="text-xs">pipe-vgp</code>, <code className="text-xs">pipe-profilnye</code>.
        </p>
        <p className="text-amber-800 dark:text-amber-200">
          После создания id не меняют. При редактировании поле заблокировано.
        </p>
      </FieldBlock>
      <FieldBlock title="Slug (в URL ?sub=) *">
        <p>
          Короткий код для фильтра на сайте. Адрес:{" "}
          <code className="text-xs">/catalog/truby-stalnye?sub=vgp</code> — здесь{" "}
          <code className="text-xs">vgp</code> это slug подкатегории.
        </p>
        <p>Формат: {slugRules} Slug можно менять при редактировании (id остаётся прежним).</p>
        <p>
          <strong>Id и slug — разное:</strong> id для базы и привязки товаров, slug только для красивого
          параметра ?sub= в ссылке.
        </p>
      </FieldBlock>
      <FieldBlock title="Название">
        <p>Текст на плитке подкатегории на странице категории (например «Трубы профильные»).</p>
      </FieldBlock>
      <FieldBlock title="Порядок">
        <p>Порядок плиток слева направо: меньшее число — раньше.</p>
      </FieldBlock>
      <FieldBlock title="Фото для плитки">
        <p>Иконка на плитке. Если пусто — на сайте подставится картинка категории.</p>
      </FieldBlock>
      <FieldBlock title="Опубликована">
        <p>Скрытые подкатегории не показываются покупателям.</p>
      </FieldBlock>
    </>
  );
}

function ProductFields() {
  return (
    <>
      <FieldBlock title="Категория и подкатегория">
        <p>
          Категория обязательна. Если у категории есть подкатегории — выберите подкатегорию, иначе товар
          виден только в «Вся категория», а не в плитке ?sub=.
        </p>
      </FieldBlock>
      <FieldBlock title="Slug *">
        <p>
          Адрес карточки товара: <code className="text-xs">/product/ваш-slug</code>. Уникален по всему
          каталогу.
        </p>
        <p>Формат: {slugRules} Кнопка «Из названия» помогает при создании. После создания slug не меняют.</p>
      </FieldBlock>
      <FieldBlock title="Типоразмер *">
        <p>
          Короткая подпись в таблице каталога и в характеристиках карточки (подпись колонки задаётся в
          категории: «Диаметр», «Толщина» и т.д.).
        </p>
        <p>
          Пишите так, как видит покупатель: <code className="text-xs">Ø12 мм</code>,{" "}
          <code className="text-xs">100×100×6</code>, <code className="text-xs">лист 4 мм</code>.
        </p>
      </FieldBlock>
      <FieldBlock title="Размер (число) *">
        <p>
          То же измерение, но <strong>числом</strong> — для сортировки в каталоге и блока «похожие
          товары» (ближе по диаметру/толщине).
        </p>
        <p>
          Примеры: диаметр 12 → <code className="text-xs">12</code>; Ø6 → <code className="text-xs">6</code>
          ; толщина 0,5 мм → <code className="text-xs">0.5</code> (точка, не запятая).
        </p>
      </FieldBlock>
      <FieldBlock title="Марка и ГОСТ / ТУ">
        <p>
          <strong>Марка</strong> — сталь или материал (S500, Ст3, АКП…). <strong>ГОСТ / ТУ</strong> —
          стандарт в карточке и SEO. Необязательно, но для металлопроката обычно заполняют.
        </p>
      </FieldBlock>
      <FieldBlock title="Ед. продажи *">
        <p>Что добавляется в корзину одним «+»:</p>
        <ul className="list-disc space-y-1 pl-4">
          <li>
            <strong>м</strong> — металл по метражу (арматура, трубы в метрах). Заказ целыми метрами, мин. 1 м.
          </li>
          <li>
            <strong>лист</strong>, <strong>карта</strong> — листовой прокат, картон и т.п.
          </li>
          <li>
            <strong>шт</strong> — штуки (пруток фиксированной длины, детали).
          </li>
          <li>
            <strong>боб</strong> — бухта (на сайте подпись «бухта» для композитной арматуры).
          </li>
        </ul>
      </FieldBlock>
      <FieldBlock title="Вес ед., кг *">
        <p>
          Масса <strong>одной единицы продажи</strong> в килограммах: кг/м, кг/лист, кг/бухту, кг/шт. От
          веса считается сумма в корзине, если цена задана за тонну.
        </p>
        <p>
          Пример арматуры Ø6, продажа метрами: вес одного метра{" "}
          <code className="text-xs">0.222</code> кг. Бухта 50 м весом 3,5 кг → ед. «боб», вес{" "}
          <code className="text-xs">3.5</code>.
        </p>
      </FieldBlock>
      <FieldBlock title="Длина, м">
        <p>
          Справочно в карточке: хлыст 11,7 м, пруток 3 м, бухта 50 м. <strong>Не путать с «метров в
          единице»:</strong> при продаже <strong>метрами</strong> (ед. «м») в корзине уже идут метры, длина —
          только «мерный хлыст». «Метров в единице» нужно только для <strong>бухты</strong> (ед. «боб»).
        </p>
      </FieldBlock>
      <FieldBlock title="Цены (хотя бы одна обязательна)">
        <p className="text-amber-800 dark:text-amber-200">
          В корзине сумма считается по <strong>цене/ед.</strong> или по <strong>цене/тонна</strong> (цена
          метра = вес_м × цена_тонны / 1000). Поле <strong>цена/метр</strong> — для отображения на
          витрине; для расчёта заказа при «м» достаточно цены за тонну + вес кг/м.
        </p>
        <ul className="list-disc space-y-2 pl-4">
          <li>
            <strong>Металл по метрам (ед. «м»):</strong> обычно только{" "}
            <strong>цена/тонна</strong>. Пример: 3450 BYN/т, вес 0,222 кг/м → на карточке покажется цена
            за метр автоматически.
          </li>
          <li>
            <strong>Бухта (ед. «боб»):</strong> <strong>цена/ед.</strong> за бухту +{" "}
            <strong>цена/метр</strong> + <strong>метров в единице</strong> (50). Пример: 59,5 BYN/бухта,
            1,19 BYN/м, 50 м в бухте.
          </li>
          <li>
            <strong>Пруток (ед. «шт»):</strong> <strong>цена/ед.</strong> за штуку,{" "}
            <strong>цена/метр</strong>, <strong>длина, м</strong> = длина одного прутка (3). «Метров в
            единице» можно не заполнять.
          </li>
          <li>
            <strong>Лист / штука без метража:</strong> <strong>цена/ед.</strong> или{" "}
            <strong>цена/тонна</strong> + вес одного листа.
          </li>
        </ul>
        <p>Все суммы — в BYN, без «р.» в поле, точка для дробной части: 59.5</p>
      </FieldBlock>
      <FieldBlock title="Метров в единице (только бухта)">
        <p>
          Только при ед. продажи <strong>«боб»</strong>: метров в одной бухте (50). На карточке связь бухты и
          метров. При ед. «м» поле в форме скрыто — оно не используется.
        </p>
      </FieldBlock>
      <FieldBlock title="Наличие / На главной / На сайте">
        <p>
          «В наличии», «Нет в наличии», «Под заказ». «На главной…» — блок «Чаще всего заказывают» (до 8
          позиций). «На сайте» — снять с публикации без удаления из базы.
        </p>
      </FieldBlock>
      <FieldBlock title="Заголовок плитки и фото">
        <p>
          <strong>Заголовок плитки</strong> — короткое имя в сетке (если пусто — типоразмер/название). Фото
          — своё изображение; иначе схема/картинка категории.
        </p>
      </FieldBlock>
    </>
  );
}

export function AdminFieldInstructions({
  topic = "all",
  defaultOpen = false,
}: {
  topic?: AdminInstructionTopic;
  defaultOpen?: boolean;
}) {
  const showCategory = topic === "all" || topic === "category";
  const showSub = topic === "all" || topic === "subcategory";
  const showProduct = topic === "all" || topic === "product";

  return (
    <details
      className="rounded-2xl border border-border bg-muted/20 text-sm text-muted-foreground"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none px-5 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.12em] text-foreground [&::-webkit-details-marker]:hidden">
        Справка по полям формы
        <span className="ml-2 font-normal normal-case tracking-normal text-muted-foreground">
          (id, slug, URL на сайте)
        </span>
      </summary>
      <div className="border-t border-border px-5 pb-4 pt-1">
        {topic !== "all" ? (
          <p className="mb-3 text-xs">
            <Link to="/admin/help" className="text-lime-deep hover:underline">
              Полная инструкция по всем разделам →
            </Link>
          </p>
        ) : null}

        {showCategory ? (
          <section className="mt-2">
            <h3 className="font-display text-[11px] font-semibold uppercase tracking-wider text-lime-deep">
              Категория
            </h3>
            <CategoryFields />
          </section>
        ) : null}

        {showSub ? (
          <section className="mt-4">
            <h3 className="font-display text-[11px] font-semibold uppercase tracking-wider text-lime-deep">
              Подкатегория
            </h3>
            <SubcategoryFields />
          </section>
        ) : null}

        {showProduct ? (
          <section className="mt-4">
            <h3 className="font-display text-[11px] font-semibold uppercase tracking-wider text-lime-deep">
              Товар
            </h3>
            <ProductFields />
          </section>
        ) : null}
      </div>
    </details>
  );
}

export function AdminHelpPageContent() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-muted/25 px-5 py-4 text-sm leading-relaxed">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
          Id и slug — в двух словах
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Id</strong> — технический ключ в Supabase. Связи в базе
            (товар → категория, товар → подкатегория) идут по id. После создания не меняется.
          </li>
          <li>
            <strong className="text-foreground">Slug</strong> — часть адреса для людей и SEO. Категория:{" "}
            <code className="text-xs">/catalog/slug</code>. Товар: <code className="text-xs">/product/slug</code>.
            Подкатегория: параметр <code className="text-xs">?sub=slug</code> (id в URL не используется).
          </li>
        </ul>
      </div>

      <section className={`rounded-2xl border border-border bg-card p-6`}>
        <h2 className="font-display text-lg font-semibold uppercase">Категория</h2>
        <div className="mt-4">
          <CategoryFields />
        </div>
      </section>

      <section className={`rounded-2xl border border-border bg-card p-6`}>
        <h2 className="font-display text-lg font-semibold uppercase">Подкатегория</h2>
        <div className="mt-4">
          <SubcategoryFields />
        </div>
      </section>

      <section className={`rounded-2xl border border-border bg-card p-6`}>
        <h2 className="font-display text-lg font-semibold uppercase">Товар</h2>
        <div className="mt-4">
          <ProductFields />
        </div>
      </section>
    </div>
  );
}
