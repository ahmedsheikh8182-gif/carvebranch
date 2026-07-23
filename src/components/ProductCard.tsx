import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Product, useAddToCart, useAddToWishlist } from "@workspace/api-client-react";
import { Heart, Eye, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/i18n";

interface ProductCardProps {
  product: Product;
  className?: string;
  lazy?: boolean;
  onQuickView?: (product: Product) => void;
  onCompare?: (product: Product) => void;
  isCompared?: boolean;
}

export function ProductCard({ 
  product, 
  className, 
  lazy = true,
  onQuickView,
  onCompare,
  isCompared = false
}: ProductCardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const sizeSelectorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sizeSelectorRef.current && !sizeSelectorRef.current.contains(e.target as Node)) {
        setShowSizeSelector(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSizeSelector(false);
    };
    if (showSizeSelector) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showSizeSelector]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock) return;
    
    if (!selectedSize && product.availableSizes && product.availableSizes.length > 0) {
      setShowSizeSelector(true);
      return;
    }
    
    executeAdd(selectedSize || product.availableSizes?.[0] || "OS");
  };
  
  const executeAdd = (size: string) => {
    addToCartMutation.mutate({
      data: {
        productId: product.id,
        quantity: 1,
        size,
        color: product.availableColors?.[0] || ""
      }
    }, {
      onSuccess: () => {
        setAddedToCart(true);
        setShowSizeSelector(false);
        setTimeout(() => setAddedToCart(false), 1500);
      }
    });
  };

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
    executeAdd(size);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlistMutation.mutate({ productId: product.id }, {
      onSuccess: () => {
        toast({ title: "Added to Wishlist", description: `${product.name} saved.` });
      }
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCompare) onCompare(product);
  };

  const imageUrl = product.images?.[0];

  return (
    <Link href={`/products/${product.id}`} className={cn("group block w-full relative", className)}>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary transition-shadow duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[0_28px_56px_rgba(0,0,0,0.09)]">
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAF8] to-[#E8E4DE] flex flex-col items-center justify-center transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]">
          <span className="font-serif text-4xl opacity-[0.12] tracking-widest text-foreground">CARVE</span>
        </div>
        
        {/* Top left badge — precedence: Limited > Low Stock > The Icon > Nouvelle */}
        {(() => {
          const p = product as any;
          const stockCount = p.stockCount ?? null;
          const isLowStock = stockCount !== null && stockCount <= 3 && product.inStock;
          if (p.isLimitedEdition)
            return (
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="font-sans text-[9px] uppercase tracking-[0.2em] bg-foreground/90 text-white px-3 py-1 shadow-sm">Limited</span>
              </div>
            );
          if (isLowStock)
            return (
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="font-sans text-[9px] uppercase tracking-[0.2em] px-3 py-1 shadow-sm" style={{ backgroundColor: "#C9A96E", color: "white" }}>Low Stock</span>
              </div>
            );
          if (product.isBestSeller)
            return (
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="font-sans text-[9px] uppercase tracking-[0.2em] bg-foreground/90 text-white px-3 py-1 shadow-sm">The Icon</span>
              </div>
            );
          if (product.isNewArrival || product.isFeatured)
            return (
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="font-sans text-[9px] uppercase tracking-[0.2em] bg-white/90 text-foreground px-3 py-1 shadow-sm">Nouvelle</span>
              </div>
            );
          return null;
        })()}
        
        {/* Compare Checkbox */}
        {onCompare && (
          <div 
            onClick={handleCompare}
            className={cn(
              "absolute top-4 left-4 z-20 flex items-center gap-2 cursor-pointer transition-opacity duration-300",
              isCompared ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              ((product as any).isLimitedEdition || product.isNewArrival || product.isBestSeller) ? "mt-8" : ""
            )}
          >
            <div className={cn(
              "w-4 h-4 border border-border flex items-center justify-center transition-colors duration-300",
              isCompared ? "bg-foreground border-foreground text-background" : "bg-white/80 backdrop-blur-sm text-transparent hover:border-foreground"
            )}>
              <Check size={12} strokeWidth={2} />
            </div>
            <span className="font-sans text-[8px] uppercase tracking-widest bg-white/80 px-1.5 py-0.5 backdrop-blur-sm">Compare</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          aria-label={`Save ${product.name} to wishlist`}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
        >
          <Heart size={14} strokeWidth={1} className={addToWishlistMutation.isSuccess ? "fill-red-500 text-red-500" : "text-foreground"} />
        </button>

        {/* Quick View Button */}
        {onQuickView && (
          <button 
            onClick={handleQuickView}
            aria-label={`Quick view ${product.name}`}
            className="absolute bottom-16 right-4 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 hover:bg-white hover:scale-110"
          >
            <Eye size={14} strokeWidth={1} className="text-foreground" />
          </button>
        )}

        {/* Quick Add Button */}
        <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
          {showSizeSelector && (
            <div 
              ref={sizeSelectorRef}
              className="absolute bottom-full left-0 right-0 bg-background border border-border shadow-lg p-3 mb-1"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-sans text-[8px] uppercase tracking-[0.2em]">Choose Your Size</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.availableSizes?.map(size => (
                  <button
                    key={size}
                    onClick={(e) => handleSizeSelect(e, size)}
                    className="font-sans text-xs tracking-wide border border-border px-2 py-1 hover:bg-foreground hover:text-background transition-colors duration-300"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button 
            onClick={handleQuickAdd}
            aria-label={product.inStock ? `Add ${product.name} to bag` : `${product.name} is unavailable`}
            disabled={!product.inStock || addedToCart}
            className={cn(
              "w-full py-3 font-sans text-[9px] uppercase tracking-[0.2em] backdrop-blur-sm transition-colors duration-300 flex items-center justify-center",
              !product.inStock 
                ? "bg-muted-foreground/60 text-white cursor-not-allowed" 
                : addedToCart
                  ? "bg-green-700/90 text-white"
                  : "bg-foreground/90 text-white hover:bg-foreground"
            )}
          >
            {addedToCart ? (
              <span className="flex items-center gap-1.5">Added <Check size={10} strokeWidth={2} /></span>
            ) : addToCartMutation.isPending ? (
              <span className="animate-pulse">Adding...</span>
            ) : product.inStock ? (
              "Add to Bag"
            ) : (
              "Unavailable"
            )}
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-center text-center pt-4 transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2">
        <h3 className="font-serif text-[17px] tracking-wide mb-1 leading-snug text-foreground">{product.name}</h3>
        <p className="font-sans text-[11px] tracking-[0.1em] text-muted-foreground">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
