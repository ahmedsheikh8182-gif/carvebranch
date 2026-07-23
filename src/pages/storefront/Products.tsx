import { useState, useMemo, useEffect } from 'react';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion/Motion';
import { useSearch, Link, useLocation } from 'wouter';
import { SEOMeta } from '@/components/SEOMeta';
import { formatPrice } from '@/lib/i18n';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { ProductGridSkeleton } from '@/components/skeletons';
import { EmptyState } from '@/components/EmptyState';
import { RecentlyViewed } from '@/components/RecentlyViewed';
import { useListProducts, useListCategories, Product } from '@workspace/api-client-react';
import { SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "OS"];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'best_seller', label: 'Best Sellers' },
];

export default function Products() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const [, setLocation] = useLocation();

  const filter = searchParams.get('filter');
  const categoryParam = searchParams.get('category');
  const sortParam = searchParams.get('sort') || '';
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const sizesParam = searchParams.get('sizes');
  const colorsParam = searchParams.get('colors');
  const inStockParam = searchParams.get('inStock');
  const qParam = searchParams.get('q');

  const [filterOpen, setFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Local filter state
  const [localMinPrice, setLocalMinPrice] = useState(0);
  const [localMaxPrice, setLocalMaxPrice] = useState(50000);
  const [localSizes, setLocalSizes] = useState<string[]>([]);
  const [localInStock, setLocalInStock] = useState(false);
  const [localSort, setLocalSort] = useState("");

  useEffect(() => {
    setLocalMinPrice(minPriceParam ? Number(minPriceParam) : 0);
    setLocalMaxPrice(maxPriceParam ? Number(maxPriceParam) : 50000);
    setLocalSizes(sizesParam ? sizesParam.split(',') : []);
    setLocalInStock(inStockParam === 'true');
    setLocalSort(sortParam);
  }, [minPriceParam, maxPriceParam, sizesParam, inStockParam, sortParam, filterOpen]);

  const { data: productsData, isLoading } = useListProducts({
    category: categoryParam || undefined,
    search: qParam || undefined,
    sort: sortParam as any || undefined,
    minPrice: minPriceParam ? Number(minPriceParam) : undefined,
    maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
    sizes: sizesParam || undefined,
    colors: colorsParam || undefined,
    inStock: inStockParam === 'true' ? true : undefined,
  });
  
  const { data: categoriesData } = useListCategories();
  
  let products = productsData?.products || [];
  
  if (filter === 'new-arrivals') {
    products = products.filter(p => p.isNewArrival);
  }

  const activeFilters = [];
  if (categoryParam) activeFilters.push({ label: `Category: ${categoryParam}`, key: 'category' });
  if (minPriceParam) activeFilters.push({ label: `Min: PKR ${Number(minPriceParam).toLocaleString()}`, key: 'minPrice' });
  if (maxPriceParam) activeFilters.push({ label: `Max: PKR ${Number(maxPriceParam).toLocaleString()}`, key: 'maxPrice' });
  if (sizesParam) activeFilters.push({ label: `Sizes: ${sizesParam}`, key: 'sizes' });
  if (inStockParam === 'true') activeFilters.push({ label: `In Stock Only`, key: 'inStock' });

  const removeFilter = (key: string) => {
    const newParams = new URLSearchParams(searchString);
    newParams.delete(key);
    setLocation(`/products?${newParams.toString()}`);
  };

  const updateSort = (sort: string) => {
    const newParams = new URLSearchParams(searchString);
    if (sort) newParams.set('sort', sort);
    else newParams.delete('sort');
    setLocation(`/products?${newParams.toString()}`);
    setSortDropdownOpen(false);
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchString);
    
    if (localMinPrice > 0) newParams.set('minPrice', localMinPrice.toString());
    else newParams.delete('minPrice');
    
    if (localMaxPrice < 50000) newParams.set('maxPrice', localMaxPrice.toString());
    else newParams.delete('maxPrice');
    
    if (localSizes.length > 0) newParams.set('sizes', localSizes.join(','));
    else newParams.delete('sizes');
    
    if (localInStock) newParams.set('inStock', 'true');
    else newParams.delete('inStock');
    
    if (localSort) newParams.set('sort', localSort);
    else newParams.delete('sort');
    
    setLocation(`/products?${newParams.toString()}`);
    setFilterOpen(false);
  };

  const clearAllFilters = () => {
    setLocation('/products');
    setFilterOpen(false);
  };

  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 3) return prev;
      return [...prev, product];
    });
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), localMaxPrice - 500);
    setLocalMinPrice(val);
  };
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), localMinPrice + 500);
    setLocalMaxPrice(val);
  };

  const pageTitle = filter === 'new-arrivals' 
    ? 'New Arrivals' 
    : categoryParam 
      ? categoryParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
      : 'Collection';

  const seoDescription = filter === 'new-arrivals'
    ? 'Shop new arrivals from Carve — the latest luxury Pakistani women\'s fashion in heritage cloth and artisan tailoring.'
    : categoryParam
    ? `Shop Carve's ${pageTitle} collection — luxury Pakistani women's fashion in heritage cloth and artisan tailoring.`
    : 'Shop the full Carve collection — luxury Pakistani women\'s fashion. Heritage cloth, artisan tailoring, considered design.';

  return (
    <Layout>
      <SEOMeta
        title={`${pageTitle} — The Collection`}
        description={seoDescription}
        url={`/products${categoryParam ? `?category=${categoryParam}` : ''}`}
      />
      <style dangerouslySetInnerHTML={{__html: `
        .range-slider::-webkit-slider-thumb {
          pointer-events: auto;
          width: 16px;
          height: 16px;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        .range-slider::-moz-range-thumb {
          pointer-events: auto;
          width: 16px;
          height: 16px;
          appearance: none;
          background: transparent;
          cursor: pointer;
          border: none;
        }
      `}} />

      <div className="w-full max-w-[1600px] mx-auto pt-32 pb-24 px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <FadeUp>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary mb-4 block">The Collection</span>
          </FadeUp>
          <FadeUp delay={80}>
            <h1 className="font-serif text-[48px] md:text-[80px] leading-[1] text-foreground mb-6">
              {pageTitle}
            </h1>
          </FadeUp>
          <FadeUp delay={160}>
            <p className="font-serif italic text-[18px] text-muted-foreground max-w-xl">
              Each piece chosen for the precision of its construction, the integrity of its cloth, and the quiet authority it lends.
            </p>
          </FadeUp>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-y border-border py-5 mb-16 relative">
          <div className="flex-1">
            <button 
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.2em] hover:text-muted-foreground transition-colors duration-300"
            >
              <SlidersHorizontal size={16} strokeWidth={1} />
              Refine
            </button>
          </div>

          <div className="hidden md:flex flex-1 justify-center flex-wrap gap-2">
            {activeFilters.map(f => (
              <div key={f.key} className="flex items-center gap-2 bg-secondary border border-border px-3 py-1 font-sans text-[9px] uppercase tracking-[0.2em]">
                <span>{f.label}</span>
                <button onClick={() => removeFilter(f.key)} className="hover:text-muted-foreground transition-colors duration-300">
                  <X size={10} strokeWidth={1} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex-1 flex justify-end items-center gap-6">
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {products.length} Pieces
            </span>
            
            <div className="relative">
              <button 
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.2em] hover:text-muted-foreground transition-colors duration-300"
              >
                {SORT_OPTIONS.find(o => o.value === sortParam)?.label || 'Sort By'}
                <ChevronDown size={14} strokeWidth={1} />
              </button>
              
              {sortDropdownOpen && (
                <div className="absolute top-full right-0 mt-4 w-48 bg-background border border-border shadow-xl z-30 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="py-2">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => updateSort(opt.value)}
                        className="w-full text-left px-4 py-2 font-sans text-[11px] uppercase tracking-[0.2em] hover:bg-secondary transition-colors duration-300"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <ProductGridSkeleton count={9} columns={3} />
        ) : products.length === 0 ? (
          <div className="py-24 text-center">
            <h2 className="font-serif italic text-[36px] mb-4">Nothing matched your edit.</h2>
            <p className="font-sans text-[13px] text-muted-foreground mb-8">Adjust your filters, or begin with a wider eye.</p>
            <button onClick={clearAllFilters} className="font-sans text-[11px] uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:text-muted-foreground transition-colors duration-300">
              Begin Again
            </button>
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8" staggerDelay={0.07}>
            {products.map(p => (
              <StaggerItem key={p.id}>
                <ProductCard 
                  product={p} 
                  onQuickView={setQuickViewProduct}
                  onCompare={toggleCompare}
                  isCompared={compareList.some(c => c.id === p.id)}
                />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>

      {/* Filter Sidebar overlay */}
      <div className={cn(
        "fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity duration-500",
        filterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )} onClick={() => setFilterOpen(false)} />

      {/* Filter Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 bottom-0 z-[60] w-full max-w-[360px] bg-background border-l border-border transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col",
        filterOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex justify-between items-center p-8 border-b border-border">
          <span className="font-serif text-[24px]">Refine</span>
          <div className="flex items-center gap-6">
            <button onClick={clearAllFilters} className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300">Clear All</button>
            <button onClick={() => setFilterOpen(false)} className="hover:opacity-70 transition-opacity duration-300">
              <X size={20} strokeWidth={1} />
            </button>
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto p-8 flex flex-col gap-12">
          
          {/* Sort */}
          <div>
            <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6">Sort By</h4>
            <div className="flex flex-col gap-4">
              {SORT_OPTIONS.map(opt => (
                <button 
                  key={opt.value}
                  onClick={() => setLocalSort(opt.value)}
                  className="flex items-center gap-3 group transition-colors duration-300"
                >
                  <div className={cn(
                    "w-4 h-4 border flex items-center justify-center transition-colors duration-300",
                    localSort === opt.value ? "border-foreground bg-foreground text-background" : "border-border group-hover:border-foreground/50 text-transparent"
                  )}>
                    <Check size={10} strokeWidth={2} />
                  </div>
                  <span className={cn(
                    "font-sans text-[12px] tracking-wide transition-colors duration-300",
                    localSort === opt.value ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full h-px bg-border" />

          {/* Categories */}
          <div>
            <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6">Category</h4>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  const newParams = new URLSearchParams(searchString);
                  newParams.delete('category');
                  setLocation(`/products?${newParams.toString()}`);
                  setFilterOpen(false);
                }}
                className={cn("text-left font-sans text-[13px] tracking-wide transition-colors duration-300 hover:opacity-70", !categoryParam ? "text-foreground" : "text-muted-foreground")}
              >
                All Categories
              </button>
              {categoriesData?.map((cat: any) => (
                <button 
                  key={cat.id} 
                  onClick={() => {
                    const newParams = new URLSearchParams(searchString);
                    newParams.set('category', cat.slug);
                    setLocation(`/products?${newParams.toString()}`);
                    setFilterOpen(false);
                  }}
                  className={cn(
                    "text-left font-sans text-[13px] tracking-wide transition-colors duration-300 hover:opacity-70",
                    categoryParam === cat.slug ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full h-px bg-border" />
          
          {/* Price */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Price Range</h4>
              <span className="font-sans text-[11px] tracking-wider text-foreground">
                {formatPrice(localMinPrice)} — {formatPrice(localMaxPrice)}
              </span>
            </div>
            
            <div className="relative h-1 bg-border my-6 rounded-none">
              <div 
                className="absolute h-full bg-foreground transition-all duration-75" 
                style={{ 
                  left: `${(localMinPrice / 50000) * 100}%`, 
                  right: `${100 - (localMaxPrice / 50000) * 100}%` 
                }} 
              />
              <input 
                type="range" 
                min={0} max={50000} step={500} 
                value={localMinPrice} 
                onChange={handleMinChange}
                className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none range-slider"
                style={{ zIndex: 3 }}
              />
              <input 
                type="range" 
                min={0} max={50000} step={500} 
                value={localMaxPrice} 
                onChange={handleMaxChange}
                className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none range-slider"
                style={{ zIndex: 4 }}
              />
              <div 
                className="absolute w-2 h-2 bg-foreground rounded-full top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75" 
                style={{ left: `calc(${(localMinPrice / 50000) * 100}%)`, zIndex: 5, transform: 'translateX(-50%) translateY(-50%)' }}
              />
              <div 
                className="absolute w-2 h-2 bg-foreground rounded-full top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75" 
                style={{ left: `calc(${(localMaxPrice / 50000) * 100}%)`, zIndex: 5, transform: 'translateX(-50%) translateY(-50%)' }}
              />
            </div>
          </div>
          
          <div className="w-full h-px bg-border" />
          
          {/* Size */}
          <div>
            <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6">Size</h4>
            <div className="grid grid-cols-4 gap-2">
              {ALL_SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => setLocalSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
                  className={cn(
                    "py-2 font-sans text-[11px] uppercase tracking-wide border transition-all duration-300",
                    localSizes.includes(size) ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/50"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full h-px bg-border" />
          
          {/* In Stock */}
          <div className="flex justify-between items-center">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.2em] text-foreground">In Stock Only</h4>
            <button 
              onClick={() => setLocalInStock(!localInStock)}
              className={cn(
                "w-8 h-4 rounded-full relative transition-colors duration-300",
                localInStock ? "bg-foreground" : "bg-border"
              )}
            >
              <div className={cn(
                "absolute top-0.5 w-3 h-3 bg-background rounded-full transition-all duration-300",
                localInStock ? "left-[18px]" : "left-0.5"
              )} />
            </button>
          </div>
          
        </div>
        
        <div className="p-8 border-t border-border">
          <button 
            onClick={applyFilters}
            className="w-full bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.2em] py-4 transition-colors duration-300 hover:bg-foreground/90"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Recently Viewed */}
      <RecentlyViewed className="border-t border-border bg-secondary" />

      {/* Compare Bar */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 h-[72px] bg-foreground text-background z-40 flex items-center justify-between px-6 md:px-12 transition-transform duration-500",
        compareList.length > 0 ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="flex items-center gap-6">
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] hidden md:inline">Compare Products</span>
          <div className="flex gap-4">
            {compareList.map(p => (
              <div key={p.id} className="flex items-center gap-3 bg-background/10 pr-3 border border-background/20 rounded-none">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F5F3EF] to-[#E8E4DE] flex items-center justify-center">
                  <span className="font-serif text-[8px] opacity-20">C</span>
                </div>
                <span className="font-sans text-[10px] tracking-widest max-w-[80px] truncate">{p.name}</span>
                <button onClick={() => toggleCompare(p)} className="hover:opacity-70 transition-opacity duration-300"><X size={12} strokeWidth={1} /></button>
              </div>
            ))}
            {Array.from({ length: 3 - compareList.length }).map((_, i) => (
              <div key={i} className="w-10 h-10 border border-background/20 border-dashed flex items-center justify-center opacity-30">
                <span className="font-sans text-[10px]">{compareList.length + i + 1}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setCompareList([])}
            className="font-sans text-[9px] uppercase tracking-[0.2em] text-background/60 hover:text-background transition-colors duration-300"
          >
            Clear All
          </button>
          <button
            onClick={() => setShowCompareModal(true)}
            disabled={compareList.length < 2}
            className={cn(
              "font-sans text-[11px] uppercase tracking-[0.2em] px-6 py-2.5 transition-colors duration-300",
              compareList.length > 1 
                ? "bg-background text-foreground hover:bg-background/90" 
                : "bg-background/20 text-background/50 cursor-not-allowed"
            )}
          >
            Compare {compareList.length}
          </button>
        </div>
      </div>

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col animate-in fade-in duration-400">
          <div className="flex justify-between items-center p-6 border-b border-border">
            <span className="font-serif text-2xl">Compare</span>
            <button onClick={() => setShowCompareModal(false)} className="hover:opacity-70 transition-opacity duration-300">
              <X size={24} strokeWidth={1} />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-6 md:p-12">
            <div className="max-w-[1200px] mx-auto grid gap-x-8" style={{ gridTemplateColumns: `repeat(${compareList.length}, minmax(0, 1fr))` }}>
              {compareList.map(p => (
                <div key={p.id} className="flex flex-col gap-8 px-6 border-r border-border last:border-r-0">
                  <div className="aspect-[3/4] bg-gradient-to-br from-[#F5F3EF] to-[#E8E4DE] relative flex items-center justify-center">
                    <span className="font-serif text-5xl opacity-10 tracking-widest">C</span>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    <div>
                      <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">Name</span>
                      <span className="font-serif text-2xl">{p.name}</span>
                    </div>
                    
                    <div className="w-full h-px bg-border" />
                    
                    <div>
                      <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">Price</span>
                      <span className="font-sans text-[14px]">{formatPrice(p.price)}</span>
                    </div>
                    
                    <div className="w-full h-px bg-border" />
                    
                    <div>
                      <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">Status</span>
                      <span className="font-sans text-[12px]">{p.inStock ? "In Stock" : "Out of Stock"}</span>
                    </div>
                    
                    <div className="w-full h-px bg-border" />
                    
                    <div>
                      <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Sizes</span>
                      <div className="flex flex-wrap gap-1">
                        {p.availableSizes?.map(s => <span key={s} className="px-2 py-0.5 border border-border font-sans text-[10px]">{s}</span>) || "OS"}
                      </div>
                    </div>
                    
                    <div className="w-full h-px bg-border" />
                    
                    <div>
                      <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Colors</span>
                      <div className="flex flex-wrap gap-1">
                        {p.availableColors?.map(c => <span key={c} className="px-2 py-0.5 border border-border font-sans text-[10px]">{c}</span>) || "One Color"}
                      </div>
                    </div>
                  </div>
                  
                  <Link href={`/products/${p.id}`} className="mt-8 font-sans text-[11px] uppercase tracking-[0.2em] text-center border border-foreground py-3 hover:bg-foreground hover:text-background transition-colors duration-300">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
      
    </Layout>
  );
}