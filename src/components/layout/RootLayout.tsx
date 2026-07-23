import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, Search, User as UserIcon, Heart, Menu } from 'lucide-react';
import { useGetMe, useGetCart } from '@workspace/api-client-react';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: user } = useGetMe({ query: { retry: false, throwOnError: false } });
  const { data: cart } = useGetCart({ query: { retry: false, throwOnError: false } });
  
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      {/* Top Banner */}
      <div className="bg-foreground text-background py-1.5 text-center text-xs tracking-widest uppercase">
        Free shipping on all orders over Rs. 10,000
      </div>
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center md:hidden">
            <button className="p-2 -ml-2 text-foreground/80 hover:text-foreground">
              <Menu className="w-6 h-6" />
            </button>
            <button className="p-2 text-foreground/80 hover:text-foreground ml-2">
              <Search className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium tracking-wide">
            <Link href="/products?filter=new-arrivals" className="text-foreground/80 hover:text-primary transition-colors">New Arrivals</Link>
            <Link href="/collections" className="text-foreground/80 hover:text-primary transition-colors">Collections</Link>
            <Link href="/products?category=pret-everyday" className="text-foreground/80 hover:text-primary transition-colors">Pret</Link>
            <Link href="/products?category=bridal-wedding" className="text-foreground/80 hover:text-primary transition-colors">Luxury</Link>
          </nav>

          <Link href="/" className="flex flex-col items-center justify-center -mt-2">
            <span className="font-serif text-3xl font-bold tracking-widest text-foreground leading-none">CARVE</span>
            <span className="text-[10px] tracking-[0.3em] text-primary uppercase mt-1">Luxury Refined</span>
          </Link>

          <div className="flex items-center gap-4">
            <button className="p-2 hidden md:block text-foreground/80 hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link href={user ? '/account' : '/login'} className="p-2 hidden md:block text-foreground/80 hover:text-primary transition-colors">
              <UserIcon className="w-5 h-5" />
            </Link>
            <Link href="/account/wishlist" className="p-2 text-foreground/80 hover:text-primary transition-colors relative">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="p-2 text-foreground/80 hover:text-primary transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {cart && cart.itemCount > 0 && (
                <span className="absolute top-0.5 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background pt-20 pb-10 border-t border-border/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <span className="font-serif text-2xl font-bold tracking-widest text-background mb-4 block">CARVE</span>
              <p className="text-muted/70 text-sm max-w-sm mb-6 leading-relaxed">
                A premium women's clothing brand rooted in timeless elegance, sophisticated craftsmanship, and modern femininity.
              </p>
              <div className="flex items-center gap-4">
                {/* Social Placeholders */}
                <div className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all cursor-pointer">In</div>
                <div className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all cursor-pointer">Fb</div>
                <div className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all cursor-pointer">Pi</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-serif text-lg mb-6 text-primary">Quick Links</h4>
              <ul className="space-y-4 text-sm text-muted/70">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Journal</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6 text-primary">Customer Care</h4>
              <ul className="space-y-4 text-sm text-muted/70">
                <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping & Delivery</Link></li>
                <li><Link href="/returns" className="hover:text-primary transition-colors">Returns & Exchanges</Link></li>
                <li><Link href="/size-guide" className="hover:text-primary transition-colors">Size Guide</Link></li>
                <li><Link href="/track" className="hover:text-primary transition-colors">Track Order</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between text-xs text-muted/50">
            <p>© 2025 Carve. All Rights Reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-background">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-background">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}