import { Minus, Plus } from "lucide-react";

import { formatQuantity } from "@/lib/catalog";

type QuantityStepperProps = {
  value: number;
  step: number;
  min: number;
  unitLabel: string;
  onChange: (value: number) => void;
  size?: "sm" | "md";
};

export function QuantityStepper({
  value,
  step,
  min,
  unitLabel,
  onChange,
  size = "md",
}: QuantityStepperProps) {
  const clamp = (next: number) => Math.max(min, Math.round(next / step) * step);
  const buttonSize = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  const textSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-background">
      <button
        type="button"
        aria-label="Уменьшить"
        onClick={() => onChange(clamp(value - step))}
        disabled={value <= min}
        className={`${buttonSize} flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <Minus className="h-4 w-4" />
      </button>

      <label className="flex items-baseline gap-1 px-1">
        <input
          value={formatQuantity(value)}
          inputMode="decimal"
          aria-label={`Количество, ${unitLabel}`}
          onChange={(event) => {
            const parsed = Number(event.target.value.replace(",", "."));
            if (Number.isFinite(parsed)) onChange(Math.max(min, parsed));
          }}
          onBlur={(event) => {
            const parsed = Number(event.target.value.replace(",", "."));
            onChange(Number.isFinite(parsed) ? clamp(parsed) : min);
          }}
          className={`${textSize} w-12 border-0 bg-transparent text-center font-display font-semibold outline-none`}
        />
        <span className="text-xs text-muted-foreground">{unitLabel}</span>
      </label>

      <button
        type="button"
        aria-label="Увеличить"
        onClick={() => onChange(clamp(value + step))}
        className={`${buttonSize} flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-ink`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
