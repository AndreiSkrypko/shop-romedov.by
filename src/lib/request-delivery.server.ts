import { loadApiLeadConfig } from "./api-config.server";
import { deliverLeadText, mailerFromApiConfig } from "./mailer.server";
import { buildRequestText, validateRequest } from "./request";
import type { RequestPayload } from "./request";

export async function deliverRequest(payload: RequestPayload) {
  const error = validateRequest(payload);
  if (error) throw new Error(error);

  const mailer = mailerFromApiConfig(loadApiLeadConfig());
  const text = buildRequestText(payload);

  await deliverLeadText(mailer, {
    subject: `Заявка с сайта: ${payload.name.trim()}`,
    text,
  });

  return { ok: true as const };
}
