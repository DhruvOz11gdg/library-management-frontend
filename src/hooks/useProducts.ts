/**
 * src/hooks/useProducts.ts
 * Replaces the static `products` import from data.ts (Block 6).
 *
 * Wraps products.service.ts with loading/error state plus a `reload()` so the
 * Showcase can offer a "Try again" button when the backend is down — the page
 * must degrade to a readable state, never a white screen.
 *
 * The whole active catalogue is fetched once (limit 60, the backend maximum)
 * and the Showcase tabs filter client-side, exactly like the static version
 * did. When the catalogue outgrows 60 products, switch to server-side
 * filtering with `meta.hasMore` (already returned).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { apiErrorMessage } from "../services/api";
import { getProducts, type ProductFilters, type ProductsPage } from "../services/products.service";
import type { Product } from "../data";

const STOREFRONT_PAGE_SIZE = 60;

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  meta: ProductsPage["meta"] | null;
  reload: () => void;
}

export function useProducts(filters: ProductFilters = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<ProductsPage["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  // Re-fetch only when the filter VALUES change, not on every new object identity.
  const filtersKey = JSON.stringify(filters);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProducts({ limit: STOREFRONT_PAGE_SIZE, ...filtersRef.current })
      .then((page) => {
        if (cancelled) return;
        setProducts(page.products);
        setMeta(page.meta);
      })
      .catch((err) => {
        if (!cancelled) setError(apiErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filtersKey, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { products, loading, error, meta, reload };
}
