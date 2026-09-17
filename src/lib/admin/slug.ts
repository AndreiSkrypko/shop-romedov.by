const MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

/** Черновой slug из названия (латиница для URL). */
export function slugifyProductName(name: string): string {
  const lower = name.trim().toLowerCase();
  let out = "";

  for (const char of lower) {
    if (MAP[char] !== undefined) {
      out += MAP[char];
      continue;
    }
    if (/[a-z0-9]/.test(char)) {
      out += char;
      continue;
    }
    if (char === " " || char === "_" || char === "/" || char === "×" || char === "x") {
      out += "-";
    }
  }

  return out
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

/** Id/slug категории или slug товара из названия. */
export function adminSlugFromName(name: string, maxLength = 100): string {
  return slugifyProductName(name).slice(0, maxLength);
}

/** Id подкатегории: префикс категории + slug из названия. */
export function adminSubcategoryIdFromName(categoryId: string, name: string): string {
  const base = slugifyProductName(name);
  if (!base) return "";
  return `${categoryId}-${base}`.slice(0, 80);
}

/** Slug товара: название и опционально артикул для уникальности. */
export function adminProductSlugFromName(name: string, article?: string): string {
  let base = slugifyProductName(name);
  if (article?.trim()) {
    const art = slugifyProductName(article.trim());
    if (art) base = `${base}-${art}`;
  }
  return base.slice(0, 120);
}
