import { createFileRoute } from "@tanstack/react-router";

import { ConversionThankYou } from "@/components/shop/ConversionThankYou";
import { buildSeo } from "@/lib/seo";

type OrderThankYouSearch = {
  order?: string;
};

export const Route = createFileRoute("/zakaz-prinyat")({
  validateSearch: (search: Record<string, unknown>): OrderThankYouSearch => ({
    order: typeof search.order === "string" && search.order.length > 0 ? search.order : undefined,
  }),
  head: () =>
    buildSeo({
      title: "Заказ принят — Ромедов Металл",
      description: "Спасибо за заказ металлопроката. Менеджер подтвердит состав и сроки отгрузки.",
      path: "/zakaz-prinyat",
    }),
  component: OrderThankYouPage,
});

function OrderThankYouPage() {
  const { order } = Route.useSearch();

  return (
    <ConversionThankYou
      conversionId="order"
      title="Заказ принят"
      breadcrumbs={[{ label: "Заказ принят", kind: "current" }]}
    >
      {order ? (
        <p className="font-display text-lg text-foreground">
          Номер заказа <span className="text-lime-deep">№{order}</span>
        </p>
      ) : null}
      <p className={order ? "mt-4" : undefined}>
        Менеджер свяжется с вами в течение 30 минут в рабочее время: подтвердит наличие
        сортамента, итоговую сумму и сроки отгрузки.
      </p>
    </ConversionThankYou>
  );
}
