import { createFileRoute } from "@tanstack/react-router";

import { ConversionThankYou } from "@/components/shop/ConversionThankYou";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/zayavka-prinyata")({
  head: () =>
    buildSeo({
      title: "Заявка принята — Ромедов Металл",
      description: "Спасибо за заявку. Менеджер свяжется с вами в ближайшее рабочее время.",
      path: "/zayavka-prinyata",
    }),
  component: RequestThankYouPage,
});

function RequestThankYouPage() {
  return (
    <ConversionThankYou
      conversionId="request"
      title="Заявка принята"
      breadcrumbs={[{ label: "Заявка принята", kind: "current" }]}
    >
      <p>
        Менеджер свяжется с вами в течение 30 минут в рабочее время: уточнит наличие, сортамент и
        сроки. Итоговую стоимость подтвердим после расчёта по вашему объёму.
      </p>
    </ConversionThankYou>
  );
}
