export type RequestPayload = {
  name: string;
  phone: string;
  company: string;
  message: string;
  /** Откуда пришла заявка — попадает в письмо, помогает менеджеру. */
  source: string;
};

export function validateRequest(payload: RequestPayload): string | null {
  if (payload.name.trim().length < 2) return "Укажите имя (минимум 2 символа)";

  const digits = payload.phone.replace(/\D/g, "");
  if (digits.length < 9) return "Укажите корректный номер телефона";

  return null;
}

export function buildRequestText(payload: RequestPayload): string {
  const lines = [
    "Новая заявка с shop.romedov.by",
    "",
    `Имя: ${payload.name.trim()}`,
    `Телефон: ${payload.phone.trim()}`,
  ];

  if (payload.company.trim()) lines.push(`Компания: ${payload.company.trim()}`);
  if (payload.source.trim()) lines.push(`Страница: ${payload.source.trim()}`);

  if (payload.message.trim()) {
    lines.push("", "Задача:", payload.message.trim());
  }

  return lines.join("\n");
}

export function requestToFormData(payload: RequestPayload): FormData {
  const formData = new FormData();
  formData.append("kind", "request");
  formData.append("name", payload.name);
  formData.append("phone", payload.phone);
  formData.append("company", payload.company);
  formData.append("message", payload.message);
  formData.append("source", payload.source);
  return formData;
}

export function parseRequestFormData(formData: FormData): RequestPayload {
  const read = (key: string): string => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  return {
    name: read("name"),
    phone: read("phone"),
    company: read("company"),
    message: read("message"),
    source: read("source"),
  };
}
