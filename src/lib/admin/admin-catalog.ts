import { buildAdminCatalogSnapshot } from "./catalog-snapshot";
import {
  deleteAdminCategory,
  insertAdminCategory,
  updateAdminCategory,
} from "./admin-categories";
import { deleteAdminProduct, insertAdminProduct, updateAdminProduct } from "./admin-products";
import { parseAdminCategoryFormWithImage } from "./category-form";
import { parseAdminProductFormWithImage } from "./product-form";
import { assertAdminSession } from "./session";
import { parseAdminSubcategoryFormWithImage } from "./subcategory-form";
import {
  deleteAdminSubcategory,
  insertAdminSubcategory,
  updateAdminSubcategory,
} from "./admin-subcategories";

export async function adminGetCatalogSnapshot() {
  assertAdminSession();
  return buildAdminCatalogSnapshot();
}

export async function adminCreateCategory(formData: FormData) {
  assertAdminSession();
  const payload = await parseAdminCategoryFormWithImage(formData, "create");
  const id = await insertAdminCategory(payload);
  return { ok: true as const, id };
}

export async function adminUpdateCategory(formData: FormData) {
  assertAdminSession();
  const payload = await parseAdminCategoryFormWithImage(formData, "edit");
  await updateAdminCategory(payload);
  return { ok: true as const };
}

export async function adminDeleteCategory(id: string) {
  assertAdminSession();
  if (!id.trim()) throw new Error("Укажите id категории");
  await deleteAdminCategory(id.trim());
  return { ok: true as const };
}

export async function adminCreateProduct(formData: FormData) {
  assertAdminSession();
  const payload = await parseAdminProductFormWithImage(formData);
  const newId = await insertAdminProduct(payload);
  return { ok: true as const, id: newId };
}

export async function adminUpdateProduct(formData: FormData) {
  assertAdminSession();
  const payload = await parseAdminProductFormWithImage(formData);
  await updateAdminProduct(payload);
  return { ok: true as const };
}

export async function adminDeleteProduct(slug: string) {
  assertAdminSession();
  if (!slug.trim()) throw new Error("Укажите slug товара");
  await deleteAdminProduct(slug.trim());
  return { ok: true as const };
}

export async function adminCreateSubcategory(formData: FormData) {
  assertAdminSession();
  const payload = await parseAdminSubcategoryFormWithImage(formData, "create");
  const id = await insertAdminSubcategory(payload);
  return { ok: true as const, id };
}

export async function adminUpdateSubcategory(formData: FormData) {
  assertAdminSession();
  const payload = await parseAdminSubcategoryFormWithImage(formData, "edit");
  await updateAdminSubcategory(payload);
  return { ok: true as const };
}

export async function adminDeleteSubcategory(id: string) {
  assertAdminSession();
  if (!id.trim()) throw new Error("Укажите id подкатегории");
  await deleteAdminSubcategory(id.trim());
  return { ok: true as const };
}
