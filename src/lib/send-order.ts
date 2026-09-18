import { postSubmitForm } from "./submit-lead-client";
import { orderToFormData } from "./order";
import type { OrderPayload } from "./order";

type SendResult = { ok: true; orderNumber: string } | { ok: false; error: string };

export async function sendOrder(payload: OrderPayload): Promise<SendResult> {
  const result = await postSubmitForm(orderToFormData(payload));
  if (!result.ok) return result;
  return { ok: true, orderNumber: result.orderNumber ?? "" };
}
