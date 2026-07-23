import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEOMeta } from "@/components/SEOMeta";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailSkeleton } from "@/components/skeletons";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { formatPrice } from "@/lib/i18n";
import { trackView } from "@/hooks/useBrowsingHistory";
import {
  useGetProduct,
  useAddToCart,
  useAddToWishlist,
  useGetProductReviews,
  useGetFeaturedProducts,
} from "@workspace/api-client-react";
import {
  Heart,
  Share2,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Truck,
  RotateCcw,
  Shield,
  ChevronDown,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

/* ─── IntersectionObserver hook ─────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(e.target); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Accordion ─────────────────────────────────────────────────── */
function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        className="w-full flex justify-between items-center py-5 group text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground">
          {title}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={1}
          className={cn("transition-transform duration-400", open && "rotate-180")}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          open ? "max-h-[600px] pb-6 opacity-100" : "max-h-0 pb-0 opacity-0"
        )}
      >
        <div className="font-sans text-[13px] leading-[1.85] text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Gradient placeholder panels ───────────────────────────────── */
const PLACEHOLDER_PANELS = [
  {
    gradient: "from-[#F5F3EF] to-[#E8E4DE]",
    label: "Front View",
  },
  {
    gradient: "from-[#EDE9E3] to-[#DDD8D0]",
    label: "Back View",
  },
  {
    gradient: "from-[#E0DBD3] to-[#D0CAC0]",
    label: "Fabric Detail",
  },
  {
    gradient: "from-[#D5CFC6] to-[#C5BDB2]",
    label: "Styled Look",
  },
];

