import type { AdminCategoryInput } from "./category-input";
import { parseAdminCategoryForm } from "./category-input";
import { readImageFileFromForm, uploadCategoryImage } from "./image-upload.server";

export async function parseAdminCategoryFormWithImage(
  formData: FormData,
  mode: "create" | "edit",
): Promise<AdminCategoryInput> {
  const input = parseAdminCategoryForm(formData, mode);
  const file = readImageFileFromForm(formData);

  if (!file) return input;

  const publicUrl = await uploadCategoryImage(file, input.slug);
  return { ...input, image: publicUrl };
}
