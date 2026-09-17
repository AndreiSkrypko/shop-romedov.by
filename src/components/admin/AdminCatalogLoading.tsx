import { Loader2 } from "lucide-react";

export function AdminCatalogLoading({ message = "Загрузка каталога…" }: { message?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-lime-deep" aria-hidden />
      <p>{message}</p>
    </div>
  );
}
