import { requestToFormData } from "./request";
import type { RequestPayload } from "./request";
import { submitRequest } from "./submit-request.functions";

type SendResult = { ok: true } | { ok: false; error: string };

export async function sendRequest(payload: RequestPayload): Promise<SendResult> {
  const formData = requestToFormData(payload);

  try {
    if (import.meta.env.DEV) {
      await submitRequest({ data: formData });
      return { ok: true };
    }

    const response = await fetch("/api/submit.php", { method: "POST", body: formData });
    const raw: unknown = await response.json().catch(() => null);
    const payloadJson = (raw ?? {}) as { ok?: boolean; error?: string };

    if (!response.ok || !payloadJson.ok) {
      return { ok: false, error: payloadJson.error ?? "Не удалось отправить заявку" };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Не удалось отправить заявку. Попробуйте позже или позвоните нам." };
  }
}
