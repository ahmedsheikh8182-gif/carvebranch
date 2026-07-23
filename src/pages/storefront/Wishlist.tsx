import { useMemo } from "react";
import { Link, useSearch } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEOMeta } from "@/components/SEOMeta";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { useGetWishlist, useListProducts, useRemoveFromWishlist } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Share2, Heart } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

// ── Shared wishlist (read-only, no auth needed) ────────────────────
function SharedWishlistView({ ids }: { ids: number[] }) {
  // Use a high limit to ensure all products are fetched — shared links must be complete and deterministic
  const { data: productsData, isLoading } = useListProducts({ limit: 500 });
  const products = useMemo(() => {
    const all = (productsData as any)?.products ?? [];
    return ids
      .map((id) => all.find((p: any) => p.id === id))
      .filter(Boolean);
  }, [productsData, ids]);

  return (
    <Layout transparentNav={false}>
      <SEOMeta
        title="My Wishlist"
        description="Your saved Carve pieces — pieces chosen for the precision of their construction, ready to make yours."
        url="/wishlist"
      />
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* Header */}
        <div className="mb-16 border-b border-border pb-10">
          <span className="font-sans text-[9px] uppercase tracking-[0.35em] text-[#C9A96E] block mb-4">
            Shared with You
          </span>
          <h1 className="font-serif font-normal" style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
            A Curated Selection
          </h1>
          <p className="font-sans font-light text-[13px] text-muted-foreground mt-3 max-w-[40ch]">
            Someone thought these pieces were made for you.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 animate-pulse">
            {ids.map((id) => <div key={id} className="aspect-[3/4] bg-secondary" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif italic text-muted-foreground text-2xl">No pieces found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="font-sans text-[10px] uppercase tracking-[0.25em] border-b border-foreground pb-px hover:opacity-60 transition-opacity"
          >
            Explore The Collection
          </Link>
        </div>
      </div>
    </Layout>
  );
}

// ── Personal wishlist (authenticated) ─────────────────────────────
export default function Wishlist() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const search = useSearch();

  // Check for shared wishlist param
  const shareParam = new URLSearchParams(search).get("share");
  if (shareParam) {
    const ids = shareParam
      .split(",")
      .map((s) => parseInt(s, 10))
      .filter((n) => !isNaN(n));
    if (ids.length > 0) {
      return <SharedWishlistView ids={ids} />;
    }
  }

  return <WishlistContent onToast={toast} queryClient={queryClient} />;
}

function WishlistContent({ onToast, queryClient }: { onToast: any; queryClient: any }) {
  const { data: items, isLoading } = useGetWishlist({ query: { retry: false, throwOnError: false } });
  const removeFromWishlist = useRemoveFromWishlist();

  const wishlistItems = Array.isArray(items) ? items : [];

  function handleShare() {
    if (wishlistItems.length === 0) {
      onToast({ title: "Wishlist is empty", description: "Save some pieces first.", variant: "destructive" });
      return;
    }
    const ids = wishlistItems.map((item: any) => item.product.id).join(",");
    const url = `${window.location.origin}${window.location.pathname}?share=${ids}`;
    navigator.clipboard.writeText(url).then(() => {
      onToast({ title: "Link copied", description: "Share it with someone who matters." });
    }).catch(() => {
      onToast({ title: "Share URL", description: url });
    });
  }

  function handleRemove(productId: number) {
    removeFromWishlist.mutate({ productId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
        onToast({ title: "Removed from wishlist" });
      },
    });
  }

  return (
    <Layout transparentNav={false}>
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-border pb-10">
          <div>
            <span className="font-sans text-[9px] uppercase tracking-[0.35em] text-[#C9A96E] block mb-4">
              Your Saves
            </span>
            <h1
              className="font-serif font-normal"
              style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
            >
              Your Wishlist
            </h1>
            {!isLoading && wishlistItems.length > 0 && (
              <p className="font-sans font-light text-[13px] text-muted-foreground mt-2">
                {wishlistItems.length} {wishlistItems.length === 1 ? "piece" : "pieces"} saved
              </p>
            )}
          </div>
          {!isLoading && wishlistItems.length > 0 && (
            <button
              onClick={handleShare}
              className="flex items-center gap-2 border border-border px-6 py-3 font-sans text-[10px] uppercase tracking-[0.2em] hover:border-foreground hover:bg-secondary transition-all shrink-0"
            >
              <Share2 size={14} strokeWidth={1} />
              Share Wishlist
            </button>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-secondary" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && wishlistItems.length === 0 && (
          <div className="flex flex-col items-center py-32 gap-8 text-center">
            <Heart size={40} strokeWidth={0.8} className="text-muted-foreground/40" />
            <div>
              <p className="font-serif italic text-[28px] text-foreground mb-3">
                Nothing saved — yet.
              </p>
              <p className="font-sans font-light text-[13px] text-muted-foreground max-w-[32ch] mx-auto">
                When you find a piece that speaks to you, save it here. Your edit awaits.
              </p>
            </div>
            <Link
              href="/products"
              className="font-sans text-[10px] uppercase tracking-[0.3em] border-b border-foreground pb-px hover:opacity-60 transition-opacity"
            >
              Explore The Collection
            </Link>
          </div>
        )}

        {/* Items grid */}
        {!isLoading && wishlistItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            {wishlistItems.map((item: any) => (
              <div key={item.id} className="relative group">
                <ProductCard product={item.product} />
                {/* Remove button — appears on hover */}
                <button
                  onClick={() => handleRemove(item.product.id)}
                  className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-3 py-1.5 font-sans text-[9px] uppercase tracking-[0.2em] hover:bg-foreground hover:text-white"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
