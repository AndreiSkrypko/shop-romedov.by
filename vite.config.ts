import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

import { fetchSupabaseCategorySlugs, fetchSupabaseProductSlugs } from "./src/lib/supabase/queries";

export default defineConfig(async ({ command }) => {
  const productSlugs = command === "build" ? await fetchSupabaseProductSlugs() : [];
  const categorySlugs = command === "build" ? await fetchSupabaseCategorySlugs() : [];

  return {
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      tailwindcss(),
      tanstackStart({
        srcDirectory: "src",
        server: { entry: "./src/server.ts" },
        prerender: {
          enabled: true,
          crawlLinks: true,
          failOnError: true,
        },
        pages: [
          { path: "/catalog", prerender: { enabled: true } },
          { path: "/delivery", prerender: { enabled: true } },
          { path: "/contacts", prerender: { enabled: true } },
          { path: "/admin", prerender: { enabled: false } },
          { path: "/admin/login", prerender: { enabled: false } },
          { path: "/admin/categories", prerender: { enabled: false } },
          { path: "/admin/products", prerender: { enabled: false } },
          ...categorySlugs.map((slug) => ({
            path: `/catalog/${slug}`,
            prerender: { enabled: true },
          })),
          ...productSlugs.map((slug) => ({
            path: `/product/${slug}`,
            prerender: { enabled: true },
          })),
        ],
      }),
      nitro(
        command === "build"
          ? {
              output: {
                publicDir: "dist",
              },
            }
          : {},
      ),
      viteReact(),
    ],
  };
});
