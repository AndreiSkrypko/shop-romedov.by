export type CustomerType = "person" | "company";
export type DeliveryMethod = "pickup" | "delivery";

export type OrderItem = {
  name: string;
  size: string;
  quantity: number;
  unit: string;
  weightKg: number;
  unitPrice: number;
  total: number;
};

export type OrderPayload = {
  name: string;
  phone: string;
  email: string;
  company: string;
  unp: string;
  customerType: CustomerType;
  delivery: DeliveryMethod;
  address: string;
  comment: string;
  items: OrderItem[];
  totalPrice: number;
  totalWeightKg: number;
};

export const DELIVERY_LABELS: Record<DeliveryMethod, string> = {
  pickup: "Самовывоз со склада (Борисов)",
  delivery: "Доставка нашим транспортом",
};

export const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  person: "Физическое лицо",
  company: "Организация / ИП",
};

/** Возвращает текст ошибки или null, если заказ можно отправлять. */
export function validateOrder(payload: OrderPayload): string | null {
  if (payload.items.length === 0) return "Корзина пуста";
  if (payload.name.trim().length < 2) return "Укажите имя (минимум 2 символа)";

  const digits = payload.phone.replace(/\D/g, "");
  if (digits.length < 9) return "Укажите корректный номер телефона";

  if (payload.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email.trim())) {
    return "Проверьте адрес электронной почты";
  }

  if (payload.customerType === "company" && payload.company.trim().length < 2) {
    return "Укажите название организации";
  }

  if (payload.delivery === "delivery" && payload.address.trim().length < 5) {
    return "Укажите адрес доставки";
  }

  return null;
}

function money(value: number): string {
  return `${value.toFixed(2)} р.`;
}

function quantity(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function buildOrderText(payload: OrderPayload, orderNumber: string): string {
  const lines = [
    `Новый заказ №${orderNumber} — shop.romedov.by`,
    "",
    `Покупатель: ${payload.name.trim()}`,
    `Телефон: ${payload.phone.trim()}`,
  ];

  if (payload.email.trim()) lines.push(`E-mail: ${payload.email.trim()}`);
  lines.push(`Тип: ${CUSTOMER_TYPE_LABELS[payload.customerType]}`);
  if (payload.company.trim()) lines.push(`Организация: ${payload.company.trim()}`);
  if (payload.unp.trim()) lines.push(`УНП: ${payload.unp.trim()}`);

  lines.push(`Получение: ${DELIVERY_LABELS[payload.delivery]}`);
  if (payload.address.trim()) lines.push(`Адрес: ${payload.address.trim()}`);

  lines.push("", "Состав заказа:");
  payload.items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.name} — ${quantity(item.quantity)} ${item.unit} · ` +
        `${item.weightKg.toFixed(1)} кг · ${money(item.total)}`,
    );
  });

  lines.push(
    "",
    `Итого: ${money(payload.totalPrice)}`,
    `Общий вес: ${(payload.totalWeightKg / 1000).toFixed(3)} т`,
  );

  if (payload.comment.trim()) {
    lines.push("", "Комментарий:", payload.comment.trim());
  }

  return lines.join("\n");
}

export function orderToFormData(payload: OrderPayload): FormData {
  const formData = new FormData();
  formData.append("kind", "order");
  formData.append("name", payload.name);
  formData.append("phone", payload.phone);
  formData.append("email", payload.email);
  formData.append("company", payload.company);
  formData.append("unp", payload.unp);
  formData.append("customerType", payload.customerType);
  formData.append("delivery", payload.delivery);
  formData.append("address", payload.address);
  formData.append("comment", payload.comment);
  formData.append("items", JSON.stringify(payload.items));
  formData.append("totalPrice", String(payload.totalPrice));
  formData.append("totalWeightKg", String(payload.totalWeightKg));
  return formData;
}

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function readNumber(formData: FormData, key: string): number {
  const parsed = Number(readString(formData, key));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseItems(raw: string): OrderItem[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((entry): OrderItem[] => {
      if (typeof entry !== "object" || entry === null) return [];
      const item = entry as Record<string, unknown>;
      if (typeof item["name"] !== "string" || typeof item["quantity"] !== "number") return [];

      return [
        {
          name: item["name"],
          size: typeof item["size"] === "string" ? item["size"] : "",
          quantity: item["quantity"],
          unit: typeof item["unit"] === "string" ? item["unit"] : "шт",
          weightKg: typeof item["weightKg"] === "number" ? item["weightKg"] : 0,
          unitPrice: typeof item["unitPrice"] === "number" ? item["unitPrice"] : 0,
          total: typeof item["total"] === "number" ? item["total"] : 0,
        },
      ];
    });
  } catch {
    return [];
  }
}

export function parseOrderFormData(formData: FormData): OrderPayload {
  const customerType = readString(formData, "customerType") === "company" ? "company" : "person";
  const delivery = readString(formData, "delivery") === "delivery" ? "delivery" : "pickup";

  return {
    name: readString(formData, "name"),
    phone: readString(formData, "phone"),
    email: readString(formData, "email"),
    company: readString(formData, "company"),
    unp: readString(formData, "unp"),
    customerType,
    delivery,
    address: readString(formData, "address"),
    comment: readString(formData, "comment"),
    items: parseItems(readString(formData, "items")),
    totalPrice: readNumber(formData, "totalPrice"),
    totalWeightKg: readNumber(formData, "totalWeightKg"),
  };
}

/** Короткий номер заказа для письма и подтверждения покупателю. */
export function makeOrderNumber(date = new Date()): string {
  const stamp = [
    String(date.getFullYear()).slice(2),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const tail =
    String(date.getHours()).padStart(2, "0") + String(date.getMinutes()).padStart(2, "0");
  return `${stamp}-${tail}`;
}
