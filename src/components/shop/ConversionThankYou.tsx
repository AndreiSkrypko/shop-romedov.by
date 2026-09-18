import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { Shell } from "@/components/shop/Shell";
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF } from "@/lib/contacts";

type ConversionThankYouProps = {
  /** Для целей аналитики (URL страницы + data-conversion). */
  conversionId: "request" | "order";
  title: string;
  children: ReactNode;
  breadcrumbs: Array<{ label: string; kind: "current" }>;
};

export function ConversionThankYou({
  conversionId,
  title,
  children,
  breadcrumbs,
}: ConversionThankYouProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Shell>
      <div
        className="mx-auto max-w-2xl px-5 py-8 lg:px-8 lg:py-12"
        data-conversion={conversionId}
      >
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-10 text-center lg:mt-14">
          <CheckCircle2 className="mx-auto h-14 w-14 text-lime-deep" aria-hidden />
          <h1 className="mt-6 font-display text-3xl font-semibold uppercase sm:text-4xl">{title}</h1>
          <div className="mt-5 text-sm leading-relaxed text-muted-foreground">{children}</div>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/catalog"
              className="rounded-full bg-brand px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.12em] text-brand-foreground"
            >
              В каталог
            </Link>
            <a
              href={EMAIL_HREF}
              className="rounded-full border border-border px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.12em]"
            >
              {EMAIL}
            </a>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            Срочно —{" "}
            <a href={PHONE_HREF} className="font-semibold text-lime-deep">
              {PHONE_DISPLAY}
            </a>
          </p>
        </div>
      </div>
    </Shell>
  );
}
