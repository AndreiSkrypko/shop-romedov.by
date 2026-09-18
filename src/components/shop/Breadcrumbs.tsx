import { Link } from "@tanstack/react-router";

/**
 * Крошка либо ведёт на известный маршрут, либо обозначает текущую страницу.
 * Явный union вместо строкового `to` — чтобы типы маршрутов оставались проверяемыми.
 */
export type Crumb =
  | { label: string; kind: "catalog" }
  | { label: string; kind: "category"; slug: string }
  | { label: string; kind: "cart" }
  | { label: string; kind: "current" };

const linkClass = "transition-colors hover:text-lime-deep";

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
    >
      <Link to="/" className={linkClass}>
        Главная
      </Link>

      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          <span aria-hidden="true">/</span>
          {item.kind === "catalog" ? (
            <Link to="/catalog" className={linkClass}>
              {item.label}
            </Link>
          ) : item.kind === "category" ? (
            <Link to="/catalog/$category" params={{ category: item.slug }} className={linkClass}>
              {item.label}
            </Link>
          ) : item.kind === "cart" ? (
            <Link to="/cart" className={linkClass}>
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground/80">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
