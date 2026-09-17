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
  dimension: z.coerce.number().min(0),
  steel: z.string().trim().max(120).default(""),
  gost: z.string().trim().max(160).default(""),
  lengthM: z.preprocess(emptyToNull, z.coerce.number().positive().nullable()),
  saleUnit: z.enum(saleUnits),
  weightKg: z.coerce.number().positive("Укажите вес единицы, кг"),
  pricePerTon: z.preprocess(emptyToNull, z.coerce.number().positive().nullable()),
  pricePerUnit: z.preprocess(emptyToNull, z.coerce.number().positive().nullable()),
  pricePerMeter: z.preprocess(emptyToNull, z.coerce.number().positive().nullable()),
  metersPerSaleUnit: z.preprocess(emptyToNull, z.coerce.number().positive().nullable()),
  stock: z.enum(stockStates).default("in"),
  popular: z.preprocess(
    (v) => v === true || v === "true" || v === "on",
    z.boolean().default(false),
  ),
  article: z.preprocess(emptyToUndefined, z.string().trim().max(40).optional()),
  cardTitle: z.preprocess(emptyToUndefined, z.string().trim().max(200).optional()),
  image: z.preprocess(emptyToUndefined, z.string().trim().max(200).optional()),
  isPublished: z.preprocess((v) => v !== false && v !== "false", z.boolean()).default(true),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;

export function parseAdminProductForm(data: FormData): AdminProductInput {
  const raw = Object.fromEntries(data.entries());
  const parsed = adminProductSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    throw new Error(first?.message ?? "Проверьте поля формы");
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
