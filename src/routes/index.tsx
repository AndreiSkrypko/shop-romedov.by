import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  PhoneCall,
  Ruler,
  Scissors,
  Truck,
  Warehouse,
} from "lucide-react";

import { CategoryCard } from "@/components/shop/CategoryCard";
import { ProductCardCatalog } from "@/components/shop/ProductCardCatalog";
import { Shell } from "@/components/shop/Shell";
import {
  getPopularProductsAsync,
  useCatalogCategories,
  useTotalPublishedProductCount,
} from "@/lib/catalog";
import { rememberDbProducts } from "@/lib/catalog/db-cache";
import { PHONES, PHONE_DISPLAY, PHONE_HREF } from "@/lib/contacts";
import { ORGANIZATION_LD, buildSeo, jsonLd } from "@/lib/seo";
import { MAIN_SITE_URL, PRICE_NOTE } from "@/lib/site";

export const Route = createFileRoute("/")({
  loader: async () => {
    const popular = (await getPopularProductsAsync(8)).filter((product) => product.popular);
    rememberDbProducts(popular);
    return { popular };
  },
  staleTime: 0,
  head: () =>
    buildSeo({
      title: "Металлопрокат в Минске и Борисове — интернет-магазин Ромедов",
      description:
        "Арматура, листы, трубы, уголок, швеллер, квадрат, полоса и сетка со склада. Цена за тонну и за метр, резка в размер, доставка по Беларуси. Заказ онлайн за 2 минуты.",
      path: "/",
      keywords:
        "металлопрокат минск, купить арматуру, лист стальной, труба профильная, уголок, швеллер, металлопрокат борисов",
    }),
  component: HomePage,
});

const ADVANTAGES = [
  {
    Icon: Warehouse,
    title: "Склад в Борисове",
    text: "Ходовой сортамент всегда в наличии — отгружаем в день обращения, без ожидания завода.",
  },
  {
    Icon: Scissors,
    title: "Резка в размер",
    text: "Порежем хлысты и раскроим лист под ваш проект: гильотина, ленточная пила, лазер, плазма.",
  },
  {
    Icon: Truck,
    title: "Доставка по Беларуси",
    text: "Свой транспорт от 1 до 20 тонн. Минск и область — на следующий день после оплаты.",
  },
  {
    Icon: BadgeCheck,
    title: "Документы и сертификаты",
    text: "ТТН, счёт-фактура, сертификат качества на каждую партию. Работаем с НДС.",
  },
  {
    Icon: Ruler,
    title: "Точный расчёт веса",
    text: "В каталоге указан вес метра и цена за тонну — вы сразу видите итог по своему объёму.",
  },
  {
    Icon: ClipboardList,
    title: "Изготовим деталь",
    text: "Нет нужной позиции? Сделаем на своём производстве: фрезерование, гибка, сварка.",
  },
];

const STEPS = [
  {
    title: "Собираете корзину",
    text: "Выбираете сортамент, указываете метраж или количество листов. Вес и стоимость считаются сразу.",
  },
  {
    title: "Оформляете заказ",
    text: "Оставляете контакты и способ получения. Для организаций — реквизиты для счёта.",
  },
  {
    title: "Подтверждаем наличие",
    text: "Менеджер перезванивает в течение 30 минут: сверяем сортамент, сроки и итоговую сумму.",
  },
  {
    title: "Отгружаем",
    text: "Забираете со склада или привозим своим транспортом вместе с полным пакетом документов.",
  },
];

