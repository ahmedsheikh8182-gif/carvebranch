import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Search, User, Heart, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetCart, useSearchProducts } from "@workspace/api-client-react";
import { AnnouncementBar } from "@/components/AnnouncementBar";

/* ─── Search Overlay ─────────────────────────────────────────────── */
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Debounce query 320ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query.trim()), 320);
    return () => clearTimeout(t);
  }, [query]);

  const { data: results, isFetching } = useSearchProducts(
    { q: debouncedQ, limit: 8 },
    { query: { enabled: debouncedQ.length >= 2 } }
  );

  const products = (results as any)?.data ?? results ?? [];
  const hasResults = products.length > 0;
  const showEmpty = debouncedQ.length >= 2 && !isFetching && !hasResults;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[70] flex flex-col"
      style={{ backgroundColor: "rgba(250,250,248,0.97)", backdropFilter: "blur(8px)" }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-6 md:px-12 h-20 md:h-24 border-b border-border shrink-0">
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Search
        </span>
        <button
          onClick={onClose}
          aria-label="Close search"
          className="p-2 hover:opacity-60 transition-opacity"
        >
          <X size={20} strokeWidth={1} />
        </button>
      </div>

      {/* Search input */}
      <div className="px-6 md:px-16 pt-12 pb-8 border-b border-border shrink-0">
        <div className="max-w-3xl mx-auto relative">
          <Search
            size={18}
            strokeWidth={1}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search garments, collections…"
            className="w-full bg-transparent pl-8 pr-8 py-3 font-serif text-2xl md:text-3xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            style={{ caretColor: "#C9A96E" }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} strokeWidth={1} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-6 md:px-16 py-10">
        <div className="max-w-3xl mx-auto">

          {/* Idle state */}
          {debouncedQ.length < 2 && (
            <div className="text-center pt-16">
              <p className="font-serif italic text-muted-foreground" style={{ fontSize: "22px" }}>
                What are you looking for?
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {["Lawn Suits", "Formals", "Silk", "Bridal", "New Arrivals"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="font-sans text-[10px] uppercase tracking-[0.2em] border border-border px-4 py-2 hover:border-foreground hover:bg-secondary transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {isFetching && debouncedQ.length >= 2 && (
            <div className="flex flex-col gap-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-16 h-20 bg-secondary shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-4 w-2/3 bg-secondary" />
                    <div className="h-3 w-1/4 bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results list */}
          {!isFetching && hasResults && (
            <>
              <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
                {products.length} result{products.length !== 1 ? "s" : ""} for "{debouncedQ}"
              </p>
              <div className="flex flex-col divide-y divide-border">
                {products.map((product: any) => {
                  const img = product.images?.[0] ?? null;
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-5 py-5 group hover:bg-secondary/50 -mx-4 px-4 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-20 shrink-0 bg-secondary overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-[#F5F3EF] to-[#E8E4DE] flex items-center justify-center">
                          <span className="font-serif text-[10px] tracking-widest opacity-20">C</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-lg leading-tight mb-1 group-hover:opacity-70 transition-opacity">
                          {product.name}
                        </p>
                        <p className="font-sans text-[11px] tracking-[0.08em] text-muted-foreground">
                          PKR {product.price?.toLocaleString()}
                        </p>
                      </div>

                      <ArrowRight
                        size={14}
                        strokeWidth={1}
                        className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  );
                })}
              </div>

              {/* View all */}
              <div className="mt-8 pt-6 border-t border-border text-center">
                <Link
                  href={`/products?q=${encodeURIComponent(debouncedQ)}`}
                  onClick={onClose}
                  className="font-sans text-[10px] uppercase tracking-[0.25em] border-b border-foreground pb-px hover:opacity-60 transition-opacity"
                >
                  View All Results
                </Link>
              </div>
            </>
          )}

          {/* Empty state */}
          {showEmpty && (
            <div className="text-center pt-16">
              <p className="font-serif italic text-muted-foreground mb-3" style={{ fontSize: "22px" }}>
                Nothing found for "{debouncedQ}"
              </p>
              <p className="font-sans text-[11px] text-muted-foreground tracking-[0.1em]">
                Try another word, or discover the full collection.
              </p>
              <Link
                href="/products"
                onClick={onClose}
                className="inline-block mt-6 font-sans text-[10px] uppercase tracking-[0.25em] border-b border-foreground pb-px hover:opacity-60 transition-opacity"
              >
                Discover All
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────── */
export function Navbar({ isTransparent = false }: { isTransparent?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [location] = useLocation();
  const { data: cart } = useGetCart({ query: { retry: false, throwOnError: false } });

  const cartItemCount = cart?.itemCount || 0;

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 50); };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  // Lock body scroll when search or menu is open
  useEffect(() => {
    document.body.style.overflow = searchOpen || mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen, mobileMenuOpen]);

  const headerBg = isScrolled || !isTransparent
    ? "bg-background/95 backdrop-blur-md border-b border-border text-foreground"
    : "bg-transparent text-white";

  const iconColor = isScrolled || !isTransparent ? "currentColor" : "white";

  return (
    <>
      {/* Fixed header wrapper — contains announcement bar + navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        <AnnouncementBar />
        <motion.header
          className={cn(
            "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            headerBg
          )}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-between">

          {/* Left: Mobile toggle / Desktop links */}
          <div className="flex-1 flex items-center">
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1} />
            </button>

            <nav className="hidden md:flex gap-8 items-center">
              <Link href="/products?filter=new-arrivals" className="nav-link font-sans text-[11px] uppercase tracking-[0.2em]">New Arrivals</Link>
              <Link href="/collections" className="nav-link font-sans text-[11px] uppercase tracking-[0.2em]">Collections</Link>
              <Link href="/products" className="nav-link font-sans text-[11px] uppercase tracking-[0.2em]">The Collection</Link>
              <Link href="/blog" className="nav-link font-sans text-[11px] uppercase tracking-[0.2em]">Journal</Link>
            </nav>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="flex-1 flex flex-col items-center justify-center relative z-10 group">
            <span className="font-serif text-[22px] tracking-[0.3em] font-semibold uppercase leading-none mb-1">Carve</span>
            <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-muted-foreground group-hover:text-current transition-colors">Luxury Refined</span>
          </Link>

          {/* Right: Icons */}
          <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="hover:opacity-70 transition-opacity"
            >
              <Search size={18} strokeWidth={1} color={iconColor} />
            </button>
            <Link href="/account" aria-label="My account" className="hidden md:block hover:opacity-70 transition-opacity">
              <User size={18} strokeWidth={1} color={iconColor} />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="hover:opacity-70 transition-opacity">
              <Heart size={18} strokeWidth={1} color={iconColor} />
            </Link>
            <Link href="/cart" aria-label="Shopping bag" className="relative hover:opacity-70 transition-opacity">
              <ShoppingBag size={18} strokeWidth={1} color={iconColor} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center font-sans text-[8px]">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        </motion.header>
      </div>{/* end fixed header wrapper */}

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 z-[60] bg-[#1A1A1A] text-white transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        mobileMenuOpen ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-8 pointer-events-none"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-16">
            <span className="font-serif text-xl tracking-[0.3em] uppercase">Carve</span>
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="p-2 -mr-2">
              <X size={24} strokeWidth={1} />
            </button>
          </div>

          {/* Mobile search */}
          <button
            onClick={() => { setMobileMenuOpen(false); setTimeout(() => setSearchOpen(true), 300); }}
            className="flex items-center gap-3 mb-8 text-white/60 hover:text-white transition-colors"
          >
            <Search size={16} strokeWidth={1} />
            <span className="font-sans text-[11px] uppercase tracking-[0.2em]">Search</span>
          </button>

          <nav className="flex flex-col gap-8 items-start">
            <Link href="/" className="font-serif text-4xl italic tracking-wide text-white/90 hover:text-white transition-colors">Home</Link>
            <Link href="/products?filter=new-arrivals" className="font-serif text-4xl italic tracking-wide text-white/90 hover:text-white transition-colors">New Arrivals</Link>
            <Link href="/collections" className="font-serif text-4xl italic tracking-wide text-white/90 hover:text-white transition-colors">Collections</Link>
            <Link href="/products" className="font-serif text-4xl italic tracking-wide text-white/90 hover:text-white transition-colors">The Collection</Link>
            <Link href="/blog" className="font-serif text-4xl italic tracking-wide text-white/90 hover:text-white transition-colors">The Journal</Link>
          </nav>

          <div className="mt-auto flex flex-col gap-6 pt-12 border-t border-white/10">
            <div className="flex gap-6">
              <Link href="/login" className="font-sans text-[11px] uppercase tracking-[0.2em] text-white/70 hover:text-white">Account</Link>
              <Link href="/contact" className="font-sans text-[11px] uppercase tracking-[0.2em] text-white/70 hover:text-white">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
