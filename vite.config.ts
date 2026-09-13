import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

import { CATEGORY_SLUGS, PRODUCT_SLUGS } from "./src/lib/catalog/slugs";

export default defineConfig({
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
        ...CATEGORY_SLUGS.map((slug) => ({
          path: `/catalog/${slug}`,
          prerender: { enabled: true },
        })),
        ...PRODUCT_SLUGS.map((slug) => ({
          path: `/product/${slug}`,
          prerender: { enabled: true },
        })),
      ],
    }),
    nitro(),
    viteReact(),
  ],
});
