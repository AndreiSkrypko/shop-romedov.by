type LogoProps = {
  invert?: boolean;
  tagline?: boolean;
  className?: string;
};

/**
 * RMV — Решение · Моделирование · Выполнение
 */
export function Logo({ invert = false, tagline = true, className = "" }: LogoProps) {
  const shimmer = invert ? "logo-shimmer logo-shimmer--invert" : "logo-shimmer";
  const lineShimmer = invert ? "logo-line-shimmer logo-line-shimmer--invert" : "logo-line-shimmer";
  const taglineMuted = invert ? "text-background/55" : "text-muted-foreground";
  const taglineAccent = invert ? "text-brand" : "text-graphite";

  return (
    <span className={`inline-flex items-center gap-5 ${className}`}>
      <span className="flex flex-col gap-2">
        <span
          className={`font-display text-lg font-semibold uppercase leading-none tracking-[0.12em] sm:text-xl ${shimmer}`}
          aria-label="RMV"
        >
          R·M·V
        </span>
        <span className={`h-px w-11 ${lineShimmer}`} aria-hidden="true" />
      </span>

      {tagline ? (
        <span className="flex flex-col gap-1 font-display text-[8px] font-medium uppercase leading-[1.35] tracking-[0.14em] sm:text-[9px]">
          <span className={invert ? "text-background/70" : "text-lime-deep/90"}>Решение</span>
          <span className={taglineAccent}>Моделирование</span>
          <span className={taglineMuted}>Выполнение</span>
        </span>
      ) : null}
    </span>
  );
}
