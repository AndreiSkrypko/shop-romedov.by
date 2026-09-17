import { ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { adminSlugFromName, adminSubcategoryIdFromName } from "@/lib/admin/slug";
import { adminFieldClass, adminLabelClass } from "@/lib/admin/ui";
import type { Subcategory } from "@/lib/catalog/types";

type Props = {
  mode: "create" | "edit";
  categoryId: string;
  initial?: Subcategory;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
};

export function SubcategoryForm({ mode, categoryId, initial, onSubmit, onCancel }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [id, setId] = useState(initial?.id ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sortOrder, setSortOrder] = useState(String(initial?.order ?? 100));
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);
  const [slugManual, setSlugManual] = useState(false);
  const [idManual, setIdManual] = useState(false);

  const previewSrc = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    if (image.trim()) return image.trim();
    return null;
  }, [image, imageFile]);

  useEffect(() => {
    if (!imageFile || !previewSrc?.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(previewSrc);
  }, [imageFile, previewSrc]);

  useEffect(() => {
    if (mode !== "create" || !name.trim()) return;
    const base = adminSlugFromName(name, 80);
    if (!base) return;
    if (!slugManual) setSlug(base);
    if (!idManual) setId(adminSubcategoryIdFromName(categoryId, name));
  }, [name, mode, slugManual, idManual, categoryId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const resolvedId = id.trim() || adminSubcategoryIdFromName(categoryId, name);
    const resolvedSlug = slug.trim() || adminSlugFromName(name, 80);
    if (!resolvedId || !resolvedSlug) {
      setError("Укажите название — id и slug подставятся автоматически");
      setSaving(false);
      return;
    }

    const formData = new FormData();
    formData.set("id", resolvedId);
    formData.set("categoryId", categoryId);
    formData.set("slug", resolvedSlug);
    formData.set("name", name);
    if (image && !imageFile) formData.set("image", image);
    if (imageFile) formData.set("imageFile", imageFile);
    formData.set("sortOrder", sortOrder);
    if (!isPublished) formData.set("isPublished", "false");

    try {
      await onSubmit(formData);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div>
        <label className={adminLabelClass} htmlFor="sub-name">
          Название
        </label>
        <input
          id="sub-name"
          className={adminFieldClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {mode === "create" ? (
          <p className="mt-1 text-[11px] text-muted-foreground">
            Id и slug подставятся из названия (id с префиксом категории).
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={adminLabelClass} htmlFor="sub-id">
            Id (ключ в базе)
          </label>
          <input
            id="sub-id"
            className={`${adminFieldClass} ${mode === "create" && !idManual ? "bg-muted/40" : ""}`}
            value={id}
            onChange={(e) => {
              setIdManual(true);
              setId(e.target.value);
            }}
            readOnly={mode === "edit"}
            required
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Ключ в базе для привязки товаров. Пример: pipe-vgp
          </p>
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="sub-slug">
            Slug (в URL ?sub=)
          </label>
          <input
            id="sub-slug"
            className={`${adminFieldClass} ${mode === "create" && !slugManual ? "bg-muted/40" : ""}`}
            value={slug}
            onChange={(e) => {
              setSlugManual(true);
              setSlug(e.target.value);
            }}
            required
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            ?sub={slug || "…"} — не путать с id
          </p>
        </div>
      </div>

      <div>
        <label className={adminLabelClass} htmlFor="sub-sort">
          Порядок
        </label>
        <input
          id="sub-sort"
          type="number"
          className={adminFieldClass}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
      </div>

      <div>
        <label className={adminLabelClass}>Фото для плитки</label>
        {previewSrc ? (
          <img src={previewSrc} alt="" className="mt-2 max-h-32 rounded-lg border object-contain" />
        ) : null}
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-lime-deep">
          <ImagePlus className="h-4 w-4" />
          Загрузить файл
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <input
          className={`${adminFieldClass} mt-2`}
          placeholder="или URL картинки"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        Опубликована на сайте
      </label>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Сохранить
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="rounded-full border px-5 py-2 text-sm">
            Отмена
          </button>
        ) : null}
      </div>
    </form>
  );
}
