import { deliverOrder } from "./order-delivery.server";
import { parseOrderFormData, validateOrder } from "./order";
import { deliverRequest } from "./request-delivery.server";
import { parseRequestFormData, validateRequest } from "./request";

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

/** Тот же контракт, что public/api/submit.php — для npm run dev. */
export async function handleSubmitLeadPost(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: "Неверный запрос" }, 400);
  }

  const kind = formData.get("kind") === "request" ? "request" : "order";

  try {
    if (kind === "request") {
      const payload = parseRequestFormData(formData);
      const validationError = validateRequest(payload);
      if (validationError) {
        return json({ ok: false, error: validationError }, 400);
      }
      await deliverRequest(payload);
      return json({ ok: true, orderNumber: "" });
    }

    const orderPayload = parseOrderFormData(formData);
    const orderValidationError = validateOrder(orderPayload);
    if (orderValidationError) {
      return json({ ok: false, error: orderValidationError }, 400);
    }

    const result = await deliverOrder(orderPayload);
    return json({ ok: true, orderNumber: result.orderNumber });
  } catch (error) {
    const message =
      error instanceof Error && error.message.trim()
        ? error.message
        : "Не удалось отправить. Попробуйте позже или позвоните нам.";
    console.error("[submit-lead]", error);
    return json({ ok: false, error: message }, 502);
  }
}
