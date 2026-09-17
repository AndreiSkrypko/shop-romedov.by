import { Link } from "@tanstack/react-router";

import type { Crumb } from "@/components/shop/Breadcrumbs";

const linkClass = "text-muted-foreground transition-colors hover:text-lime-deep";

/** Крошки в стиле классической витрины: обычный регистр, разделитель «›». */
export function ShopBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground"
    >
      <Link to="/" className={linkClass}>
        Главная
      </Link>

      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          <span aria-hidden="true" className="text-border">
            ›
          </span>
          {item.kind === "catalog" ? (
            <Link to="/catalog" className={linkClass}>
              Металлопрокат
            </Link>
          ) : item.kind === "category" ? (
            <Link
              to="/catalog/$category"
              params={{ category: item.slug }}
              search={{}}
              className={linkClass}
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
