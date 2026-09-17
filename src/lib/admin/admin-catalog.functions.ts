import { createServerFn } from "@tanstack/react-start";

import { parseAdminCategoryFormWithImage } from "./category-form.server";
import {
  deleteAdminCategory,
  insertAdminCategory,
  listAdminCategoriesFromDb,
  updateAdminCategory,
} from "./categories.server";
import { buildAdminCatalogSnapshot } from "./catalog-snapshot.server";
import { parseAdminProductFormWithImage } from "./product-form.server";
import {
  deleteAdminProduct,
  insertAdminProduct,
  listAdminProductsFromDb,
  updateAdminProduct,
} from "./products.server";
import { parseAdminSubcategoryFormWithImage } from "./subcategory-form.server";
import {
  deleteAdminSubcategory,
  insertAdminSubcategory,
  listAdminSubcategoriesFromDb,
  updateAdminSubcategory,
} from "./subcategories.server";
import { assertAdminSession } from "./session.server";

export const adminGetCatalogSnapshot = createServerFn({ method: "GET" }).handler(async () => {
  assertAdminSession();
  return buildAdminCatalogSnapshot();
});

export const adminListDbCategories = createServerFn({ method: "GET" }).handler(async () => {
  assertAdminSession();
  const categories = await listAdminCategoriesFromDb();
  return { categories };
});

export const adminCreateCategory = createServerFn({ method: "POST" })
  .validator((data) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    assertAdminSession();
    const payload = await parseAdminCategoryFormWithImage(formData, "create");
    const id = await insertAdminCategory(payload);
    return { ok: true as const, id };
  });

export const adminUpdateCategory = createServerFn({ method: "POST" })
  .validator((data) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    assertAdminSession();
    const payload = await parseAdminCategoryFormWithImage(formData, "edit");
    await updateAdminCategory(payload);
    return { ok: true as const };
  });

export const adminDeleteCategory = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => {
    if (!data?.id?.trim()) throw new Error("Укажите id категории");
    return { id: data.id.trim() };
  })
  .handler(async ({ data }) => {
    assertAdminSession();
    await deleteAdminCategory(data.id);
    return { ok: true as const };
  });

export const adminListDbProducts = createServerFn({ method: "GET" }).handler(async () => {
  assertAdminSession();
  const products = await listAdminProductsFromDb();
  return { products };
});

export const adminCreateProduct = createServerFn({ method: "POST" })
  .validator((data) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    assertAdminSession();
    const payload = await parseAdminProductFormWithImage(formData);
    const id = await insertAdminProduct(payload);
    return { ok: true as const, id };
  });

export const adminUpdateProduct = createServerFn({ method: "POST" })
  .validator((data) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    assertAdminSession();
    const payload = await parseAdminProductFormWithImage(formData);
    await updateAdminProduct(payload);
    return { ok: true as const };
  });

export const adminListSubcategories = createServerFn({ method: "GET" })
  .validator((data: { categoryId?: string }) => ({
    categoryId: data?.categoryId?.trim() || undefined,
  }))
  .handler(async ({ data }) => {
    assertAdminSession();
    const subcategories = await listAdminSubcategoriesFromDb(data.categoryId);
    return { subcategories };
  });

export const adminCreateSubcategory = createServerFn({ method: "POST" })
  .validator((data) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    assertAdminSession();
    const payload = await parseAdminSubcategoryFormWithImage(formData, "create");
    const id = await insertAdminSubcategory(payload);
    return { ok: true as const, id };
  });

export const adminUpdateSubcategory = createServerFn({ method: "POST" })
  .validator((data) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    assertAdminSession();
    const payload = await parseAdminSubcategoryFormWithImage(formData, "edit");
    await updateAdminSubcategory(payload);
    return { ok: true as const };
  });

export const adminDeleteSubcategory = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => {
    if (!data?.id?.trim()) throw new Error("Укажите id подкатегории");
    return { id: data.id.trim() };
  })
  .handler(async ({ data }) => {
    assertAdminSession();
    await deleteAdminSubcategory(data.id);
    return { ok: true as const };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .validator((data: { slug: string }) => {
    if (!data?.slug?.trim()) throw new Error("Укажите slug товара");
    return { slug: data.slug.trim() };
  })
  .handler(async ({ data }) => {
    assertAdminSession();
    await deleteAdminProduct(data.slug);
    return { ok: true as const };
  });
