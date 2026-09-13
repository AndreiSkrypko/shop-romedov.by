import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { RequestForm } from "@/components/shop/RequestForm";
import { Shell } from "@/components/shop/Shell";
import { MailIcon, TelegramIcon, ViberIcon } from "@/components/shop/icons";
import {
  ACCESS_NOTE,
  ADDRESS_LEGAL,
  ADDRESS_PRODUCTION,
  EMAIL,
  EMAIL_HREF,
  PHONES,
  TELEGRAM_HREF,
  UNP,
  VIBER_HREF,
  WORK_HOURS,
} from "@/lib/contacts";
import { ORGANIZATION_LD, buildSeo, jsonLd } from "@/lib/seo";
import { SITE_LEGAL_NAME } from "@/lib/site";

export const Route = createFileRoute("/contacts")({
  head: () =>
    buildSeo({
      title: "Контакты — металлопрокат Ромедов, Минск и Борисов",
      description:
        "Телефоны, почта и адрес склада металлопроката в Борисове. Работаем с организациями и частными лицами, отвечаем в течение 30 минут.",
      path: "/contacts",
      keywords: "ромедов контакты, металлопрокат борисов адрес, купить металл минск телефон",
    }),
  component: ContactsPage,
});

function ContactsPage() {
  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ORGANIZATION_LD)} />

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <Breadcrumbs items={[{ label: "Контакты", kind: "current" }]} />

        <h1 className="mt-6 font-display text-3xl font-semibold uppercase sm:text-4xl lg:text-5xl">
          Контакты
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Позвоните или напишите — подберём сортамент, посчитаем вес и стоимость по вашему объёму.
          Если нужной позиции нет на складе, предложим аналог или изготовим деталь на своём
          производстве.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Телефоны
              </h2>
              <div className="mt-4 space-y-2">
                {PHONES.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="block font-display text-2xl font-semibold transition-colors hover:text-lime-deep"
                  >
                    {phone.display}
                  </a>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{WORK_HOURS}</p>
            </section>

            <section>
              <h2 className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Мессенджеры и почта
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  { href: EMAIL_HREF, label: EMAIL, Icon: MailIcon },
                  { href: TELEGRAM_HREF, label: "Telegram", Icon: TelegramIcon },
                  { href: VIBER_HREF, label: "Viber", Icon: ViberIcon },
                ].map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm transition-colors hover:border-lime-deep hover:text-lime-deep"
                  >
                    <Icon />
                    {label}
                  </a>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Склад и производство
              </h2>
              <p className="mt-4 text-base font-medium">{ADDRESS_PRODUCTION}</p>
              <p className="mt-1 text-sm text-muted-foreground">{ACCESS_NOTE}</p>
            </section>

            <section className="rounded-2xl border border-border bg-secondary/40 p-5">
              <h2 className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Реквизиты
              </h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Организация</dt>
                  <dd className="font-medium">{SITE_LEGAL_NAME}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">УНП</dt>
                  <dd className="font-medium">{UNP}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Юридический адрес</dt>
                  <dd className="font-medium leading-relaxed">{ADDRESS_LEGAL}</dd>
                </div>
              </dl>
            </section>
          </div>

          <div className="rounded-3xl border border-border p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold uppercase">
              Подобрать металлопрокат
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Опишите, что требуется — уточним наличие, сортамент и сроки поставки. Ответим на почту
              или позвоним, как вам удобнее.
            </p>

            <div className="mt-6">
              <RequestForm source="Страница контактов" />
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
