import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { Shell } from "@/components/shop/Shell";
import { useCart } from "@/lib/cart-context";
import { formatPrice, formatQuantity, formatWeight, saleUnitLabel, unitPrice } from "@/lib/catalog";
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF } from "@/lib/contacts";
import { CUSTOMER_TYPE_LABELS, DELIVERY_LABELS, validateOrder } from "@/lib/order";
import type { CustomerType, DeliveryMethod, OrderPayload } from "@/lib/order";
import { sendOrder } from "@/lib/send-order";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/checkout")({
  head: () =>
    buildSeo({
      title: "Оформление заказа — Ромедов Металл",
      description:
        "Оформите заказ металлопроката: самовывоз со склада в Борисове или доставка нашим транспортом по Беларуси. Счёт для организаций.",
      path: "/checkout",
    }),
  component: CheckoutPage,
});

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-lime-deep";
const labelClass =
  "font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";

function CheckoutPage() {
  const { ready, entries, positions, totalPrice, totalWeightKg, clear } = useCart();

  const [customerType, setCustomerType] = useState<CustomerType>("person");
  const [delivery, setDelivery] = useState<DeliveryMethod>("pickup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [unp, setUnp] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const payload: OrderPayload = {
      name,
      phone,
      email,
      company,
      unp,
      customerType,
      delivery,
      address,
      comment,
      totalPrice,
      totalWeightKg,
      items: entries.map((entry) => ({
        name: entry.product.name,
        size: entry.product.size,
        quantity: entry.quantity,
        unit: saleUnitLabel(entry.product.saleUnit),
        weightKg: entry.weightKg,
        unitPrice: unitPrice(entry.product),
        total: entry.total,
      })),
    };

    const validationError = validateOrder(payload);
    if (validationError) {
      setError(validationError);
      return;
    }

    setStatus("sending");
    const result = await sendOrder(payload);

    if (!result.ok) {
      setStatus("idle");
      setError(result.error);
      return;
    }

    setOrderNumber(result.orderNumber);
    setStatus("done");
    clear();
  };

  if (status === "done") {
    return (
      <Shell>
        <div className="mx-auto max-w-2xl px-5 py-16 text-center lg:py-24">
          <CheckCircle2 className="mx-auto h-14 w-14 text-lime-deep" />
          <h1 className="mt-6 font-display text-3xl font-semibold uppercase">Заказ принят</h1>
          {orderNumber ? (
            <p className="mt-3 font-display text-lg">
              Номер заказа <span className="text-lime-deep">№{orderNumber}</span>
            </p>
          ) : null}
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Менеджер свяжется с вами в течение 30 минут в рабочее время: подтвердит наличие
            сортамента, итоговую сумму и сроки отгрузки. Если нужно срочно — звоните{" "}
            <a href={PHONE_HREF} className="font-semibold text-lime-deep">
              {PHONE_DISPLAY}
            </a>
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/catalog"
              className="rounded-full bg-brand px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.12em] text-brand-foreground"
            >
              Вернуться в каталог
            </Link>
            <a
              href={EMAIL_HREF}
              className="rounded-full border border-border px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.12em]"
            >
              {EMAIL}
            </a>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <Breadcrumbs items={[{ label: "Оформление заказа", kind: "current" }]} />

        <h1 className="mt-6 font-display text-3xl font-semibold uppercase sm:text-4xl">
          Оформление заказа
        </h1>

        {ready && positions === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border p-10 text-center">
            <p className="font-display text-xl font-semibold uppercase">Корзина пуста</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Добавьте позиции из каталога, чтобы оформить заказ.
            </p>
            <Link
              to="/catalog"
              className="mt-6 inline-flex rounded-full bg-brand px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.12em] text-brand-foreground"
            >
              В каталог
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start"
          >
            <div className="space-y-8">
              {/* Кто покупает */}
              <fieldset className="rounded-2xl border border-border p-5 sm:p-6">
                <legend className="px-2 font-display text-sm font-semibold uppercase">
                  Кто покупает
                </legend>

                <div className="mt-2 flex flex-wrap gap-2">
                  {(Object.keys(CUSTOMER_TYPE_LABELS) as CustomerType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCustomerType(type)}
                      aria-pressed={customerType === type}
                      className={`rounded-full border px-5 py-2.5 text-xs font-medium transition-colors ${
                        customerType === type
                          ? "border-lime-deep bg-lime/15 text-lime-deep"
                          : "border-border text-muted-foreground hover:border-lime-deep"
                      }`}
                    >
                      {CUSTOMER_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelClass}>Имя и фамилия*</span>
                    <input
                      className={`${fieldClass} mt-2`}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Иван Петров"
                      autoComplete="name"
                    />
                  </label>

                  <label className="block">
                    <span className={labelClass}>Телефон*</span>
                    <input
                      className={`${fieldClass} mt-2`}
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="+375 __ ___-__-__"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </label>

                  <label className="block">
                    <span className={labelClass}>E-mail</span>
                    <input
                      className={`${fieldClass} mt-2`}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Для счёта и накладной"
                      inputMode="email"
                      autoComplete="email"
                    />
                  </label>

                  {customerType === "company" ? (
                    <>
                      <label className="block">
                        <span className={labelClass}>Организация*</span>
                        <input
                          className={`${fieldClass} mt-2`}
                          value={company}
                          onChange={(event) => setCompany(event.target.value)}
                          placeholder="ООО «Пример»"
                          autoComplete="organization"
                        />
                      </label>

                      <label className="block">
                        <span className={labelClass}>УНП</span>
                        <input
                          className={`${fieldClass} mt-2`}
                          value={unp}
                          onChange={(event) => setUnp(event.target.value)}
                          placeholder="9 цифр"
                          inputMode="numeric"
                        />
                      </label>
                    </>
                  ) : null}
                </div>
              </fieldset>

              {/* Получение */}
              <fieldset className="rounded-2xl border border-border p-5 sm:p-6">
                <legend className="px-2 font-display text-sm font-semibold uppercase">
                  Как получить
                </legend>

                <div className="mt-2 flex flex-wrap gap-2">
                  {(Object.keys(DELIVERY_LABELS) as DeliveryMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setDelivery(method)}
                      aria-pressed={delivery === method}
                      className={`rounded-full border px-5 py-2.5 text-xs font-medium transition-colors ${
                        delivery === method
                          ? "border-lime-deep bg-lime/15 text-lime-deep"
                          : "border-border text-muted-foreground hover:border-lime-deep"
                      }`}
                    >
                      {DELIVERY_LABELS[method]}
                    </button>
                  ))}
                </div>

                {delivery === "delivery" ? (
                  <label className="mt-5 block">
                    <span className={labelClass}>Адрес доставки*</span>
                    <input
                      className={`${fieldClass} mt-2`}
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="Город, улица, дом, ориентир для разгрузки"
                    />
                  </label>
                ) : (
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Склад: г. Борисов, ул. Нормандия-Неман, 167В. Проезд на территорию с ул. Яроша.
                    Погрузка манипулятором или вручную — уточните при подтверждении заказа.
                  </p>
                )}

                <label className="mt-5 block">
                  <span className={labelClass}>Комментарий</span>
                  <textarea
                    className={`${fieldClass} mt-2 min-h-24 resize-y`}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Резка в размер, желаемая дата отгрузки, особенности объекта"
                  />
                </label>
              </fieldset>

              {error ? (
                <p className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
            </div>

            {/* Сводка */}
            <aside className="sticky top-28 rounded-2xl border border-border bg-secondary/40 p-6">
              <h2 className="font-display text-base font-semibold uppercase">Ваш заказ</h2>

              <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                {entries.map((entry) => (
                  <li key={entry.product.slug} className="text-xs leading-relaxed">
                    <p className="font-medium">{entry.product.name}</p>
                    <p className="mt-0.5 text-muted-foreground">
                      {formatQuantity(entry.quantity)} {saleUnitLabel(entry.product.saleUnit)} ·{" "}
                      {formatWeight(entry.weightKg)} ·{" "}
                      <span className="font-semibold text-foreground">
                        {formatPrice(entry.total)}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Позиций</dt>
                  <dd className="font-medium">{positions}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Общий вес</dt>
                  <dd className="font-medium">{formatWeight(totalWeightKg)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-border pt-3">
                  <dt className="font-display text-xs uppercase tracking-[0.12em]">К оплате</dt>
                  <dd className="font-display text-2xl font-semibold">{formatPrice(totalPrice)}</dd>
                </div>
              </dl>

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-brand font-display text-sm font-semibold uppercase tracking-[0.12em] text-brand-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Отправляем…
                  </>
                ) : (
                  "Подтвердить заказ"
                )}
              </button>

              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных. Оплата — после
                согласования заказа с менеджером: наличными, картой или по счёту.
              </p>
            </aside>
          </form>
        )}
      </div>
    </Shell>
  );
}
