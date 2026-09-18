import { useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { RequestForm } from "@/components/shop/RequestForm";

type RequestFormPanelProps = {
  title: string;
  description?: string;
  source: string;
  compact?: boolean;
  defaultMessage?: string;
  /** Текст кнопки на мобильных (открывает форму на весь экран). */
  mobileTriggerLabel?: string;
  /** В карточке товара — компактная рамка на десктопе. */
  embedded?: boolean;
};

export function RequestFormPanel({
  title,
  description,
  source,
  compact = false,
  defaultMessage = "",
  mobileTriggerLabel = "Оставить заявку",
  embedded = false,
}: RequestFormPanelProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [sheetOpen, setSheetOpen] = useState(false);

  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const openSheet = useCallback(() => setSheetOpen(true), []);

  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sheetOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [sheetOpen, closeSheet]);

  const formProps = { source, compact, defaultMessage };

  const heading = (
    <>
      <h2 className="font-display text-xl font-semibold uppercase">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </>
  );

  return (
    <>
      {/* Планшет и десктоп — форма на странице */}
      <div
        className={
          embedded
            ? "hidden rounded-lg border border-border bg-secondary/30 p-4 sm:p-5 md:block"
            : "hidden rounded-3xl border border-border p-6 sm:p-8 md:block"
        }
      >
        {heading}
        <div className="mt-6">
          <RequestForm {...formProps} />
        </div>
      </div>

      {/* Мобильные — кнопка и полноэкранная панель */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={openSheet}
          className="flex h-13 w-full items-center justify-center rounded-full bg-brand font-display text-sm font-semibold uppercase tracking-[0.12em] text-brand-foreground shadow-sm transition-transform active:scale-[0.98]"
        >
          {mobileTriggerLabel}
        </button>

        {sheetOpen ? (
          <div
            className="fixed inset-0 z-[100] flex flex-col bg-background"
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-form-sheet-title"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <button
                type="button"
                onClick={closeSheet}
                className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground underline decoration-dotted underline-offset-4"
              >
                Закрыть
              </button>
              <button
                type="button"
                onClick={closeSheet}
                aria-label="Закрыть форму"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm active:bg-secondary"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="shrink-0 border-b border-border px-4 pb-4">
              <h2
                id="request-form-sheet-title"
                className="font-display text-lg font-semibold uppercase leading-snug"
              >
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
              ) : null}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <RequestForm {...formProps} />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
