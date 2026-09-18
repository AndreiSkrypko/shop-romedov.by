import { yandexMapEmbedSrc, yandexMapsHref } from "@/lib/contacts";

type WarehouseMapProps = {
  className?: string;
  title?: string;
};

export function WarehouseMap({
  className = "",
  title = "Склад металлопроката Ромедов на карте",
}: WarehouseMapProps) {
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-2xl border border-border bg-secondary/30">
        <iframe
          title={title}
          src={yandexMapEmbedSrc()}
          className="block h-[min(22rem,55vw)] w-full border-0 sm:h-80"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a
        href={yandexMapsHref()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm text-muted-foreground underline decoration-dotted underline-offset-4 transition-colors hover:text-lime-deep"
      >
        Открыть в Яндекс.Картах
      </a>
    </div>
  );
}
