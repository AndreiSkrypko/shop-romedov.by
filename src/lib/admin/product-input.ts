import { z } from "zod";

import type { SaleUnit, StockState } from "@/lib/catalog/types";

const saleUnits = ["м", "лист", "шт", "карта", "боб"] as [SaleUnit, ...SaleUnit[]];
const stockStates = ["in", "out", "order"] as [StockState, ...StockState[]];

function emptyToNull(value: unknown): unknown {
  if (value === "" || value === undefined) return null;
  return value;
}

function emptyToUndefined(value: unknown): unknown {
  if (value === "" || value === undefined) return undefined;
  return value;
}

/** «3,5» → «3.5» для z.coerce.number */
function normalizeDecimalInput(value: unknown): unknown {
  if (value === "" || value === undefined || value === null) return value;
  if (typeof value === "string") return value.trim().replace(",", ".");
  return value;
}

function requiredNumberField(label: string) {
  return z.preprocess(
    normalizeDecimalInput,
    z.coerce
      .number({
        invalid_type_error: `«${label}»: укажите число`,
        required_error: `«${label}»: обязательное поле`,
      })
      .refine((n) => Number.isFinite(n), `«${label}»: укажите число (можно 0,5 через запятую)`),
  );
}

function optionalPositiveNumberField(label: string) {
  return z.preprocess(
    (value) => {
      const normalized = normalizeDecimalInput(value);
      if (normalized === "" || normalized === undefined || normalized === null) return null;
      return normalized;
    },
    z
      .union([z.null(), z.coerce.number()])
      .refine(
        (n) => n === null || (Number.isFinite(n) && n > 0),
        `«${label}»: укажите положительное число`,
      ),
  );
}

const FIELD_LABELS: Record<string, string> = {
  dimension: "Размер (число)",
  weightKg: "Вес ед., кг",
  lengthM: "Длина, м",
  pricePerTon: "Цена/тонна",
  pricePerUnit: "Цена/ед.",
  pricePerMeter: "Цена/метр",
  metersPerSaleUnit: "Метров в единице",
  sortOrder: "Порядок на витрине",
};

function formatProductFormError(error: z.ZodIssue): string {
  const key = String(error.path[0] ?? "");
  const label = FIELD_LABELS[key] ?? key;
  if (
    error.code === "invalid_type" &&
    ("received" in error ? error.received : undefined) === "nan"
  ) {
    return `«${label}»: укажите число (можно с запятой: 0,5)`;
  }
  if (error.message && error.message !== "Required") return error.message;
  return `Проверьте поле «${label}»`;
}

export const adminProductSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Укажите slug (латиница, дефисы)")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: только a-z, цифры и дефисы"),
  categoryId: z.string().trim().min(1, "Выберите категорию"),
  subcategoryId: z.preprocess(emptyToUndefined, z.string().trim().max(80).optional()),
  name: z.string().trim().min(2, "Укажите название").max(300),
  size: z.string().trim().min(1, "Укажите типоразмер").max(80),
  dimension: requiredNumberField("Размер (число)").pipe(z.number().min(0, "«Размер (число)»: не может быть отрицательным")),
  steel: z.string().trim().max(120).default(""),
  gost: z.string().trim().max(160).default(""),
  lengthM: optionalPositiveNumberField("Длина, м"),
  saleUnit: z.enum(saleUnits),
  weightKg: requiredNumberField("Вес ед., кг").pipe(
    z.number().positive("«Вес ед., кг»: укажите массу больше 0"),
  ),
  pricePerTon: optionalPositiveNumberField("Цена/тонна"),
  pricePerUnit: optionalPositiveNumberField("Цена/ед."),
  pricePerMeter: optionalPositiveNumberField("Цена/метр"),
  metersPerSaleUnit: optionalPositiveNumberField("Метров в единице"),
  stock: z.enum(stockStates).default("in"),
  popular: z.preprocess(
    (v) => v === true || v === "true" || v === "on",
    z.boolean().default(false),
  ),
  article: z.preprocess(emptyToUndefined, z.string().trim().max(40).optional()),
  cardTitle: z.preprocess(emptyToUndefined, z.string().trim().max(200).optional()),
  image: z.preprocess(emptyToUndefined, z.string().trim().max(2048).optional()),
  sortOrder: z.preprocess(
    (value) => {
      if (value === "" || value === undefined || value === null) return 0;
      return normalizeDecimalInput(value);
    },
    z.coerce
      .number()
      .int()
      .min(0)
      .max(99999)
      .refine((n) => Number.isFinite(n), "«Порядок на витрине»: укажите целое число"),
  ),
  isPublished: z.preprocess((v) => v !== false && v !== "false", z.boolean()).default(true),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;

export function parseAdminProductForm(data: FormData): AdminProductInput {
  const raw = Object.fromEntries(data.entries());
  const parsed = adminProductSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    throw new Error(first ? formatProductFormError(first) : "Проверьте поля формы");
  }

  const product = parsed.data;
  const hasPrice =
    product.pricePerTon !== null ||
    product.pricePerUnit !== null ||
    product.pricePerMeter !== null;
  if (!hasPrice) {
    throw new Error("Укажите хотя бы одну цену: за тонну, за единицу или за метр");
  }

  return product;
}
