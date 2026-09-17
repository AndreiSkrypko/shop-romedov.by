import { z } from "zod";

function emptyToUndefined(value: unknown): unknown {
  if (value === "" || value === undefined) return undefined;
  return value;
}

export const adminCategorySchema = z.object({
  id: z
    .string()
    .trim()
    .min(2, "Укажите id категории")
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id: латиница, цифры и дефисы"),
  slug: z
    .string()
    .trim()
    .min(2, "Укажите slug URL")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: только a-z, цифры и дефисы"),
  name: z.string().trim().min(2).max(120),
  menuName: z.string().trim().min(2).max(80),
  tagline: z.string().trim().max(160).default(""),
  description: z.string().trim().max(2000).default(""),
  image: z.string().trim().max(200).default("/products/supplies.webp"),
  sortOrder: z.coerce.number().int().min(0).max(999).default(100),
  dimensionLabel: z.string().trim().max(40).default("Размер"),
  seoTitle: z.preprocess(emptyToUndefined, z.string().trim().max(160).optional()),
  seoDescription: z.preprocess(emptyToUndefined, z.string().trim().max(300).optional()),
  isPublished: z.preprocess((v) => v !== false && v !== "false", z.boolean()).default(true),
});

export type AdminCategoryInput = z.infer<typeof adminCategorySchema>;

export function parseAdminCategoryForm(data: FormData, _mode: "create" | "edit"): AdminCategoryInput {
  const raw = Object.fromEntries(data.entries());
  const parsed = adminCategorySchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    throw new Error(first?.message ?? "Проверьте поля категории");
  }

  return parsed.data;
}
