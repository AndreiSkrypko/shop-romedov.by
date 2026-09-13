import { getMailerConfig, sendMail, sendTelegramMessage } from "./mailer.server";
import { buildRequestText, validateRequest } from "./request";
import type { RequestPayload } from "./request";

export async function deliverRequest(payload: RequestPayload) {
  const error = validateRequest(payload);
  if (error) throw new Error(error);

  const config = getMailerConfig();
  const text = buildRequestText(payload);

  await sendMail(config, {
    subject: `Заявка с сайта: ${payload.name.trim()}`,
    text,
  });

  await sendTelegramMessage(config, text);

  return { ok: true as const };
}
