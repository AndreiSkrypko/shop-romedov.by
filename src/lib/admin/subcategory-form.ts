import type { AdminSubcategoryInput } from "./subcategory-input";
import { parseAdminSubcategoryForm } from "./subcategory-input";
import { readImageFileFromForm, uploadSubcategoryImage } from "./image-upload";

export async function parseAdminSubcategoryFormWithImage(
  formData: FormData,
  mode: "create" | "edit",
): Promise<AdminSubcategoryInput> {
  const input = parseAdminSubcategoryForm(formData, mode);
  const file = readImageFileFromForm(formData);

  if (!file) return input;

  const publicUrl = await uploadSubcategoryImage(file, input.slug);
  return { ...input, image: publicUrl };
}
