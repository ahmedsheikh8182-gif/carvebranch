import { useState, useEffect } from 'react';
import { FadeUp, ScaleIn, Stagger, StaggerItem } from '@/components/motion/Motion';
import { Link } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { SEOMeta } from '@/components/SEOMeta';
import { useGetCart, useRemoveCartItem, useUpdateCartItem, useGetFeaturedProducts } from '@workspace/api-client-react';
import { ProductCard } from '@/components/ProductCard';
import { formatPrice } from '@/lib/i18n';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Trash2, Truck, RotateCcw, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/PageTransition';

export default function Cart() {
  const { data: cart, isLoading } = useGetCart({ query: { retry: false, throwOnError: false } });
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const { data: featuredProducts } = useGetFeaturedProducts();
  const { toast } = useToast();

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) {
      handleRemove(itemId);
      return;
    }
    updateItem.mutate({ id: itemId, data: { quantity } });
  };

  const handleRemove = (itemId: number) => {
    removeItem.mutate({ id: itemId }, {
      onSuccess: () => toast({ title: "Item removed" })
    });
  };

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  // Continue shopping section reusable component
  const ContinueShopping = () => {
    if (!featuredProducts || featuredProducts.length === 0) return null;
    const displayProducts = featuredProducts.slice(0, 4);

    return (
      <section className="bg-secondary mt-16 py-20 px-6 md:px-12 w-full max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center mb-16">
          <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#C9A96E] mb-4">Consider These</span>
          <h2 className="font-serif text-4xl">Continue The Edit</h2>
        </div>
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.07}>
          {displayProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <SEOMeta title="Your Bag" description="Review your selected pieces and proceed to checkout." url="/cart" />
        <div className="w-full max-w-[1400px] mx-auto pt-28 pb-24 px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 animate-pulse">
            <div className="w-full lg:w-[60%] flex flex-col gap-8">
              <div className="h-12 bg-secondary w-1/3 mb-8" />
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-6 pb-8 border-b border-border">
                  <div className="w-20 h-[100px] bg-secondary shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-6 bg-secondary w-1/2" />
                    <div className="h-4 bg-secondary w-1/3" />
                  </div>
                  <div className="w-24 h-10 bg-secondary" />
                </div>
              ))}
            </div>
            <div className="w-full lg:w-[40%] h-96 bg-secondary" />
          </div>
        </div>
      </Layout>
    );
  }

  if (isEmpty) {
    return (
      <Layout>
        <SEOMeta title="Your Bag" description="Review your selected pieces and proceed to checkout." url="/cart" />
        <div className="w-full max-w-[1400px] mx-auto pt-28 pb-24 px-6 md:px-12 flex flex-col min-h-[80vh]">
          <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[60vh]">
            <ScaleIn>
              <ShoppingBag size={64} strokeWidth={0.5} color="#E8E4DE" />
            </ScaleIn>
            <FadeUp delay={120}>
              <div className="w-[80px] h-px bg-border my-8" />
              <h1 className="font-serif italic text-4xl md:text-5xl mb-4">Your Bag Awaits.</h1>
              <p className="font-sans font-light text-sm text-muted-foreground leading-[1.8] max-w-xs mx-auto mb-10">
                Nothing has been chosen — yet. The collection is yours to explore.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                <Link 
                  href="/products" 
                  className="bg-foreground text-background font-sans text-[10px] uppercase tracking-[0.25em] px-8 py-4 hover:bg-foreground/90 transition-colors text-center"
                >
                  The Collection
                </Link>
                <Link 
                  href="/collections" 
                  className="border border-border text-foreground font-sans text-[10px] uppercase tracking-[0.25em] px-8 py-4 hover:bg-secondary transition-colors text-center"
                >
                  The Collections
                </Link>
              </div>
            </FadeUp>
          </div>
          <ContinueShopping />
        </div>
      </Layout>
    );
  }

  const subtotal = cart.subtotal || 0;
  const discount = cart.discount || 0;
  const shippingFreeThreshold = 10000;
  const isShippingFree = subtotal > shippingFreeThreshold;
  const total = cart.total || 0;

  return (
    <Layout>
      <SEOMeta title="Your Bag" description="Review your selected pieces and proceed to checkout." url="/cart" />
      <div className="w-full max-w-[1400px] mx-auto pt-28 pb-24 px-6 md:px-12">
        <PageTransition className="mb-12">
          <h1 className="font-serif text-4xl md:text-[40px] mb-2">Your Bag</h1>
          <p className="font-sans text-[11px] text-muted-foreground uppercase tracking-[0.1em]">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </p>
        </PageTransition>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">
          
          {/* Cart Items */}
          <div className="w-full lg:w-[60%]">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border font-sans text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              <div className="col-span-6">Product</div>
              <div className="col-span-3">Size & Colour</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-1 text-right">Total</div>
            </div>
            
            <Stagger className="flex flex-col" staggerDelay={0.07}>
              {items.map((item) => (
                <StaggerItem key={item.id}>
                  <div className="py-8 border-b border-border flex items-start gap-6 relative group">
                    
                    <Link href={`/products/${item.product.id}`} className="w-20 h-[100px] shrink-0 bg-secondary overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FAFAF8] to-[#E8E4DE]">
                        <span className="font-serif text-xs opacity-20">C</span>
                      </div>
                    </Link>
                    
                    <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-0 justify-between">
                      <div className="md:w-1/2 flex flex-col justify-start">
                        <Link href={`/products/${item.product.id}`}>
                          <h3 className="font-serif text-xl mb-1 hover:text-muted-foreground transition-colors">{item.product.name}</h3>
                        </Link>
                        <span className="font-sans text-[11px] text-muted-foreground mt-1">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      <div className="md:w-1/4 flex flex-col justify-start">
                        <span className="font-sans text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-1 block">
                          Size: {item.size}
                        </span>
                        {item.color && (
                          <span className="font-sans text-[10px] uppercase tracking-[0.1em] text-muted-foreground block">
                            Colour: {item.color}
                          </span>
                        )}
                      </div>
                      
                      <div className="md:w-1/4 flex flex-col items-end gap-2 relative">
                        <div className="flex border border-border h-9">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50"
                            disabled={updateItem.isPending}
                          >
                            <Minus size={12} strokeWidth={1} />
                          </button>
                          <span className="w-8 flex items-center justify-center font-sans text-sm">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50"
                            disabled={updateItem.isPending}
                          >
                            <Plus size={12} strokeWidth={1} />
                          </button>
                        </div>
                        <span className="font-sans text-[13px] font-normal text-foreground mt-2 text-right">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        
                        <button 
                          onClick={() => handleRemove(item.id)}
                          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mt-2"
                        >
                          <Trash2 size={14} strokeWidth={1} />
                          <span className="font-sans text-[10px] uppercase tracking-wider md:hidden">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[40%] sticky top-24">
            <FadeUp delay={200} className="border border-border p-8 bg-secondary/50 flex flex-col">
              <h2 className="font-serif text-2xl mb-8">Your Selection</h2>
              
              <div className="flex flex-col font-sans text-sm">
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">{items.length} items</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between py-3 border-b border-border text-green-700">
                    <span>Discount</span>
                    <span>-PKR {discount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{isShippingFree ? "Free" : "Calculated at checkout"}</span>
                </div>
                
                <div className="flex justify-between items-end pt-6 mt-2">
                  <span className="font-serif text-[22px]">Total</span>
                  <span className="font-sans text-lg font-normal">{formatPrice(total)}</span>
                </div>
              </div>
              
              <div className="w-full h-px bg-[#C9A96E] my-6" />
              
              <Link 
                href="/checkout"
                className="w-full flex items-center justify-center bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.25em] h-14 hover:bg-foreground/90 transition-colors duration-400 mb-6"
              >
                Complete Your Order
              </Link>
              
              <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col items-center gap-2 flex-1 text-center">
                  <Truck size={13} strokeWidth={1} className="text-muted-foreground" />
                  <span className="font-sans text-[9px] text-muted-foreground">Complimentary delivery above PKR 10,000</span>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1 text-center border-l border-border pl-2">
                  <RotateCcw size={13} strokeWidth={1} className="text-muted-foreground" />
                  <span className="font-sans text-[9px] text-muted-foreground">Gracious returns</span>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1 text-center border-l border-border pl-2">
                  <Shield size={13} strokeWidth={1} className="text-muted-foreground" />
                  <span className="font-sans text-[9px] text-muted-foreground">Secure checkout</span>
                </div>
              </div>
            </FadeUp>
          </div>
          
        </div>

        <ContinueShopping />
      </div>
    </Layout>
  );
}