function HomePage() {
  const { popular } = Route.useLoaderData();
  const categories = useCatalogCategories();
  const totalProducts = useTotalPublishedProductCount();

  return (
    <Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          ...ORGANIZATION_LD,
          contactPoint: PHONES.map((phone) => ({
            "@type": "ContactPoint",
            telephone: phone.href.replace("tel:", ""),
            contactType: phone.label ?? "customer service",
            areaServed: "BY",
            availableLanguage: ["ru", "be"],
          })),
        })}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-carbon text-background">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 18px, rgba(255,255,255,0.6) 18px 19px)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">
            Металлопрокат · Минск · Борисов
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold uppercase leading-[1.05] sm:text-5xl lg:text-6xl">
            Металл со склада <span className="text-brand">с точным весом</span> и ценой на месте
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-background/70 sm:text-lg">
            {totalProducts > 0 ? `${totalProducts} позиций` : "Сортамент"} арматуры, листа, трубы,
            уголка и швеллера. Вес метра, цена за
            тонну и итог по вашему объёму видны прямо в каталоге — без переписки и ожидания прайса.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/catalog"
              className="inline-flex h-13 items-center gap-2 rounded-full bg-brand px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.12em] text-brand-foreground transition-transform hover:-translate-y-0.5"
            >
              Открыть каталог
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 rounded-full border border-background/30 px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.12em] transition-colors hover:border-brand hover:text-brand"
            >
              <PhoneCall className="h-4 w-4" />
              {PHONE_DISPLAY}
            </a>
          </div>

          <dl className="mt-14 grid gap-8 border-t border-background/15 pt-8 sm:grid-cols-3 lg:max-w-3xl">
            {[
              { value: String(categories.length || "—"), label: "категорий сортамента" },
              { value: "30 мин", label: "подтверждение заказа" },
              { value: "20 т", label: "максимум за одну машину" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-3xl font-semibold text-brand">{stat.value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.14em] text-background/55">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Категории */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold uppercase sm:text-4xl">Каталог</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Выберите категорию — внутри полный сортамент с диаметрами, марками стали и весом
              погонного метра. Нужного размера нет в списке? Подберём аналог или изготовим деталь.
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.14em] text-lime-deep"
          >
            Все категории
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Популярные позиции */}
      <section className="bg-secondary/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="font-display text-3xl font-semibold uppercase sm:text-4xl">
            Чаще всего заказывают
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Позиции с отметкой «Популярное» в админке — ходовой сортамент со склада. {PRICE_NOTE}
          </p>

          {popular.length === 0 ? (
            <div className="mt-9 rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
              <p className="font-display text-base font-semibold uppercase text-foreground">
                Пока нет популярных позиций
              </p>
              <p className="mx-auto mt-2 max-w-md leading-relaxed">
                Отметьте нужные товары в админке (галочка «На главной в блоке популярных») или откройте
                полный каталог.
              </p>
              <Link
                to="/catalog"
                className="mt-5 inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.12em] text-lime-deep"
              >
                Весь каталог
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {popular.map((product) => (
                <ProductCardCatalog key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Преимущества */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <h2 className="font-display text-3xl font-semibold uppercase sm:text-4xl">
          Почему заказывают у нас
        </h2>

        <div className="mt-9 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map(({ Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/20 text-ink">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold uppercase">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Как заказать */}
      <section className="bg-graphite py-16 text-background lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="font-display text-3xl font-semibold uppercase sm:text-4xl">
            Как заказать
          </h2>

          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="border-t border-brand/40 pt-5">
                <span className="font-display text-4xl font-semibold text-brand/40">
                  0{index + 1}
                </span>
                <h3 className="mt-3 font-display text-base font-semibold uppercase">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-background/65">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="rounded-3xl border border-border bg-secondary/40 p-8 sm:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-semibold uppercase sm:text-3xl">
                Не нашли нужную позицию?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Опишите задачу — подберём металлопрокат по чертежу, посчитаем раскрой или изготовим
                деталь на нашем производстве: фрезерование, токарная обработка, гибка, сварка.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/contacts"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.12em] text-brand-foreground transition-transform hover:-translate-y-0.5"
              >
                Отправить заявку
              </Link>
              <a
                href={`${MAIN_SITE_URL}/#production`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.12em] transition-colors hover:border-lime-deep hover:text-lime-deep"
              >
                Наше производство
              </a>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
