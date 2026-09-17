import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { adminCardClass } from "@/lib/admin/ui";

export function AdminFormScreen({
  onBack,
  children,
}: {
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className={`${adminCardClass} mt-8`}>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        К списку
      </button>
      <div className="mt-6 w-full max-w-5xl space-y-6">{children}</div>
    </div>
  );
}
