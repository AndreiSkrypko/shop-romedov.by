import { z } from "zod";

export const adminSubcategorySchema = z.object({
  id: z.string().trim().min(2, "Укажите id").max(80),
  categoryId: z.string().trim().min(1, "Укажите категорию"),
  slug: z
    .string()
    .trim()
    .min(2, "Укажите slug")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: a-z, цифры, дефисы"),
  name: z.string().trim().min(2, "Укажите название").max(200),
  image: z.string().trim().max(300).default(""),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(100),
  isPublished: z.preprocess((v) => v !== false && v !== "false", z.boolean()).default(true),
});

export type AdminSubcategoryInput = z.infer<typeof adminSubcategorySchema>;

export function parseAdminSubcategoryForm(data: FormData, mode: "create" | "edit"): AdminSubcategoryInput {
  const raw = Object.fromEntries(data.entries());
  const parsed = adminSubcategorySchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    throw new Error(first?.message ?? "Проверьте поля формы");
  }
  if (mode === "edit" && !parsed.data.id) {
    throw new Error("Не указан id подкатегории");
  }
  return parsed.data;
}
