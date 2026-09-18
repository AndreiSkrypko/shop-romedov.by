import { postSubmitForm } from "./submit-lead-client";
import { requestToFormData } from "./request";
import type { RequestPayload } from "./request";

type SendResult = { ok: true } | { ok: false; error: string };

export async function sendRequest(payload: RequestPayload): Promise<SendResult> {
  const result = await postSubmitForm(requestToFormData(payload));
  if (!result.ok) return result;
  return { ok: true };
}
