import { ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { adminProductSlugFromName } from "@/lib/admin/slug";
import { adminFieldClass, adminLabelClass } from "@/lib/admin/ui";
import type { Category, Product, SaleUnit, StockState, Subcategory } from "@/lib/catalog/types";

const SALE_UNITS: SaleUnit[] = ["м", "лист", "шт", "карта", "боб"];

type Props = {
  mode: "create" | "edit";
  categories: Category[];
  subcategories?: Subcategory[];
  initial?: Product;
  /** При создании — предвыбранная категория из фильтра списка */
  defaultCategoryId?: string;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
};

export function ProductForm({
  mode,
  categories,
  subcategories = [],
  initial,
  defaultCategoryId,
  onSubmit,
  onCancel,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? "",
  );
  const [subcategoryId, setSubcategoryId] = useState(initial?.subcategoryId ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [size, setSize] = useState(initial?.size ?? "");
  const [dimension, setDimension] = useState(initial ? String(initial.dimension) : "");
  const [steel, setSteel] = useState(initial?.steel ?? "");
  const [gost, setGost] = useState(initial?.gost ?? "");
  const [lengthM, setLengthM] = useState(initial?.lengthM != null ? String(initial.lengthM) : "");
  const [saleUnit, setSaleUnit] = useState<SaleUnit>(initial?.saleUnit ?? "м");
  const [weightKg, setWeightKg] = useState(initial ? String(initial.weightKg) : "");
  const [pricePerTon, setPricePerTon] = useState(
    initial?.pricePerTon != null ? String(initial.pricePerTon) : "",
  );
  const [pricePerUnit, setPricePerUnit] = useState(
    initial?.pricePerUnit != null ? String(initial.pricePerUnit) : "",
  );
  const [pricePerMeter, setPricePerMeter] = useState(
    initial?.pricePerMeter != null ? String(initial.pricePerMeter) : "",
  );
  const [metersPerSaleUnit, setMetersPerSaleUnit] = useState(
    initial?.metersPerSaleUnit != null ? String(initial.metersPerSaleUnit) : "",
  );
  const [stock, setStock] = useState<StockState>(initial?.stock ?? "in");
  const [popular, setPopular] = useState(initial?.popular ?? false);
  const [article, setArticle] = useState(initial?.article ?? "");
  const [cardTitle, setCardTitle] = useState(initial?.cardTitle ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);
  const [slugManual, setSlugManual] = useState(false);

  const previewSrc = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    if (image.trim()) return image.trim();
    return null;
  }, [image, imageFile]);

  useEffect(() => {
    if (!imageFile || !previewSrc?.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(previewSrc);
  }, [imageFile, previewSrc]);

  const category = categories.find((c) => c.id === categoryId);
  const subcategoriesForCategory = subcategories.filter((s) => s.categoryId === categoryId);

  useEffect(() => {
    if (mode !== "create" || !name.trim() || slugManual) return;
    setSlug(adminProductSlugFromName(name, article));
  }, [name, article, mode, slugManual]);

  const fillCategoryImage = () => {
    if (category) setImage(category.image);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    if (subcategoriesForCategory.length > 0 && !subcategoryId) {
      setError(
        "У этой категории есть подкатегории — выберите подкатегорию, иначе товар не попадёт в плитку на сайте.",
      );
      setSaving(false);
      return;
    }

    const resolvedSlug =
      slug.trim() || (mode === "create" ? adminProductSlugFromName(name, article) : "");
    if (!resolvedSlug) {
      setError("Укажите название — slug подставится автоматически");
      setSaving(false);
      return;
    }

    const formData = new FormData();
    formData.set("slug", resolvedSlug);
    formData.set("categoryId", categoryId);
    if (subcategoryId) formData.set("subcategoryId", subcategoryId);
    formData.set("name", name);
    formData.set("size", size);
    formData.set("dimension", dimension);
    formData.set("steel", steel);
    formData.set("gost", gost);
    if (lengthM) formData.set("lengthM", lengthM);
    formData.set("saleUnit", saleUnit);
    formData.set("weightKg", weightKg);
    if (pricePerTon) formData.set("pricePerTon", pricePerTon);
    if (pricePerUnit) formData.set("pricePerUnit", pricePerUnit);
    if (pricePerMeter) formData.set("pricePerMeter", pricePerMeter);
    if (metersPerSaleUnit) formData.set("metersPerSaleUnit", metersPerSaleUnit);
    formData.set("stock", stock);
    formData.set("popular", popular ? "true" : "false");
    if (article) formData.set("article", article);
    if (cardTitle) formData.set("cardTitle", cardTitle);
    if (image && !imageFile) formData.set("image", image);
    if (imageFile) formData.set("imageFile", imageFile);
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
      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
        <legend className="px-1 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Размещение в каталоге
        </legend>

        <label className="block">
          <span className={adminLabelClass}>Категория *</span>
          <select
            className={`${adminFieldClass} mt-1`}
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setSubcategoryId("");
            }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Раздел на сайте: /catalog/{category?.slug ?? "…"}
          </p>
        </label>

        {subcategoriesForCategory.length > 0 ? (
          <label className="block">
            <span className={adminLabelClass}>Подкатегория *</span>
            <select
              className={`${adminFieldClass} mt-1`}
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              required
            >
              <option value="">Выберите подкатегорию…</option>
              {subcategoriesForCategory.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Покупатель увидит товар при выборе этой плитки на странице категории.
            </p>
          </label>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            У категории нет подкатегорий — товар будет в общем списке раздела. Чтобы добавить
            плитки-фильтры, создайте подкатегории в разделе «Подкатегории».
          </p>
        )}
      </fieldset>

      <label className="block">
        <span className={adminLabelClass}>Название*</span>
        <input className={`${adminFieldClass} mt-1`} value={name} onChange={(e) => setName(e.target.value)} required />
        {mode === "create" ? (
          <p className="mt-1 text-[11px] text-muted-foreground">
            Slug ниже подставится из названия (и артикула, если указан).
          </p>
        ) : null}
      </label>

      <label className="block">
        <span className={adminLabelClass}>Slug (в URL /product/…) *</span>
        <input
          className={`${adminFieldClass} mt-1 ${mode === "create" && !slugManual ? "bg-muted/40" : ""}`}
          value={slug}
          onChange={(e) => {
            if (mode === "create") setSlugManual(true);
            setSlug(e.target.value);
          }}
          readOnly={mode === "edit"}
          required
        />
        <p className="mt-1 text-[11px] text-muted-foreground">
          {mode === "create"
            ? "Авто из названия. После создания не менять."
            : "Уникальный адрес карточки. После создания не менять."}
        </p>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={adminLabelClass}>Типоразмер*</span>
          <input className={`${adminFieldClass} mt-1`} value={size} onChange={(e) => setSize(e.target.value)} required />
          <p className="mt-1 text-[11px] text-muted-foreground">На витрине: Ø12 мм, 100×100×6…</p>
        </label>
        <label className="block">
          <span className={adminLabelClass}>Размер (число)*</span>
          <input
            className={`${adminFieldClass} mt-1`}
            value={dimension}
            onChange={(e) => setDimension(e.target.value)}
            required
          />
          <p className="mt-1 text-[11px] text-muted-foreground">Тот же размер числом для сортировки: 12, 0.5</p>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={adminLabelClass}>Марка</span>
          <input className={`${adminFieldClass} mt-1`} value={steel} onChange={(e) => setSteel(e.target.value)} />
        </label>
        <label className="block">
          <span className={adminLabelClass}>ГОСТ / ТУ</span>
          <input className={`${adminFieldClass} mt-1`} value={gost} onChange={(e) => setGost(e.target.value)} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={adminLabelClass}>Ед. продажи*</span>
          <select
            className={`${adminFieldClass} mt-1`}
            value={saleUnit}
            onChange={(e) => {
              const next = e.target.value as SaleUnit;
              setSaleUnit(next);
              if (next === "м") setMetersPerSaleUnit("");
            }}
          >
            {SALE_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={adminLabelClass}>Вес ед., кг*</span>
          <input
            className={`${adminFieldClass} mt-1`}
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            required
          />
          {saleUnit === "м" ? (
            <p className="mt-1 text-[11px] text-muted-foreground">Кг на 1 метр (не на хлыст).</p>
          ) : null}
        </label>
        <label className="block">
          <span className={adminLabelClass}>Длина, м</span>
          <input className={`${adminFieldClass} mt-1`} value={lengthM} onChange={(e) => setLengthM(e.target.value)} />
          <p className="mt-1 text-[11px] text-muted-foreground">
            {saleUnit === "м"
              ? "Мерная длина хлыста для справки (11,7). В корзине считаются метры."
              : saleUnit === "шт"
                ? "Длина одного прутка; для заказа штуками."
                : saleUnit === "боб"
                  ? "Длина бухты (часто = метрам в единице ниже)."
                  : "Если применимо."}
          </p>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={adminLabelClass}>Цена/тонна</span>
          <input
            className={`${adminFieldClass} mt-1`}
            value={pricePerTon}
            onChange={(e) => setPricePerTon(e.target.value)}
          />
        </label>
        <label className="block">
          <span className={adminLabelClass}>Цена/ед.</span>
          <input
            className={`${adminFieldClass} mt-1`}
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
          />
        </label>
        <label className="block">
          <span className={adminLabelClass}>Цена/метр</span>
          <input
            className={`${adminFieldClass} mt-1`}
            value={pricePerMeter}
            onChange={(e) => setPricePerMeter(e.target.value)}
          />
        </label>
      </div>

      {saleUnit === "боб" ? (
        <label className="block">
          <span className={adminLabelClass}>Метров в единице (в бухте)</span>
          <input
            className={`${adminFieldClass} mt-1`}
            value={metersPerSaleUnit}
            onChange={(e) => setMetersPerSaleUnit(e.target.value)}
            placeholder="50"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Сколько метров в одной бухте при заказе «боб». Для продажи метрами (ед. «м») это поле не
            заполняют.
          </p>
        </label>
      ) : null}

      <div className="flex flex-wrap items-center gap-6">
        <label className="block">
          <span className={adminLabelClass}>Наличие</span>
          <select
            className={`${adminFieldClass} mt-1`}
            value={stock}
            onChange={(e) => setStock(e.target.value as StockState)}
          >
            <option value="in">В наличии</option>
            <option value="out">Нет в наличии</option>
            <option value="order">Под заказ</option>
          </select>
        </label>
        <label className="mt-5 flex max-w-xs items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={popular}
            onChange={(e) => setPopular(e.target.checked)}
          />
          <span>
            На главной в блоке «Чаще всего заказывают»
            <span className="mt-0.5 block text-xs text-muted-foreground">
              До 8 позиций с этой отметкой показываются на главной странице.
            </span>
          </span>
        </label>
        <label className="mt-5 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          На сайте
        </label>
      </div>

      <label className="block">
        <span className={adminLabelClass}>Артикул</span>
        <input className={`${adminFieldClass} mt-1`} value={article} onChange={(e) => setArticle(e.target.value)} />
      </label>

      <label className="block">
        <span className={adminLabelClass}>Заголовок плитки</span>
        <input className={`${adminFieldClass} mt-1`} value={cardTitle} onChange={(e) => setCardTitle(e.target.value)} />
      </label>

      <div className="rounded-xl border border-border p-4">
        <span className={adminLabelClass}>Фото товара</span>
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
              JPEG, PNG, WebP или GIF, до 5 МБ. Файл сохраняется в Supabase Storage при нажатии «Добавить» /
              «Сохранить».
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={fillCategoryImage}
                className="rounded-lg border border-border px-3 py-1.5 text-xs"
              >
                Картинка категории
              </button>
              {(imageFile || image) && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImage("");
                  }}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground"
                >
                  Убрать
                </button>
              )}
            </div>
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

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 font-display text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-foreground disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {mode === "create" ? "Добавить товар" : "Сохранить"}
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
