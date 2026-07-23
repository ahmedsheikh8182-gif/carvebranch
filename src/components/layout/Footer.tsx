import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-background pt-24 pb-12 border-t border-border">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-24">
          
          {/* Brand */}
          <div className="md:col-span-1 flex flex-col items-start">
            <Link href="/" className="flex flex-col items-start mb-6">
              <span className="font-serif text-[22px] tracking-[0.3em] font-semibold uppercase leading-none mb-1">Carve</span>
              <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-muted-foreground">Luxury Refined</span>
            </Link>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground max-w-xs">
              Fine Pakistani textiles. Considered design. Crafted for those who wear intention.
            </p>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium text-foreground mb-2">Discover</h4>
            <Link href="/products?filter=new-arrivals" className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors">New Arrivals</Link>
            <Link href="/collections" className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors">Collections</Link>
            <Link href="/products" className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors">Every Piece</Link>
            <Link href="/blog" className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors">The Journal</Link>
            <Link href="/gift-cards" className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors">Gift Cards</Link>
          </div>

          {/* Assistance */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium text-foreground mb-2">Care</h4>
            <Link href="/contact" className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors">Write to Us</Link>
            <Link href="/shipping" className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors">Delivery</Link>
            <Link href="/returns" className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors">Returns</Link>
            <Link href="/faq" className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            <Link href="/size-guide" className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors">Size Guide</Link>
            <Link href="/stores" className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors">Our Stores</Link>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium text-foreground mb-2">Reach Us</h4>
            <a href="mailto:info@carve.pk" className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors">info@carve.pk</a>
            <div className="flex flex-col gap-1">
              <span className="font-sans text-[13px] text-muted-foreground">0306-5748182</span>
              <span className="font-sans text-[13px] text-muted-foreground">0300-8619916</span>
            </div>
            <a href="https://wa.me/923008619916" target="_blank" rel="noopener noreferrer" className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors mt-2 underline underline-offset-4 decoration-border">WhatsApp</a>
          </div>

        </div>

        <div className="w-full h-px bg-border mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-[11px] text-muted-foreground uppercase tracking-[0.1em]">
            &copy; {new Date().getFullYear()} Carve. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="font-sans text-[11px] text-muted-foreground uppercase tracking-[0.1em] hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="font-sans text-[11px] text-muted-foreground uppercase tracking-[0.1em] hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
