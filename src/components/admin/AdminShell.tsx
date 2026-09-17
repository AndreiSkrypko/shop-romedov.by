import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { adminLogout } from "@/lib/admin/admin-auth.functions";

const NAV = [
  { to: "/admin", label: "Обзор", end: true },
  { to: "/admin/categories", label: "1 · Категории" },
  { to: "/admin/subcategories", label: "2 · Подкатегории" },
  { to: "/admin/products", label: "3 · Товары" },
  { to: "/admin/help", label: "Справка" },
] as const;

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleLogout = async () => {
    await adminLogout();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Ромедов · админка каталога
            </p>
            <h1 className="font-display text-xl font-semibold uppercase">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/catalog"
              className="rounded-full border border-border px-4 py-2 font-display text-[10px] font-semibold uppercase tracking-[0.1em]"
            >
              Открыть сайт
            </Link>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-full border border-border px-4 py-2 font-display text-[10px] font-semibold uppercase tracking-[0.1em]"
            >
              Выйти
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 px-5 pb-3">
          {NAV.map((item) => {
            const active = item.end
              ? pathname === "/admin" || pathname === "/admin/"
              : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-4 py-2 font-display text-[10px] font-semibold uppercase tracking-[0.12em] ${
                  active ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">{children}</main>
    </div>
  );
}
