import type { AdminProductInput } from "./product-input";
import { parseAdminProductForm } from "./product-input";
import { readImageFileFromForm, uploadProductImage } from "./image-upload.server";

/** Парсит форму товара и при необходимости загружает фото в Storage. */
export async function parseAdminProductFormWithImage(formData: FormData): Promise<AdminProductInput> {
  const input = parseAdminProductForm(formData);
  const file = readImageFileFromForm(formData);

  if (!file) return input;

  const publicUrl = await uploadProductImage(file, input.slug);
  return { ...input, image: publicUrl };
}
