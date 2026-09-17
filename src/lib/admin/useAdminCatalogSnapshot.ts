import { useCallback, useEffect, useState } from "react";

import { buildAdminCatalogSnapshot, type AdminCatalogSnapshot } from "./catalog-snapshot";

export function useAdminCatalogSnapshot() {
  const [version, setVersion] = useState(0);
  const [snapshot, setSnapshot] = useState<AdminCatalogSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    buildAdminCatalogSnapshot()
      .then((data) => {
        if (!cancelled) setSnapshot(data);
      })
      .catch((cause) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Не удалось загрузить каталог");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [version]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  return { snapshot, loading, error, refresh };
}
