/**
 * RecentlyViewed — horizontal scrollable strip of up to 8 recently browsed products.
 * Hidden until at least 1 product has been viewed (other than the current one).
 */
import { useMemo } from "react";
import { useListProducts } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { getRecentIds } from "@/hooks/useBrowsingHistory";

interface RecentlyViewedProps {
  /** Exclude this product ID from the strip (e.g., the current product page) */
  excludeId?: number;
  className?: string;
}

export function RecentlyViewed({ excludeId, className }: RecentlyViewedProps) {
  // Read IDs synchronously; memoised so it doesn't fluctuate per render.
  const recentIds = useMemo(() => getRecentIds(9), []);

  const { data: productsData, isLoading } = useListProducts(
    {},
    { query: { enabled: recentIds.length > 0 } }
  );

  const products = useMemo(() => {
    const all = (productsData as any)?.products ?? [];
    return recentIds
      .filter((id) => id !== excludeId)
      .map((id) => all.find((p: any) => p.id === id))
      .filter(Boolean)
      .slice(0, 8);
  }, [productsData, recentIds, excludeId]);

  // Don't render if nothing to show.
  if (!isLoading && products.length === 0) return null;

  return (
    <section className={className}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24">
        {/* Heading */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="font-sans text-[9px] uppercase tracking-[0.35em] text-[#C9A96E] block mb-3">
              Your Journey
            </span>
            <h2 className="font-serif font-normal" style={{ fontSize: "clamp(26px, 2.5vw, 36px)" }}>
              Recently Viewed
            </h2>
          </div>
        </div>

        {/* Horizontal scroll strip */}
        <div
          className="flex gap-6 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.rv-strip::-webkit-scrollbar { display: none; }`}</style>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[220px] md:w-[260px]"
                >
                  <div className="aspect-[3/4] w-full skeleton-shimmer" />
                  <div className="mt-4 h-3 w-3/4 mx-auto skeleton-shimmer" />
                  <div className="mt-2 h-2.5 w-1/2 mx-auto skeleton-shimmer" />
                </div>
              ))
            : products.map((product: any) => (
                <div key={product.id} className="shrink-0 w-[220px] md:w-[260px]">
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
