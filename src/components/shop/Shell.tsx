import type { ReactNode } from "react";

import { Footer } from "@/components/shop/Footer";
import { Header } from "@/components/shop/Header";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
