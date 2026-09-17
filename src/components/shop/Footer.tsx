import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/shop/Logo";
import { MailIcon, PhoneIcon, TelegramIcon, ViberIcon } from "@/components/shop/icons";
import { useCatalogCategories } from "@/lib/catalog";
import {
  ADDRESS_LEGAL,
  ADDRESS_PRODUCTION,
  EMAIL,
  EMAIL_HREF,
  PHONES,
  PHONE_HREF,
  TELEGRAM_HREF,
  UNP,
  VIBER_HREF,
  WORK_HOURS,
} from "@/lib/contacts";
import { MAIN_SITE_URL, SITE_LEGAL_NAME } from "@/lib/site";

const CHANNELS = [
  { href: PHONE_HREF, label: "Позвонить", Icon: PhoneIcon },
  { href: EMAIL_HREF, label: "Написать на почту", Icon: MailIcon },
  { href: TELEGRAM_HREF, label: "Telegram", Icon: TelegramIcon },
  { href: VIBER_HREF, label: "Viber", Icon: ViberIcon },
];

export function Footer() {
  const categories = useCatalogCategories();

  return (
    <footer className="mt-auto bg-graphite py-14 text-background/70">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr_1fr]">
          <div>
            <Logo invert />
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              Ромедов — металлообработка и подбор металлопроката. Минск и Борисов. Резка в размер,
              доставка по всей Беларуси.
            </p>
            <a
              href={MAIN_SITE_URL}
              className="mt-5 inline-flex font-display text-xs font-semibold uppercase tracking-[0.14em] text-brand transition-colors hover:text-lime"
            >
              Основной сайт romedov.by →
            </a>
          </div>

          <div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-background/45">
              Каталог
            </p>
            <div className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to="/catalog/$category"
                  params={{ category: category.slug }}
                  className="text-sm transition-colors hover:text-brand"
                >
                  {category.menuName}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-background/45">
              Контакты
            </p>
            <div className="mt-4 space-y-3">
              {PHONES.map((phone) => (
                <div key={phone.href}>
                  {phone.label ? (
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-background/45">
                      {phone.label}
                    </p>
                  ) : null}
                  <a
                    href={phone.href}
                    className="mt-0.5 block font-display text-lg text-background transition-colors hover:text-brand"
                  >
                    {phone.display}
                  </a>
                </div>
              ))}
            </div>
            <a href={EMAIL_HREF} className="mt-3 block text-sm transition-colors hover:text-brand">
              {EMAIL}
            </a>
            <p className="mt-4 text-sm leading-relaxed">{ADDRESS_PRODUCTION}</p>
            <p className="mt-1 text-sm leading-relaxed">{WORK_HOURS}</p>

            <div className="mt-5 flex items-center gap-2">
              {CHANNELS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-background/25 transition-colors hover:border-brand hover:text-brand"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-1.5 border-t border-background/15 pt-6 text-xs leading-relaxed">
          <p>{ADDRESS_LEGAL}</p>
          <p>УНП {UNP}</p>
          <p className="pt-2">
            © {new Date().getFullYear()} {SITE_LEGAL_NAME}. Все права защищены. Информация на сайте
            не является публичной офертой.
          </p>
        </div>
      </div>
    </footer>
  );
}
