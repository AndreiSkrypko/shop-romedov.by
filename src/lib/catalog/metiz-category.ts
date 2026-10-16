import type { Category, Subcategory } from "./types";

/** Категория / подкатегория «метизы» (id задаётся в админке, часто metizy). */
export function categoryIsMetiz(category: Pick<Category, "id" | "slug" | "name" | "menuName">): boolean {
  const hay = `${category.id} ${category.slug} ${category.name} ${category.menuName}`.toLowerCase();
  return (
    hay.includes("metiz") ||
    hay.includes("метиз") ||
    hay.includes("krepezh") ||
    hay.includes("крепёж") ||
    hay.includes("krepej")
  );
}

export function subcategoryIsMetiz(
  sub: Pick<Subcategory, "id" | "slug" | "name">,
): boolean {
  const hay = `${sub.id} ${sub.slug} ${sub.name}`.toLowerCase();
  return hay.includes("metiz") || hay.includes("метиз") || hay.includes("krepezh") || hay.includes("креп");
}
