import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Toaster } from "sonner";

import { CartProvider } from "@/lib/cart";
import { CatalogCategoriesProvider } from "@/lib/catalog/catalog-context";
import { listCategoriesAsync } from "@/lib/catalog/category-repository";
import { fetchProductCountsByCategoryFromSupabase } from "@/lib/supabase/queries";
import { SITE_NAME } from "@/lib/site";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-display text-7xl font-semibold text-foreground">404</p>
        <h1 className="mt-4 font-display text-xl font-semibold uppercase text-foreground">
          Страница не найдена
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Возможно, позиция снята с продажи или адрес введён с ошибкой.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/catalog"
            className="rounded-full bg-brand px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.12em] text-brand-foreground"
          >
            В каталог
          </Link>
          <Link
            to="/"
            className="rounded-full border border-border px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.12em]"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold uppercase text-foreground">
          Страница не загрузилась
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Что-то пошло не так на нашей стороне. Попробуйте обновить страницу или вернуться на
          главную.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-brand px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.12em] text-brand-foreground"
          >
            Попробовать снова
          </button>
          <a
            href="/"
            className="rounded-full border border-border px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.12em]"
          >
            На главную
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async () => ({
    categories: await listCategoriesAsync(),
    productCountByCategoryId: await fetchProductCountsByCategoryFromSupabase(),
  }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "ru_RU" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#ECE92C" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { categories, productCountByCategoryId } = Route.useLoaderData();

  return (
    <QueryClientProvider client={queryClient}>
      <CatalogCategoriesProvider
        categories={categories}
        productCountByCategoryId={productCountByCategoryId}
      >
        <CartProvider>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          <Toaster position="bottom-right" richColors closeButton />
        </CartProvider>
      </CatalogCategoriesProvider>
    </QueryClientProvider>
  );
}
