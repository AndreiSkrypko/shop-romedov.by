type SubmitOk = { ok: true; orderNumber?: string };
type SubmitFail = { ok: false; error: string };

export async function postSubmitForm(formData: FormData): Promise<SubmitOk | SubmitFail> {
  try {
    const response = await fetch("/api/submit.php", { method: "POST", body: formData });
    const raw: unknown = await response.json().catch(() => null);
    const body = (raw ?? {}) as { ok?: boolean; error?: string; orderNumber?: string };

    if (!response.ok || !body.ok) {
      return { ok: false, error: body.error ?? "Не удалось отправить. Попробуйте позже или позвоните нам." };
    }

    return { ok: true, orderNumber: body.orderNumber };
  } catch {
    return {
      ok: false,
      error: "Не удалось отправить. Попробуйте позже или позвоните нам.",
    };
  }
}
