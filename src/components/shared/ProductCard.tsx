import { Link } from 'wouter';
import { Heart, Package } from 'lucide-react';
import type { Product } from '@workspace/api-client-react';

interface ProductCardProps {
  product: Product;
}

function ImagePlaceholder({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 w-full h-full bg-muted flex flex-col items-center justify-center gap-3">
      <Package className="w-10 h-10 text-muted-foreground/30" />
      <span className="text-xs text-muted-foreground/50 uppercase tracking-widest text-center px-4 line-clamp-2">{name}</span>
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasImages = product.images && product.images.length > 0;
  const image = hasImages ? product.images[0] : null;
  const hoverImage = hasImages && product.images.length > 1 ? product.images[1] : image;

  return (
    <div className="group relative flex flex-col gap-4">
      <Link href={`/products/${product.slug || product.id}`} className="relative block aspect-[2/3] overflow-hidden bg-muted">
        <ImagePlaceholder name={product.name} />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="bg-background text-foreground text-xs font-medium px-2 py-1 tracking-wider uppercase">New</span>
          )}
          {product.compareAtPrice && (
            <span className="bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 tracking-wider uppercase">Sale</span>
          )}
        </div>
      </Link>

      <button className="absolute top-4 right-4 p-2 text-foreground/50 hover:text-primary bg-background/50 backdrop-blur-sm rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <Heart className="w-5 h-5" />
      </button>

      <div className="flex flex-col gap-1 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">{product.category}</p>
        <Link href={`/products/${product.slug || product.id}`}>
          <h3 className="font-serif text-lg text-foreground hover:text-primary transition-colors cursor-pointer line-clamp-1">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-center gap-2 mt-1">
          <p className="text-sm font-medium">Rs. {product.price.toLocaleString()}</p>
          {product.compareAtPrice && (
            <p className="text-sm text-muted-foreground line-through">Rs. {product.compareAtPrice.toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}
