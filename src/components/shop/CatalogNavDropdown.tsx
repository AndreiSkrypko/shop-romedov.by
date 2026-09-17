import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useCatalogCategories } from "@/lib/catalog";

/** Пункт «Каталог» в шапке: выпадающий список категорий (удобно при большом числе разделов). */
export function CatalogNavDropdown() {
  const categories = useCatalogCategories();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1 text-[13px] font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:text-lime-deep"
      >
        Каталог
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        /* pt-2 вместо mt-2: отступ внутри блока, иначе между кнопкой и меню «мёртвая зона» и меню закрывается */
        <div className="absolute left-0 top-full z-50 pt-2">
          <div className="w-[min(20rem,calc(100vw-2rem))] max-h-[min(24rem,70vh)] overflow-y-auto rounded-xl border border-border bg-background py-1 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.28)]">
            <Link
              to="/catalog"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/70"
            >
              Весь каталог
            </Link>
            <div className="mx-3 my-1 border-t border-border" role="separator" />
            <ul className="pb-1">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to="/catalog/$category"
                    params={{ category: category.slug }}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-lime-deep"
                  >
                    {category.menuName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
