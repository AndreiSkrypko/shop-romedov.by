import { getSupabase } from "@/lib/supabase/client";

const BUCKET = "product-images";
const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extensionFor(type: string): string {
  switch (type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

async function uploadCatalogImage(
  file: File,
  folder: "products" | "categories" | "subcategories",
  slug: string,
): Promise<string> {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Формат фото: JPEG, PNG, WebP или GIF");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Файл больше 5 МБ — сожмите изображение");
  }

  const safeSlug = slug.replace(/[^a-z0-9-]/g, "").slice(0, 80) || folder;
  const path = `${folder}/${safeSlug}/${Date.now()}.${extensionFor(file.type)}`;
  const body = new Uint8Array(await file.arrayBuffer());

  const supabase = getSupabase();
  const { error } = await supabase.storage.from(BUCKET).upload(path, body, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    if (error.message.includes("Bucket not found")) {
      throw new Error("Создайте bucket product-images — scripts/supabase-storage.sql");
    }
    if (error.message.includes("row-level security") || error.message.includes("Unauthorized")) {
      throw new Error(
        "Загрузка фото запрещена политикой Storage — выполните scripts/supabase-storage.sql в Supabase",
      );
    }
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function uploadProductImage(file: File, slug: string): Promise<string> {
  return uploadCatalogImage(file, "products", slug);
}

export function uploadCategoryImage(file: File, slug: string): Promise<string> {
  return uploadCatalogImage(file, "categories", slug);
}

export function uploadSubcategoryImage(file: File, slug: string): Promise<string> {
  return uploadCatalogImage(file, "subcategories", slug);
}

export function readImageFileFromForm(formData: FormData): File | null {
  const entry = formData.get("imageFile");
  if (!(entry instanceof File) || entry.size === 0) return null;
  return entry;
}
