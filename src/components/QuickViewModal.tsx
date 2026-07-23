import { useState, useEffect } from "react";
import { Product, useAddToCart } from "@workspace/api-client-react";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (product: Product, size: string, color: string) => void;
}

export function QuickViewModal({ product, onClose, onAddToCart }: QuickViewModalProps) {
  const { toast } = useToast();
  const addToCartMutation = useAddToCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.availableSizes?.[0] || "");
      setSelectedColor(product.availableColors?.[0] || "");
      setIsMounted(true);
    } else {
      setIsMounted(false);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (product) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product, selectedSize, selectedColor);
    } else {
      addToCartMutation.mutate(
        { data: { productId: product.id, quantity: 1, size: selectedSize, color: selectedColor } },
        {
          onSuccess: () => {
            toast({
              title: "Added to Bag",
              description: `${product.name} has been added to your cart.`,
            });
            onClose();
          }
        }
      );
    }
  };

  const imageUrl = product.images?.[0];

  return (
    <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center">
      <div 
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-400 ease-out",
          isMounted ? "opacity-100" : "opacity-0"
        )} 
        onClick={onClose} 
      />
      
      <div 
        className={cn(
          "relative w-full md:max-w-3xl bg-background md:max-h-[85vh] h-[80vh] md:h-auto overflow-hidden flex flex-col md:flex-row shadow-2xl transition-transform duration-400 ease-out",
          isMounted ? "translate-y-0" : "translate-y-[40px] md:translate-y-[20px]"
        )}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-foreground/50 hover:text-foreground transition-colors duration-300"
        >
          <X size={20} strokeWidth={1} />
        </button>

        <div className="md:w-[40%] h-64 md:h-auto bg-secondary relative shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAF8] to-[#E8E4DE] flex items-center justify-center">
            <span className="font-serif text-3xl tracking-widest" style={{ opacity: 0.12 }}>CARVE</span>
          </div>
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNewArrival && (
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] bg-white/90 text-foreground px-3 py-1">Nouvelle</span>
            )}
            {product.isBestSeller && (
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] bg-foreground/90 text-white px-3 py-1">The Icon</span>
            )}
          </div>
        </div>

        <div className="md:w-[60%] p-8 md:p-10 overflow-y-auto flex flex-col">
          <h2 className="font-serif text-[32px] leading-tight text-foreground mb-2">{product.name}</h2>
          <p className="font-sans text-[16px] text-muted-foreground tracking-wide mb-6">PKR {product.price.toLocaleString()}</p>
          
          <div className="w-12 h-px bg-primary mb-6" />
          
          <p className="font-serif italic text-muted-foreground leading-relaxed mb-8">
            {product.description?.substring(0, 160)}
            {product.description && product.description.length > 160 ? "..." : ""}
          </p>

          {product.availableColors && product.availableColors.length > 0 && (
            <div className="mb-6">
              <span className="block font-sans text-[10px] uppercase tracking-[0.2em] mb-3">Colour</span>
              <div className="flex gap-2">
                {product.availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "px-3 py-1.5 font-sans text-[11px] uppercase tracking-wide border transition-all duration-300",
                      selectedColor === color 
                        ? "border-foreground bg-foreground text-background" 
                        : "border-border text-muted-foreground hover:border-foreground/50"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="mb-8">
              <span className="block font-sans text-[10px] uppercase tracking-[0.2em] mb-3">Size</span>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "px-3 py-1.5 font-sans text-[11px] uppercase tracking-wide border transition-all duration-300",
                      selectedSize === size 
                        ? "border-foreground bg-foreground text-background" 
                        : "border-border text-muted-foreground hover:border-foreground/50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-6 flex flex-col gap-4">
            <button
              onClick={handleAdd}
              disabled={!product.inStock || addToCartMutation.isPending}
              className={cn(
                "w-full py-4 font-sans text-[11px] uppercase tracking-[0.2em] transition-all duration-300",
                product.inStock
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "bg-muted-foreground/30 text-muted-foreground cursor-not-allowed"
              )}
            >
              {addToCartMutation.isPending ? "Adding..." : product.inStock ? "Add to Bag" : "Temporarily Unavailable"}
            </button>
            
            <Link 
              href={`/products/${product.id}`}
              onClick={onClose}
              className="self-center font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground border-b border-transparent hover:border-muted-foreground hover:text-foreground transition-all duration-300 pb-0.5"
            >
              Explore This Piece
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}