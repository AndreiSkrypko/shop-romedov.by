import { ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { adminSlugFromName } from "@/lib/admin/slug";
import { adminFieldClass, adminLabelClass } from "@/lib/admin/ui";
import type { Category } from "@/lib/catalog/types";

type Props = {
  mode: "create" | "edit";
  initial?: Category;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
};

export function CategoryForm({ mode, initial, onSubmit, onCancel }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [id, setId] = useState(initial?.id ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [menuName, setMenuName] = useState(initial?.menuName ?? "");
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? "/products/supplies.webp");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sortOrder, setSortOrder] = useState(String(initial?.order ?? 100));
  const [dimensionLabel, setDimensionLabel] = useState(initial?.dimensionLabel ?? "Размер");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "");
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
    const base = adminSlugFromName(name, 64);
    if (!base) return;
    if (!slugManual) setSlug(base);
    if (!idManual) setId(base);
    setMenuName((prev) => (prev.trim() ? prev : name));
  }, [name, mode, slugManual, idManual]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const resolvedId = id.trim() || adminSlugFromName(name, 64);
    const resolvedSlug = slug.trim() || adminSlugFromName(name, 80);
    if (!resolvedId || !resolvedSlug) {
      setError("Укажите название — id и slug подставятся автоматически");
      setSaving(false);
      return;
    }

    const formData = new FormData();
    formData.set("id", resolvedId);
    formData.set("slug", resolvedSlug);
    formData.set("name", name);
    formData.set("menuName", menuName);
    formData.set("tagline", tagline);
    formData.set("description", description);
    if (image && !imageFile) formData.set("image", image);
    if (imageFile) formData.set("imageFile", imageFile);
    formData.set("sortOrder", sortOrder);
    formData.set("dimensionLabel", dimensionLabel);
    if (seoTitle) formData.set("seoTitle", seoTitle);
    if (seoDescription) formData.set("seoDescription", seoDescription);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className={adminLabelClass}>Название*</span>
        <input
          className={`${adminFieldClass} mt-1`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {mode === "create" ? (
          <p className="mt-1 text-[11px] text-muted-foreground">
            Id и slug ниже подставятся из названия (латиница). Можно поправить вручную.
          </p>
        ) : null}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={adminLabelClass}>Id (ключ в базе) *</span>
          <input
            className={`${adminFieldClass} mt-1 ${mode === "create" && !idManual ? "bg-muted/40" : ""}`}
            value={id}
            onChange={(e) => {
              setIdManual(true);
              setId(e.target.value);
            }}
            readOnly={mode === "edit"}
            required
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            {mode === "create"
              ? "Авто из названия. После создания не меняется."
              : "Не менять после создания."}
          </p>
        </label>
        <label className="block">
          <span className={adminLabelClass}>Slug (в URL /catalog/…) *</span>
          <input
            className={`${adminFieldClass} mt-1 ${mode === "create" && !slugManual ? "bg-muted/40" : ""}`}
            value={slug}
            onChange={(e) => {
              setSlugManual(true);
              setSlug(e.target.value);
            }}
            required
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Адрес: /catalog/{slug || "…"}
          </p>
        </label>
      </div>

      <label className="block">
        <span className={adminLabelClass}>В меню*</span>
        <input
          className={`${adminFieldClass} mt-1`}
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className={adminLabelClass}>Подзаголовок</span>
        <input className={`${adminFieldClass} mt-1`} value={tagline} onChange={(e) => setTagline(e.target.value)} />
      </label>

      <label className="block">
        <span className={adminLabelClass}>Описание</span>
        <textarea
          className={`${adminFieldClass} mt-1 min-h-[88px]`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={adminLabelClass}>Порядок</span>
          <input
            className={`${adminFieldClass} mt-1`}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            inputMode="numeric"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={adminLabelClass}>Колонка размера</span>
          <input
            className={`${adminFieldClass} mt-1`}
            value={dimensionLabel}
            onChange={(e) => setDimensionLabel(e.target.value)}
          />
        </label>
      </div>

      <div className="rounded-xl border border-border p-4">
        <span className={adminLabelClass}>Обложка категории</span>
        <div className="mt-3 flex flex-wrap gap-4">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/40">
            {previewSrc ? (
              <img src={previewSrc} alt="" className="h-full w-full object-cover" />
            ) : (
              <ImagePlus className="h-8 w-8 text-muted-foreground/50" />
            )}
          </div>
          <div className="min-w-[200px] flex-1 space-y-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium hover:bg-muted">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setImageFile(file);
                  if (file) setImage("");
                }}
              />
              Загрузить файл
            </label>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Плитка в каталоге и меню. JPEG, PNG, WebP или GIF, до 5 МБ.
            </p>
            {(imageFile || image) && (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImage("/products/supplies.webp");
                }}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground"
              >
                Сбросить
              </button>
            )}
            <label className="block">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                или URL / путь
              </span>
              <input
                className={`${adminFieldClass} mt-1`}
                value={image}
                placeholder="/products/… или https://…"
                onChange={(e) => {
                  setImage(e.target.value);
                  setImageFile(null);
                }}
                disabled={Boolean(imageFile)}
              />
            </label>
          </div>
        </div>
      </div>

      <label className="block">
        <span className={adminLabelClass}>SEO title</span>
        <input className={`${adminFieldClass} mt-1`} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
      </label>

      <label className="block">
        <span className={adminLabelClass}>SEO description</span>
        <textarea
          className={`${adminFieldClass} mt-1 min-h-[64px]`}
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        Показывать на сайте
      </label>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 font-display text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-foreground disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {mode === "create" ? "Создать категорию" : "Сохранить"}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-border px-6 py-2.5 font-display text-[10px] font-semibold uppercase tracking-[0.12em]"
          >
            Отмена
          </button>
        ) : null}
      </div>
    </form>
  );
}