/* ─── Main Component ─────────────────────────────────────────────── */
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const { data: product, isLoading } = useGetProduct(productId, {
    query: { enabled: !!id },
  });
  const { data: reviews } = useGetProductReviews(productId, {
    query: { enabled: !!id },
  });
  const { data: featured } = useGetFeaturedProducts();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [imgOpacity, setImgOpacity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);

  // Zoom state
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);

  // Touch swipe
  const touchStartX = useRef(0);

  const { toast } = useToast();
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();

  // Fabric section
  const { ref: fabricRef, visible: fabricVisible } = useInView();
  const { ref: reviewsRef, visible: reviewsVisible } = useInView();
  const { ref: recsRef, visible: recsVisible } = useInView();

  // Defaults on load
  useEffect(() => {
    if (product) {
      if (product.availableSizes?.length && !selectedSize)
        setSelectedSize(product.availableSizes[0]);
      if (product.availableColors?.length && !selectedColor)
        setSelectedColor(product.availableColors[0]);
    }
  }, [product]);

  // Info panel fade-in
  useEffect(() => {
    const t = setTimeout(() => setPanelVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  // Browsing history — track on every product mount
  useEffect(() => {
    if (!productId || !product) return;
    trackView(productId, (product as any).categorySlug || "");
  }, [productId, product]);

  // Build image array
  const realImages = product?.images?.filter(Boolean) ?? [];
  const images =
    realImages.length > 0
      ? realImages
      : PLACEHOLDER_PANELS.map((_, i) => `__placeholder_${i}`);

  const isPlaceholder = (src: string) => src.startsWith("__placeholder_");

  // Image switching with cross-fade
  const switchImage = useCallback(
    (idx: number) => {
      if (idx === activeImage) return;
      setImgOpacity(0.5);
      setTimeout(() => {
        setActiveImage(idx);
        setImgOpacity(1);
      }, 60);
    },
    [activeImage]
  );

  const prevImage = () =>
    switchImage((activeImage - 1 + images.length) % images.length);
  const nextImage = () => switchImage((activeImage + 1) % images.length);

  // Zoom
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imgRef.current) return;
      const rect = imgRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPos({ x, y });
    },
    []
  );

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? nextImage() : prevImage();
  };

  // Cart
  const handleAddToCart = () => {
    if (!selectedSize && product?.availableSizes?.length) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addToCartMutation.mutate(
      {
        data: {
          productId: product!.id,
          quantity,
          size: selectedSize || "OS",
          color: selectedColor || "",
        },
      },
      {
        onSuccess: () =>
          toast({ title: "Added to Bag", description: product!.name }),
      }
    );
  };

  // Wishlist
  const handleWishlist = () => {
    addToWishlistMutation.mutate(
      { productId: product!.id },
      {
        onSuccess: () =>
          toast({ title: "Saved", description: "Added to your wishlist" }),
      }
    );
  };

  // Share
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product?.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Copied", description: "Product link copied to clipboard" });
    }
  };

  /* ── Loading skeleton ─────────────────────────────────────────── */
  if (isLoading || !product) {
    return (
      <Layout>
        <ProductDetailSkeleton />
      </Layout>
    );
  }

  // Use same-category related products for "Complete the Look"; fall back to featured
  const relatedProducts = (product as any).relatedProducts ?? [];
  const recommended = relatedProducts.length > 0
    ? relatedProducts.slice(0, 4)
    : (featured ?? []).filter((p) => p.id !== product.id).slice(0, 4);

  const reviewList = Array.isArray(reviews) ? reviews : (reviews as any)?.data ?? [];

  const stockLabel = product.inStock
    ? (product as any).stockCount && (product as any).stockCount <= 5
      ? `Only ${(product as any).stockCount} left`
      : "In Stock — Ships in 3–5 business days"
    : "Currently Unavailable";

  const stockColor = product.inStock
    ? (product as any).stockCount && (product as any).stockCount <= 5
      ? "#D97706"
      : "#4CAF50"
    : "#EF4444";

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <Layout>
      <SEOMeta
        title={product.name}
        description={product.description ?? `${product.name} by Carve — luxury Pakistani women's fashion in heritage cloth and artisan tailoring. PKR ${product.price.toLocaleString()}.`}
        url={`/products/${product.id}`}
        type="product"
      />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description ?? `${product.name} by Carve`,
        brand: { "@type": "Brand", name: "Carve" },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "PKR",
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `https://carve.pk/products/${product.id}`,
        },
        image: product.images?.[0] ?? "https://carve.pk/og-image.jpg",
        url: `https://carve.pk/products/${product.id}`,
      }} />

      {/* ── MAIN VIEWER ──────────────────────────────────────────── */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-28 pb-0">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

          {/* ── LEFT: Gallery ─────────────────────────────────────── */}
          <div className="w-full lg:w-[58%]">
            {/* Main image */}
            <div
              ref={imgRef}
              className="relative aspect-[3/4] w-full overflow-hidden bg-secondary select-none"
              onMouseEnter={() => setZoomed(true)}
              onMouseLeave={() => setZoomed(false)}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{ cursor: zoomed && !isPlaceholder(images[activeImage]) ? "crosshair" : "default" }}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br flex flex-col items-center justify-center",
                  PLACEHOLDER_PANELS[activeImage % PLACEHOLDER_PANELS.length].gradient
                )}
                style={{ opacity: imgOpacity, transition: "opacity 350ms ease" }}
              >
                <span
                  className="font-serif tracking-[0.5em] select-none"
                  style={{ fontSize: "clamp(32px, 5vw, 56px)", opacity: 0.12, color: "#1A1A1A" }}
                >
                  CARVE
                </span>
                <span
                  className="font-sans uppercase mt-6 tracking-[0.35em]"
                  style={{ fontSize: "9px", opacity: 0.25, color: "#1A1A1A" }}
                >
                  {PLACEHOLDER_PANELS[activeImage % PLACEHOLDER_PANELS.length].label}
                </span>
              </div>

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/75 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={16} strokeWidth={1} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/75 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={16} strokeWidth={1} />
                  </button>
                </>
              )}

              {/* Zoom badge */}
              {!isPlaceholder(images[activeImage]) && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center hidden md:flex">
                  <ZoomIn size={14} strokeWidth={1} />
                </div>
              )}

              {/* Counter */}
              {images.length > 1 && (
                <span
                  className="absolute bottom-4 right-4 font-sans uppercase tracking-[0.2em]"
                  style={{ fontSize: "9px", color: "rgba(26,26,26,0.45)" }}
                >
                  {activeImage + 1} / {images.length}
                </span>
              )}

              {/* Gallery badge — precedence: Limited > Low Stock > The Icon > Nouvelle */}
              {(() => {
                const p = product as any;
                const isLowStock = p.stockCount != null && p.stockCount <= 3 && product.inStock;
                const badgeBase = "font-sans text-[9px] uppercase tracking-[0.2em] px-3 py-1 backdrop-blur-sm";
                if (p.isLimitedEdition) return (
                  <div className="absolute top-4 left-4">
                    <span className={`${badgeBase} bg-foreground/90 text-white`}>Limited</span>
                  </div>
                );
                if (isLowStock) return (
                  <div className="absolute top-4 left-4">
                    <span className={badgeBase} style={{ backgroundColor: "#C9A96E", color: "white" }}>Low Stock</span>
                  </div>
                );
                if (product.isBestSeller) return (
                  <div className="absolute top-4 left-4">
                    <span className={`${badgeBase} bg-foreground/90 text-white`}>The Icon</span>
                  </div>
                );
                if (product.isNewArrival || product.isFeatured) return (
                  <div className="absolute top-4 left-4">
                    <span className={`${badgeBase} bg-white/90 text-foreground`}>Nouvelle</span>
                  </div>
                );
                return null;
              })()}
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {images.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => switchImage(idx)}
                  className="shrink-0 w-[78px] h-[78px] overflow-hidden relative"
                  style={{
                    outline: activeImage === idx ? "1px solid #1A1A1A" : "1px solid transparent",
                    outlineOffset: "2px",
                    opacity: activeImage === idx ? 1 : 0.55,
                    transition: "opacity 300ms ease, outline-color 300ms ease",
                  }}
                  aria-label={`View ${idx + 1}`}
                >
                  <div
                    className={cn(
                      "w-full h-full bg-gradient-to-br flex items-center justify-center",
                      PLACEHOLDER_PANELS[idx % PLACEHOLDER_PANELS.length].gradient
                    )}
                  >
                    <span
                      className="font-serif"
                      style={{ fontSize: "10px", opacity: 0.2, letterSpacing: "0.2em" }}
                    >
                      C
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Info panel (sticky) ─────────────────────────── */}
          <div
            className="w-full lg:w-[42%] lg:sticky"
            style={{ top: "96px", maxHeight: "calc(100vh - 96px)", overflowY: "auto" }}
          >
            <div
              style={{
                opacity: panelVisible ? 1 : 0,
                transform: panelVisible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 700ms ease, transform 700ms ease",
              }}
            >
              {/* Breadcrumb */}
              <nav className="flex gap-2 items-center mb-8">
                <Link href="/products" className="font-sans text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors">
                  The Collection
                </Link>
                <span className="text-muted-foreground" style={{ fontSize: "10px" }}>/</span>
                <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-muted-foreground truncate max-w-[180px]">
                  {product.name}
                </span>
              </nav>

              {/* Info panel badge — precedence: Limited > Low Stock > The Icon > Nouvelle */}
              {(() => {
                const p = product as any;
                const isLowStock = p.stockCount != null && p.stockCount <= 3 && product.inStock;
                const cls = "font-sans uppercase tracking-[0.3em] block mb-3";
                const style = (color: string) => ({ fontSize: "9px", color });
                if (p.isLimitedEdition) return <span className={cls} style={style("#1A1A1A")}>Limited Edition</span>;
                if (isLowStock) return <span className={cls} style={style("#C9A96E")}>Low Stock</span>;
                if (product.isBestSeller) return <span className={cls} style={style("#C9A96E")}>The Icon</span>;
                if (product.isNewArrival || product.isFeatured) return <span className={cls} style={style("#C9A96E")}>Nouvelle</span>;
                return null;
              })()}

              {/* Name */}
              <h1
                className="font-serif font-normal mb-4"
                style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08 }}
              >
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-sans font-light tracking-[0.05em]" style={{ fontSize: "17px" }}>
                  {formatPrice(product.price)}
                </span>
                {(product as any).compareAtPrice && (product as any).compareAtPrice > product.price && (
                  <span
                    className="font-sans line-through text-muted-foreground"
                    style={{ fontSize: "13px" }}
                  >
                    {formatPrice((product as any).compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Stock indicator */}
              <div className="flex items-center gap-2 mb-6">
                <span
                  className="w-[7px] h-[7px] rounded-full shrink-0"
                  style={{ backgroundColor: stockColor }}
                />
                <span
                  className="font-sans uppercase tracking-[0.15em]"
                  style={{ fontSize: "9px", color: "#6B6560" }}
                >
                  {stockLabel}
                </span>
              </div>

              {/* Gold rule */}
              <div style={{ width: "48px", height: "1px", backgroundColor: "#C9A96E", marginBottom: "24px" }} />

              {/* Short description */}
              {product.description && (
                <p
                  className="font-serif italic text-muted-foreground mb-8"
                  style={{ fontSize: "17px", lineHeight: 1.75 }}
                >
                  {product.description.length > 180
                    ? product.description.slice(0, 180) + "…"
                    : product.description}
                </p>
              )}

              <div className="w-full h-px bg-border mb-8" />

              {/* Color */}
              {product.availableColors && product.availableColors.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-foreground">Colour</span>
                    <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                      {selectedColor}
                    </span>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {product.availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className="w-7 h-7 rounded-full border border-border transition-all duration-300"
                        style={{
                          backgroundColor: color.toLowerCase(),
                          outline: selectedColor === color ? "2px solid #C9A96E" : "2px solid transparent",
                          outlineOffset: "3px",
                        }}
                        aria-label={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-foreground">Size</span>
                    <Link href="/size-guide" className="font-sans text-[9px] uppercase tracking-[0.15em] text-muted-foreground border-b border-muted-foreground pb-px hover:text-foreground transition-colors">
                      Sizing Reference
                    </Link>
                  </div>
                  <div
                    className={cn("flex flex-wrap gap-2 transition-all duration-300", sizeError && "ring-1 ring-red-400 p-2 -m-2")}
                  >
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "min-w-[52px] h-11 px-4 border font-sans text-[11px] tracking-[0.1em] transition-all duration-200",
                          selectedSize === size
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-foreground hover:border-foreground/50"
                        )}
                        style={{ borderRadius: 0 }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity row */}
              <div className="flex items-center gap-4 mb-5">
                <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-foreground w-8">Qty</span>
                <div className="flex border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Minus size={12} strokeWidth={1} />
                  </button>
                  <span className="w-9 h-9 flex items-center justify-center font-sans text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Plus size={12} strokeWidth={1} />
                  </button>
                </div>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || !product.inStock}
                className="w-full h-[52px] font-sans text-[11px] uppercase tracking-[0.25em] transition-all duration-400 mb-3 disabled:opacity-50"
                style={{
                  backgroundColor: product.inStock ? "#1A1A1A" : "transparent",
                  color: product.inStock ? "white" : "#1A1A1A",
                  border: product.inStock ? "none" : "1px solid #E8E4DE",
                  borderRadius: 0,
                }}
              >
                {addToCartMutation.isPending
                  ? "Adding…"
                  : product.inStock
                  ? "Add to Bag"
                  : "Notify Me"}
              </button>

              {/* Wishlist + Share */}
              <div className="flex gap-3 mb-10">
                <button
                  onClick={handleWishlist}
                  disabled={addToWishlistMutation.isPending}
                  className="flex-1 h-11 flex items-center justify-center gap-2 border border-border font-sans text-[10px] uppercase tracking-[0.2em] text-foreground hover:bg-secondary transition-colors"
                  style={{ borderRadius: 0 }}
                >
                  <Heart size={13} strokeWidth={1} />
                  Save
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 h-11 flex items-center justify-center gap-2 border border-border font-sans text-[10px] uppercase tracking-[0.2em] text-foreground hover:bg-secondary transition-colors"
                  style={{ borderRadius: 0 }}
                >
                  <Share2 size={13} strokeWidth={1} />
                  Share
                </button>
              </div>

              {/* Accordions */}
              <div className="border-t border-border">
                <Accordion title="Material & Details" defaultOpen>
                  {product.material ? (
                    <span dangerouslySetInnerHTML={{ __html: product.material }} />
                  ) : (
                    "Crafted from the finest hand-selected Pakistani lawn cotton, woven for an unmatched drape and breathability. Lined with pure cotton voile. All hardware is gold-plated brass."
                  )}
                </Accordion>

                <Accordion title="Care Instructions">
                  {product.careInstructions ? (
                    <span dangerouslySetInnerHTML={{ __html: product.careInstructions }} />
                  ) : (
                    "Dry clean only. Store in the provided garment bag. Avoid direct sunlight. Iron on low heat through a pressing cloth. Do not tumble dry."
                  )}
                </Accordion>

                <Accordion title="Shipping & Delivery">
                  {product.deliveryInfo ? (
                    <span dangerouslySetInnerHTML={{ __html: product.deliveryInfo }} />
                  ) : (
                    "Complimentary standard delivery on all orders over PKR 10,000. Express delivery available. Orders dispatched within 1–2 business days in handcrafted packaging."
                  )}
                </Accordion>

                <Accordion title="Returns & Exchanges">
                  We accept returns within 30 days of delivery for items in original condition with tags intact. Exchanges are processed within 5 business days. Final sale items are non-returnable. Contact our client services team for assistance.
                </Accordion>

                <Accordion title="Authenticity">
                  Every CARVE piece arrives with a certificate of authenticity and bears our atelier label with a unique serial number. Each garment is hand-inspected before dispatch.
                </Accordion>
              </div>

              {/* Trust pills */}
              <div className="grid grid-cols-3 gap-4 pt-10 pb-6 border-t border-border mt-8">
                {[
                  { Icon: Truck, label: "Free Shipping", sub: "Orders over PKR 10,000" },
                  { Icon: RotateCcw, label: "30-Day Returns", sub: "Hassle-free policy" },
                  { Icon: Shield, label: "Authentic", sub: "Certificate included" },
                ].map(({ Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-2">
                    <Icon size={16} strokeWidth={1} className="text-muted-foreground" />
                    <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-foreground leading-tight">
                      {label}
                    </span>
                    <span className="font-sans text-[9px] text-muted-foreground leading-tight">
                      {sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FABRIC HIGHLIGHT STRIP ─────────────────────────────────── */}
      <section
        ref={fabricRef as any}
        className="w-full bg-secondary mt-24 py-24 px-6 md:px-12"
        style={{
          opacity: fabricVisible ? 1 : 0,
          transform: fabricVisible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 900ms ease, transform 900ms ease",
        }}
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <span
            className="font-sans uppercase tracking-[0.35em] block mb-5"
            style={{ fontSize: "9px", color: "#C9A96E" }}
          >
            Crafted With Intent
          </span>
          <h2
            className="font-serif italic font-normal mb-16"
            style={{ fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.2 }}
          >
            Where tradition meets the contemporary form
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 text-left">
            {[
              {
                numeral: "I",
                title: "Heritage Weave",
                body: "Every thread is sourced from the finest mills of Punjab and Sindh — regions celebrated for centuries of textile mastery. Our lawn is woven to a specification exclusive to CARVE.",
              },
              {
                numeral: "II",
                title: "Master Tailoring",
                body: "Each piece passes through twelve pairs of hands before it is sealed. From the initial cut to the final press, our artisans apply techniques passed down through four generations.",
              },
              {
                numeral: "III",
                title: "Lasting Quality",
                body: "We use only colourfast dyes and hand-finished seams. A CARVE garment is designed not for a season but for a lifetime — one that will be worthy of being passed down.",
              },
            ].map(({ numeral, title, body }, i) => (
              <div
                key={numeral}
                style={{
                  transitionDelay: `${i * 150}ms`,
                  opacity: fabricVisible ? 1 : 0,
                  transform: fabricVisible ? "translateY(0)" : "translateY(24px)",
                  transition: "opacity 900ms ease, transform 900ms ease",
                }}
              >
                <span
                  className="font-serif italic block mb-3"
                  style={{ fontSize: "52px", color: "#C9A96E", opacity: 0.25, lineHeight: 1 }}
                >
                  {numeral}
                </span>
                <h3
                  className="font-serif font-normal mb-4"
                  style={{ fontSize: "22px", lineHeight: 1.2 }}
                >
                  {title}
                </h3>
                <p className="font-sans font-light text-muted-foreground" style={{ fontSize: "13px", lineHeight: 1.9 }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────────────────────── */}
      <section
        ref={reviewsRef as any}
        className="w-full bg-background py-24 px-6 md:px-12"
        style={{
          opacity: reviewsVisible ? 1 : 0,
          transform: reviewsVisible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 900ms ease, transform 900ms ease",
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          {reviewList.length > 0 ? (
            <>
              <div className="flex justify-between items-end mb-14">
                <div>
                  <h2
                    className="font-serif font-normal mb-2"
                    style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
                  >
                    Client Reviews
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          strokeWidth={1}
                          style={{ color: "#C9A96E", fill: "#C9A96E" }}
                        />
                      ))}
                    </div>
                    <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      {reviewList.length} Review{reviewList.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviewList.slice(0, 4).map((review: any, i: number) => (
                  <div key={review.id ?? i} className="border border-border p-8 md:p-10">
                    <div className="flex gap-1 mb-5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={11}
                          strokeWidth={1}
                          style={{
                            color: s <= (review.rating ?? 5) ? "#C9A96E" : "#E8E4DE",
                            fill: s <= (review.rating ?? 5) ? "#C9A96E" : "#E8E4DE",
                          }}
                        />
                      ))}
                    </div>
                    <blockquote
                      className="font-serif italic mb-6"
                      style={{ fontSize: "19px", lineHeight: 1.65, color: "#1A1A1A" }}
                    >
                      "{review.comment ?? review.body ?? review.review}"
                    </blockquote>
                    <div className="flex gap-3 items-center">
                      <span className="font-sans uppercase tracking-[0.2em] text-muted-foreground" style={{ fontSize: "9px" }}>
                        {review.authorName ?? review.author ?? review.userName ?? "Anonymous"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="font-serif italic mb-3" style={{ fontSize: "28px", color: "#1A1A1A" }}>
                Be the first to share your experience
              </p>
              <p className="font-sans font-light text-muted-foreground" style={{ fontSize: "13px" }}>
                Client reviews appear here once submitted.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── RECOMMENDED ─────────────────────────────────────────────── */}
      {recommended.length > 0 && (
        <section
          ref={recsRef as any}
          className="w-full bg-secondary py-24 px-6 md:px-12"
          style={{
            opacity: recsVisible ? 1 : 0,
            transform: recsVisible ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 900ms ease, transform 900ms ease",
          }}
        >
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-14">
              <span
                className="font-sans uppercase tracking-[0.35em] block mb-4"
                style={{ fontSize: "9px", color: "#C9A96E" }}
              >
                You May Also Love
              </span>
              <h2
                className="font-serif font-normal"
                style={{ fontSize: "clamp(28px, 3vw, 42px)" }}
              >
                Complete The Look
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {recommended.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    transitionDelay: `${i * 100}ms`,
                    opacity: recsVisible ? 1 : 0,
                    transform: recsVisible ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 800ms ease, transform 800ms ease",
                  }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RECENTLY VIEWED ─────────────────────────────────────────── */}
      <RecentlyViewed excludeId={productId} className="bg-background border-t border-border" />

      {/* ── STICKY MOBILE ADD TO BAG ─────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-serif text-sm truncate leading-tight">{product.name}</p>
          <p className="font-sans text-[10px] text-muted-foreground mt-0.5 tracking-[0.05em]">
            PKR {product.price.toLocaleString()}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending || !product.inStock}
          className="shrink-0 px-6 py-3 font-sans text-[10px] uppercase tracking-[0.2em] disabled:opacity-50"
          style={{
            backgroundColor: "#1A1A1A",
            color: "white",
            borderRadius: 0,
          }}
        >
          {addToCartMutation.isPending ? "Adding…" : "Add to Bag"}
        </button>
      </div>

      {/* Bottom padding for mobile sticky bar */}
      <div className="lg:hidden h-20" />
    </Layout>
  );
}
