import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/shop/Logo";
import { MailIcon, PhoneIcon, TelegramIcon, ViberIcon } from "@/components/shop/icons";
import { useCart } from "@/lib/cart-context";
import { CATEGORIES_BY_ORDER, formatPriceCompact } from "@/lib/catalog";
import {
  EMAIL_HREF,
  PHONES,
  PHONE_DISPLAY,
  PHONE_HREF,
  TELEGRAM_HREF,
  VIBER_HREF,
  WORK_HOURS,
} from "@/lib/contacts";
import { MAIN_SITE_URL, SHOW_PRICES } from "@/lib/site";

const SHOP_NAV = [
  { to: "/catalog", label: "Каталог" },
  { to: "/delivery", label: "Доставка и оплата" },
  { to: "/contacts", label: "Контакты" },
] as const;

const MAIN_SITE_NAV = [
  { href: `${MAIN_SITE_URL}/#production`, label: "Производство" },
  { href: `${MAIN_SITE_URL}/transport`, label: "Транспорт" },
  { href: `${MAIN_SITE_URL}/#cases`, label: "Кейсы" },
  { href: `${MAIN_SITE_URL}/#products`, label: "Продукция" },
] as const;

const CHANNELS = [
  { href: PHONE_HREF, label: "Позвонить", Icon: PhoneIcon },
  { href: EMAIL_HREF, label: "Написать на почту", Icon: MailIcon },
  { href: TELEGRAM_HREF, label: "Telegram", Icon: TelegramIcon },
  { href: VIBER_HREF, label: "Viber", Icon: ViberIcon },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { positions, totalPrice, ready } = useCart();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (value.length < 2) return;
    setMenuOpen(false);
    navigate({ to: "/search", search: { q: value } });
  };

  return (
    <header className="sticky top-0 z-50 bg-background shadow-[0_1px_0_0_var(--color-border)]">
      {/* Верхняя полоса: ссылки на основной сайт */}
      <div className="hidden bg-carbon text-background/70 lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-5 text-[11px] lg:px-8">
          <nav className="flex items-center gap-6 uppercase tracking-[0.14em]">
            <a href={MAIN_SITE_URL} className="transition-colors hover:text-brand">
              romedov.by
            </a>
            {MAIN_SITE_NAV.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-brand">
                {item.label}
              </a>
            ))}
          </nav>
          <p className="tracking-wide">{WORK_HOURS}</p>
        </div>
      </div>

      {/* Основная панель */}
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-5 lg:gap-8 lg:px-8">
        <Link to="/" aria-label="Ромедов Металл — на главную" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {SHOP_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-lime-deep" }}
              className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:text-lime-deep"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden max-w-sm flex-1 lg:block">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Арматура 12, труба 40×40, швеллер…"
              aria-label="Поиск по каталогу"
              className="w-full rounded-full border border-border bg-secondary/60 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-lime-deep focus:bg-background"
            />
          </div>
        </form>

        <a
          href={PHONE_HREF}
          className="ml-auto hidden font-display text-base font-semibold tracking-wide lg:ml-0 lg:block"
        >
          {PHONE_DISPLAY}
        </a>

        <Link
          to="/cart"
          aria-label="Корзина"
          className="relative ml-auto flex h-11 items-center gap-3 rounded-full bg-brand px-4 font-display text-xs font-semibold uppercase tracking-[0.1em] text-brand-foreground transition-transform hover:-translate-y-0.5 lg:ml-0"
        >
          <span className="relative">
            <ShoppingCart className="h-5 w-5" aria-hidden />
            {ready && positions > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-carbon px-1 text-[10px] font-bold text-background">
                {positions}
              </span>
            ) : null}
          </span>
          {ready && positions > 0 && SHOW_PRICES ? (
            <span className="hidden sm:inline">{formatPriceCompact(totalPrice)}</span>
          ) : (
            <span className="hidden sm:inline">Корзина</span>
          )}
        </Link>

        <button
          type="button"
          aria-label="Меню"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border xl:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Полоса категорий */}
      <div className="hidden border-t border-border bg-secondary/50 xl:block">
        <div className="no-scrollbar mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-5 py-2.5 lg:px-8">
          {CATEGORIES_BY_ORDER.map((category) => (
            <Link
              key={category.id}
              to="/catalog/$category"
              params={{ category: category.slug }}
              className="whitespace-nowrap text-xs font-medium text-muted-foreground transition-colors hover:text-lime-deep"
            >
              {category.menuName}
            </Link>
          ))}
        </div>
      </div>

      {/* Мобильное меню */}
      {menuOpen ? (
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-border bg-background px-5 pb-8 pt-4 xl:hidden">
          <form onSubmit={submitSearch}>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Поиск по каталогу"
                aria-label="Поиск по каталогу"
                className="w-full rounded-full border border-border bg-secondary/60 py-3 pl-10 pr-4 text-sm outline-none focus:border-lime-deep"
              />
            </div>
          </form>

          <nav className="mt-5 flex flex-col">
            {SHOP_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="border-b border-border py-3.5 font-display text-base font-medium uppercase tracking-wide"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <p className="mt-6 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Категории
          </p>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {CATEGORIES_BY_ORDER.map((category) => (
              <Link
                key={category.id}
                to="/catalog/$category"
                params={{ category: category.slug }}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-muted-foreground transition-colors hover:text-lime-deep"
              >
                {category.menuName}
              </Link>
            ))}
          </div>

          <p className="mt-6 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Основной сайт
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {MAIN_SITE_NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-muted-foreground">
                {item.label}
              </a>
            ))}
          </div>

          <div className="mt-6 space-y-1.5">
            {PHONES.map((phone) => (
              <a
                key={phone.href}
                href={phone.href}
                className="block font-display text-lg font-semibold"
              >
                {phone.display}
              </a>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            {CHANNELS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-lime-deep hover:text-lime-deep"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
