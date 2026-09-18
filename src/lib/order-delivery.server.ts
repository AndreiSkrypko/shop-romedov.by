import { loadApiLeadConfig } from "./api-config.server";
import { deliverLeadText, mailerFromApiConfig } from "./mailer.server";
import { buildOrderText, makeOrderNumber, validateOrder } from "./order";
import type { OrderPayload } from "./order";

export async function deliverOrder(payload: OrderPayload) {
  const error = validateOrder(payload);
  if (error) throw new Error(error);

  const mailer = mailerFromApiConfig(loadApiLeadConfig());
  const orderNumber = makeOrderNumber();
  const text = buildOrderText(payload, orderNumber);

  await deliverLeadText(mailer, {
    subject: `Заказ №${orderNumber} — ${payload.name.trim()}`,
    text,
    ...(payload.email.trim() ? { replyTo: payload.email.trim() } : {}),
  });

  return { ok: true as const, orderNumber };
}
