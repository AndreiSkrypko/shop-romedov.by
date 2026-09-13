import { orderToFormData } from "./order";
import type { OrderPayload } from "./order";
import { submitOrder } from "./submit-order.functions";

type SendResult = { ok: true; orderNumber: string } | { ok: false; error: string };

export async function sendOrder(payload: OrderPayload): Promise<SendResult> {
  const formData = orderToFormData(payload);

  try {
    if (import.meta.env.DEV) {
      const result = await submitOrder({ data: formData });
      return { ok: true, orderNumber: result.orderNumber };
    }

    const response = await fetch("/api/submit.php", { method: "POST", body: formData });
    const raw: unknown = await response.json().catch(() => null);
    const payloadJson = (raw ?? {}) as { ok?: boolean; error?: string; orderNumber?: string };

    if (!response.ok || !payloadJson.ok) {
      return { ok: false, error: payloadJson.error ?? "Не удалось отправить заказ" };
    }

    return { ok: true, orderNumber: payloadJson.orderNumber ?? "" };
  } catch {
    return { ok: false, error: "Не удалось отправить заказ. Попробуйте позже или позвоните нам." };
  }
}
