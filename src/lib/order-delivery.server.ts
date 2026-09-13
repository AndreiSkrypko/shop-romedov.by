import { getMailerConfig, sendMail, sendTelegramMessage } from "./mailer.server";
import { buildOrderText, makeOrderNumber, validateOrder } from "./order";
import type { OrderPayload } from "./order";

export async function deliverOrder(payload: OrderPayload) {
  const error = validateOrder(payload);
  if (error) throw new Error(error);

  const config = getMailerConfig();
  const orderNumber = makeOrderNumber();
  const text = buildOrderText(payload, orderNumber);

  // Почта — обязательна: без неё заказ не считается принятым.
  await sendMail(config, {
    subject: `Заказ №${orderNumber} — ${payload.name.trim()}`,
    text,
    ...(payload.email.trim() ? { replyTo: payload.email.trim() } : {}),
  });

  await sendTelegramMessage(config, text);

  return { ok: true as const, orderNumber };
}
