/**
 * useRecommendations — personalised product list based on browsing history.
 *
 * Reads the most recently browsed category from localStorage.
 * Falls back to new arrivals for first-time visitors (no history).
 */
import { useMemo } from "react";
import { useListProducts, useGetNewArrivals, Product } from "@workspace/api-client-react";
import { getRecentCategories } from "./useBrowsingHistory";

interface UseRecommendationsResult {
  products: Product[];
  hasHistory: boolean;
  isLoading: boolean;
}

export function useRecommendations(excludeId?: number, limit = 4): UseRecommendationsResult {
  // Read history synchronously — it's localStorage, no async needed.
  const recentCategories = useMemo(() => getRecentCategories(1), []);
  const topCategory = recentCategories[0] ?? null;
  const hasHistory = !!topCategory;

  // Fetch by category when history exists; otherwise fall through to new arrivals.
  const { data: categoryData, isLoading: catLoading } = useListProducts(
    { category: topCategory ?? undefined },
    { query: { enabled: !!topCategory } }
  );

  const { data: newArrivalsData, isLoading: naLoading } = useGetNewArrivals({
    query: { enabled: !topCategory },
  });

  const products = useMemo(() => {
    let raw: Product[] = [];
    if (topCategory) {
      raw = (categoryData as any)?.products ?? [];
    } else {
      raw = Array.isArray(newArrivalsData)
        ? newArrivalsData
        : (newArrivalsData as any)?.data ?? [];
    }
    if (excludeId !== undefined) {
      raw = raw.filter((p) => p.id !== excludeId);
    }
    return raw.slice(0, limit);
  }, [categoryData, newArrivalsData, topCategory, excludeId, limit]);

  return {
    products,
    hasHistory,
    isLoading: topCategory ? catLoading : naLoading,
  };
}
