import { Link, createFileRoute } from "@tanstack/react-router";
import { Banknote, CreditCard, FileText, MapPin, Scissors, Truck } from "lucide-react";

import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { Shell } from "@/components/shop/Shell";
import {
  ACCESS_NOTE,
  ADDRESS_PRODUCTION,
  PHONE_DISPLAY,
  PHONE_HREF,
  WORK_HOURS,
} from "@/lib/contacts";
import { buildSeo, jsonLd } from "@/lib/seo";
import { MAIN_SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/delivery")({
  head: () =>
    buildSeo({
      title: "Доставка и оплата металлопроката по Беларуси | Ромедов",
      description:
        "Самовывоз со склада в Борисове и доставка своим транспортом от 1 до 20 тонн по Минску, области и всей Беларуси. Оплата наличными, картой или по счёту с НДС.",
      path: "/delivery",
      keywords:
        "доставка металлопроката минск, доставка металла беларусь, оплата по счёту, самовывоз",
    }),
  component: DeliveryPage,
});

const ZONES = [
  { area: "Борисов и район", term: "В день заказа", note: "При оплате до 14:00" },
  { area: "Минск и Минский район", term: "1 рабочий день", note: "Ежедневные рейсы" },
  {
    area: "Областные центры",
    term: "1–2 рабочих дня",
    note: "Брест, Гомель, Гродно, Могилёв, Витебск",
  },
  {
    area: "Другие города Беларуси",
    term: "2–3 рабочих дня",
    note: "Согласуем маршрут и разгрузку",
  },
];

const PAYMENTS = [
  {
    Icon: Banknote,
    title: "Наличными",
    text: "При получении на складе или водителю при доставке. Выдаём чек и накладную.",
  },
  {
    Icon: CreditCard,
    title: "Картой",
    text: "Терминал на складе или платёж по ссылке — удобно для частных заказов.",
  },
  {
    Icon: FileText,
    title: "По счёту с НДС",
    text: "Для организаций и ИП: выставляем счёт, отгружаем после поступления оплаты. ТТН и ЭСЧФ.",
  },
];

const FAQ = [
  {
    question: "Есть ли минимальная сумма заказа?",
    answer:
      "Со склада отгружаем от одной позиции — минимальной суммы нет. Для бесплатной доставки по Минску объём заказа должен быть от 1,5 тонны, в остальных случаях считаем доставку отдельно.",
  },
  {
    question: "Как считается стоимость доставки?",
    answer:
      "По весу, габаритам и расстоянию. Длинномер (хлысты 11,7 м) требует отдельной машины, поэтому такие рейсы согласуем индивидуально. Точную сумму менеджер сообщает при подтверждении заказа.",
  },
  {
    question: "Можно порезать металл в размер?",
    answer:
      "Да. Режем хлысты в размер на ленточной пиле, раскраиваем лист на гильотине, лазере и плазме. Резка до 4 резов на позицию входит в стоимость, дальше — по тарифу.",
  },
  {
    question: "Какие документы выдаёте?",
    answer:
      "Товарно-транспортную накладную, счёт-фактуру и сертификат качества завода-изготовителя на каждую партию. Для организаций дополнительно оформляем ЭСЧФ.",
  },
  {
    question: "Что если позиции не хватит на складе?",
    answer:
      "Менеджер сразу предложит аналог по ГОСТ или поставку под заказ — обычно 3–7 рабочих дней. Заказ можно разбить на две отгрузки, чтобы не задерживать объект.",
  },
];

function DeliveryPage() {
  return (
    <Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        })}
      />

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <Breadcrumbs items={[{ label: "Доставка и оплата", kind: "current" }]} />

        <h1 className="mt-6 font-display text-3xl font-semibold uppercase sm:text-4xl lg:text-5xl">
          Доставка и оплата
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Возим металл своим транспортом от 1 до 20 тонн — от одной позиции до полной машины.
          Забрать заказ можно и самостоятельно: склад работает по будням и в субботу.
        </p>

        {/* Способы получения */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-border p-6">
            <MapPin className="h-6 w-6 text-lime-deep" />
            <h2 className="mt-4 font-display text-xl font-semibold uppercase">Самовывоз</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {ADDRESS_PRODUCTION}. {ACCESS_NOTE}. {WORK_HOURS}. Погрузку выполняем манипулятором
              или вручную — предупредите заранее, чтобы машина не ждала.
            </p>
            <p className="mt-4 font-display text-sm font-semibold uppercase text-lime-deep">
              Бесплатно
            </p>
          </section>

          <section className="rounded-2xl border border-border p-6">
            <Truck className="h-6 w-6 text-lime-deep" />
            <h2 className="mt-4 font-display text-xl font-semibold uppercase">
              Доставка нашим транспортом
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Парк от бортовых машин до фур 20 тонн, есть манипулятор для разгрузки на объекте.
              Длинномерный прокат 11,7 м возим отдельным рейсом.
            </p>
            <p className="mt-4 font-display text-sm font-semibold uppercase text-lime-deep">
              По Минску от 1,5 т — бесплатно
            </p>
          </section>
        </div>

        {/* Сроки */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold uppercase sm:text-3xl">
            Сроки по регионам
          </h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead className="bg-secondary/60">
                <tr>
                  <th className="px-4 py-3 text-left font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Направление
                  </th>
                  <th className="px-4 py-3 text-left font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Срок
                  </th>
                  <th className="px-4 py-3 text-left font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Примечание
                  </th>
                </tr>
              </thead>
              <tbody>
                {ZONES.map((zone) => (
                  <tr key={zone.area} className="border-t border-border">
                    <td className="px-4 py-3.5 font-medium">{zone.area}</td>
                    <td className="px-4 py-3.5 text-lime-deep">{zone.term}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{zone.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Оплата */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold uppercase sm:text-3xl">Оплата</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {PAYMENTS.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-border p-6">
                <Icon className="h-5 w-5 text-lime-deep" />
                <h3 className="mt-3.5 font-display text-base font-semibold uppercase">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Резка */}
        <section className="mt-14 rounded-3xl bg-graphite p-8 text-background sm:p-12">
          <Scissors className="h-7 w-7 text-brand" />
          <h2 className="mt-5 font-display text-2xl font-semibold uppercase sm:text-3xl">
            Резка и обработка перед отгрузкой
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-background/70 sm:text-base">
            Порежем прокат под длину проекта, раскроим лист по вашему чертежу, согнём и сварим узел.
            Обработка выполняется на нашем производстве в Борисове, поэтому не нужно искать
            отдельного подрядчика и второй раз платить за логистику.
          </p>
          <a
            href={`${MAIN_SITE_URL}/#production`}
            className="mt-7 inline-flex rounded-full bg-brand px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.12em] text-brand-foreground"
          >
            Возможности производства
          </a>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold uppercase sm:text-3xl">
            Частые вопросы
          </h2>
          <dl className="mt-6 divide-y divide-border rounded-2xl border border-border">
            {FAQ.map((item) => (
              <div key={item.question} className="px-6 py-5">
                <dt className="font-display text-base font-semibold uppercase">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Link
            to="/catalog"
            className="rounded-full bg-brand px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.12em] text-brand-foreground"
          >
            Перейти в каталог
          </Link>
          <a
            href={PHONE_HREF}
            className="rounded-full border border-border px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.12em] transition-colors hover:border-lime-deep hover:text-lime-deep"
          >
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </Shell>
  );
}
