/**
 * Luxury skeleton loaders — match the exact layout of their live counterparts.
 * All use the `.skeleton-shimmer` CSS class defined in index.css.
 */

/* ─── ProductCard Skeleton ─────────────────────────────────────── */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="skeleton-shimmer aspect-[3/4] w-full mb-3" />
      <div className="px-1 flex flex-col gap-2">
        <div className="skeleton-shimmer h-4 w-3/4" />
        <div className="skeleton-shimmer h-3 w-1/3" />
        <div className="skeleton-shimmer h-3 w-1/2 mt-1" />
      </div>
    </div>
  );
}

/* ─── Product Grid Skeleton ────────────────────────────────────── */
interface ProductGridSkeletonProps {
  count?: number;
  columns?: 2 | 3 | 4;
}
export function ProductGridSkeleton({ count = 8, columns = 4 }: ProductGridSkeletonProps) {
  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${colClass} gap-6`}>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ─── Product Detail Skeleton ──────────────────────────────────── */
export function ProductDetailSkeleton() {
  return (
    <div className="w-full max-w-[1400px] mx-auto pt-28 pb-24 px-6 md:px-12">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Gallery column */}
        <div className="w-full lg:w-[55%]">
          <div className="skeleton-shimmer aspect-[3/4] w-full" />
          <div className="flex gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-shimmer w-16 h-20 shrink-0" />
            ))}
          </div>
        </div>
        {/* Info column */}
        <div className="w-full lg:w-[45%] flex flex-col gap-5 pt-2">
          <div className="skeleton-shimmer h-3 w-28 mb-1" />
          <div className="skeleton-shimmer h-10 w-3/4" />
          <div className="skeleton-shimmer h-7 w-1/3" />
          <div className="skeleton-shimmer h-px w-full my-2" />
          {/* Color swatches */}
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-shimmer w-8 h-8 rounded-full" />
            ))}
          </div>
          {/* Size grid */}
          <div className="flex gap-2 flex-wrap">
            {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
              <div key={s} className="skeleton-shimmer w-14 h-10" />
            ))}
          </div>
          {/* CTA buttons */}
          <div className="skeleton-shimmer h-14 w-full mt-2" />
          <div className="skeleton-shimmer h-12 w-full" />
          {/* Accordions */}
          <div className="flex flex-col gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-shimmer h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Cart Item Skeleton ───────────────────────────────────────── */
export function CartItemSkeleton() {
  return (
    <div className="py-8 border-b border-border flex items-start gap-6">
      <div className="skeleton-shimmer w-20 h-[100px] shrink-0" />
      <div className="flex-1 flex flex-col gap-3">
        <div className="skeleton-shimmer h-6 w-2/3" />
        <div className="skeleton-shimmer h-4 w-1/4" />
        <div className="skeleton-shimmer h-4 w-1/3 mt-2" />
      </div>
      <div className="skeleton-shimmer w-24 h-9 shrink-0" />
    </div>
  );
}

/* ─── Cart Loading Skeleton ────────────────────────────────────── */
export function CartSkeleton() {
  return (
    <div className="w-full max-w-[1400px] mx-auto pt-28 pb-24 px-6 md:px-12">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        <div className="w-full lg:w-[60%]">
          <div className="skeleton-shimmer h-10 w-40 mb-8" />
          {[1, 2, 3].map((i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>
        <div className="w-full lg:w-[40%]">
          <div className="skeleton-shimmer h-80 w-full" />
        </div>
      </div>
    </div>
  );
}

/* ─── Collection Card Skeleton ─────────────────────────────────── */
export function CollectionCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="skeleton-shimmer aspect-[4/3] w-full mb-4" />
      <div className="skeleton-shimmer h-5 w-1/2 mb-2" />
      <div className="skeleton-shimmer h-3 w-3/4 mb-1" />
      <div className="skeleton-shimmer h-3 w-1/3 mt-1" />
    </div>
  );
}

/* ─── Collections Grid Skeleton ────────────────────────────────── */
export function CollectionsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }, (_, i) => (
        <CollectionCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ─── Page Header Skeleton ─────────────────────────────────────── */
export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-3 mb-12">
      <div className="skeleton-shimmer h-3 w-20 mb-1" />
      <div className="skeleton-shimmer h-10 w-56" />
      <div className="skeleton-shimmer h-4 w-80" />
    </div>
  );
}
