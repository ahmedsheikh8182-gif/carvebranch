import { useState, useEffect } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { PageTransition } from "@/components/PageTransition";
import { SEOMeta } from "@/components/SEOMeta";
import { useGetMe, useGetMyOrders, useGetMyAddresses, useAddAddress, useLogout, useGetWishlist, useRemoveFromWishlist } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { Plus, Heart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { formatPrice } from "@/lib/i18n";
import { useLoyalty, LoyaltyTier } from "@/lib/loyalty";

export default function AccountDashboard() {
  const [location, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const activeTab = params.get('tab') || 'profile';
  
  const { data: user, isLoading: isUserLoading, isError } = useGetMe({ query: { retry: false, throwOnError: false } });
  const { data: orders } = useGetMyOrders({ query: { enabled: !!user, retry: false, throwOnError: false } });
  const { data: addresses } = useGetMyAddresses({ query: { enabled: !!user, retry: false, throwOnError: false } });
  const { data: wishlistData, isLoading: loadingWishlist, refetch: refetchWishlist } = useGetWishlist({ query: { retry: false, throwOnError: false } });
  
  const wishlistItems = Array.isArray(wishlistData) ? wishlistData : (wishlistData as any)?.data ?? [];
  const removeFromWishlistMutation = useRemoveFromWishlist();
  
  const logoutMutation = useLogout();
  const addAddressMutation = useAddAddress();
  const { toast } = useToast();

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    addressLine1: "",
    city: "",
    country: "Pakistan",
    phone: ""
  });

  useEffect(() => {
    if (isError) {
      setLocation('/login');
    }
  }, [isError, setLocation]);

  if (isUserLoading || !user) {
    return <Layout><div className="min-h-screen bg-secondary animate-pulse" /></Layout>;
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem('carve_token');
        setLocation('/');
      }
    });
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddressMutation.mutate({ data: newAddress }, {
      onSuccess: () => {
        toast({ title: "Address Added" });
        setIsAddingAddress(false);
        setNewAddress({ fullName: "", addressLine1: "", city: "", country: "Pakistan", phone: "" });
      }
    });
  };

  const TabButton = ({ id, label }: { id: string, label: string }) => (
    <button 
      onClick={() => setLocation(`/account?tab=${id}`)}
      className={cn(
        "text-left font-sans text-[11px] uppercase tracking-[0.2em] py-3 transition-colors w-full border-b",
        activeTab === id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
      )}
    >
      {label}
    </button>
  );

  const loyaltyStatus = useLoyalty(orders as { total: number }[] | undefined);

  const TIER_COLORS: Record<LoyaltyTier, string> = {
    Ivory: "#E8E4DE",
    Pearl: "#B0B0C0",
    Gold: "#C9A96E",
  };

  return (
    <Layout>
      <SEOMeta title="My Account" description="Manage your Carve account, orders, addresses, and wishlist." url="/account" />
      <div className="w-full max-w-[1400px] mx-auto pt-32 pb-32 px-6 md:px-12">
        <PageTransition className="mb-16">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">My Account</h1>
          <p className="font-sans text-sm text-muted-foreground tracking-wide">
            Welcome back, {user.firstName}.
          </p>
        </PageTransition>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 flex flex-col gap-2">
            <TabButton id="profile" label="Profile Details" />
            <TabButton id="orders" label="Order History" />
            <TabButton id="addresses" label="Saved Addresses" />
            <TabButton id="wishlist" label="Wishlist" />
            <TabButton id="loyalty" label="Loyalty Status" />
            <button 
              onClick={handleLogout}
              className="text-left font-sans text-[11px] uppercase tracking-[0.2em] py-3 text-muted-foreground hover:text-destructive transition-colors w-full border-b border-transparent mt-8"
            >
              Sign Out
            </button>
          </div>
          
          {/* Content */}
          <div className="w-full lg:w-3/4">
            <PageTransition key={activeTab}>
              
              {activeTab === 'profile' && (
                <div className="flex flex-col gap-10">
                  <h2 className="font-serif text-3xl">Profile Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-secondary/50 p-8">
                    <div>
                      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Name</span>
                      <span className="font-sans text-sm tracking-wide">{user.firstName} {user.lastName}</span>
                    </div>
                    <div>
                      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Email</span>
                      <span className="font-sans text-sm tracking-wide">{user.email}</span>
                    </div>
                    <div>
                      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Member Since</span>
                      <span className="font-sans text-sm tracking-wide">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="flex flex-col gap-10">
                  <h2 className="font-serif text-3xl">Order History</h2>
                  {orders && orders.length > 0 ? (
                    <div className="flex flex-col gap-8">
                      {orders.map(order => (
                        <div key={order.id} className="border border-border p-8 flex flex-col md:flex-row justify-between gap-8">
                          <div className="flex flex-col gap-2">
                            <span className="font-sans text-[11px] uppercase tracking-[0.2em]">Order {order.orderNumber}</span>
                            <span className="font-sans text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-4">
                              Status: <span className="text-foreground">{order.status}</span>
                            </span>
                          </div>
                          <div className="flex flex-col md:items-end justify-between">
                            <span className="font-serif text-2xl">{formatPrice(order.total)}</span>
                            <button className="font-sans text-[11px] uppercase tracking-[0.2em] border-b border-foreground pb-0.5 mt-4 text-left">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState variant="orders" />
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="flex flex-col gap-10">
                  <h2 className="font-serif text-3xl">Saved Addresses</h2>
                  
                  {isAddingAddress ? (
                    <form onSubmit={handleAddAddress} className="flex flex-col gap-6 bg-secondary/50 p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative group">
                          <input type="text" required value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} className="w-full bg-transparent border-b border-border py-3 font-sans text-sm focus:outline-none focus:border-foreground" placeholder="Full Name" />
                        </div>
                        <div className="relative group">
                          <input type="tel" required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full bg-transparent border-b border-border py-3 font-sans text-sm focus:outline-none focus:border-foreground" placeholder="Phone" />
                        </div>
                      </div>
                      <div className="relative group">
                        <input type="text" required value={newAddress.addressLine1} onChange={e => setNewAddress({...newAddress, addressLine1: e.target.value})} className="w-full bg-transparent border-b border-border py-3 font-sans text-sm focus:outline-none focus:border-foreground" placeholder="Street Address" />
                      </div>
                      <div className="relative group">
                        <input type="text" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full bg-transparent border-b border-border py-3 font-sans text-sm focus:outline-none focus:border-foreground" placeholder="City" />
                      </div>
                      <div className="flex justify-end gap-4 mt-4">
                        <button type="button" onClick={() => setIsAddingAddress(false)} className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground px-6 py-3">Cancel</button>
                        <button type="submit" disabled={addAddressMutation.isPending} className="bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.2em] px-8 py-3 luxury-button">Save Address</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses?.map(addr => (
                          <div key={addr.id} className="border border-border p-8 flex flex-col">
                            <span className="font-sans font-medium text-sm mb-4 block">{addr.fullName}</span>
                            <span className="font-sans text-sm text-muted-foreground leading-relaxed block mb-6">
                              {addr.addressLine1}<br />
                              {addr.city}, {addr.province || ''}<br />
                              {addr.country}<br />
                              {addr.phone}
                            </span>
                            <button className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-destructive mt-auto text-left transition-colors">
                              Remove
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => setIsAddingAddress(true)}
                          className="border border-dashed border-border p-8 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all gap-4 min-h-[200px]"
                        >
                          <Plus size={20} strokeWidth={1} />
                          <span className="font-sans text-[11px] uppercase tracking-[0.2em]">Add New Address</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'loyalty' && (
                <div className="flex flex-col gap-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-serif text-3xl mb-2">Loyalty Status</h2>
                      <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C9A96E]">Launching Soon</span>
                    </div>
                  </div>

                  {/* Tier card */}
                  <div className="bg-secondary/50 border border-border p-8 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground block mb-2">Current Tier</span>
                        <span
                          className="font-serif italic text-[48px] leading-none"
                          style={{ color: TIER_COLORS[loyaltyStatus.tier] }}
                        >
                          {loyaltyStatus.tier}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground block mb-2">Points Earned</span>
                        <span className="font-serif text-[48px] leading-none">{loyaltyStatus.points.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {loyaltyStatus.nextTier && (
                      <div>
                        <div className="flex justify-between font-sans text-[10px] text-muted-foreground mb-3">
                          <span>{loyaltyStatus.tier}</span>
                          <span>{loyaltyStatus.nextTier} — {loyaltyStatus.pointsToNext.toLocaleString()} pts away</span>
                        </div>
                        <div className="w-full h-0.5 bg-border relative">
                          <div
                            className="absolute top-0 left-0 h-full transition-all duration-700"
                            style={{
                              width: `${loyaltyStatus.progressPercent}%`,
                              backgroundColor: TIER_COLORS[loyaltyStatus.tier],
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {loyaltyStatus.tier === "Gold" && (
                      <p className="font-sans text-[12px] text-[#C9A96E] text-center">
                        You have reached the highest tier. Thank you for choosing Carve.
                      </p>
                    )}
                  </div>

                  {/* How it works */}
                  <div className="flex flex-col gap-4">
                    <h3 className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground">How It Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { tier: "Ivory" as LoyaltyTier, range: "0 – 999 pts", desc: "Welcome tier — access to early sale announcements." },
                        { tier: "Pearl" as LoyaltyTier, range: "1,000 – 4,999 pts", desc: "Priority access to new collections and complimentary gift wrapping." },
                        { tier: "Gold" as LoyaltyTier, range: "5,000+ pts", desc: "Dedicated stylist, bespoke packaging, and exclusive pieces." },
                      ].map((t) => (
                        <div
                          key={t.tier}
                          className={cn(
                            "border p-6 flex flex-col gap-3",
                            loyaltyStatus.tier === t.tier ? "border-foreground bg-secondary/30" : "border-border"
                          )}
                        >
                          <span
                            className="font-serif italic text-[24px]"
                            style={{ color: TIER_COLORS[t.tier] }}
                          >
                            {t.tier}
                          </span>
                          <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{t.range}</span>
                          <p className="font-sans text-[12px] text-muted-foreground leading-relaxed">{t.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="font-sans text-[11px] text-muted-foreground text-center">
                    PKR 100 spent = 1 point · Points update after order delivery · Rewards launching soon
                  </p>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="flex flex-col gap-10">
                  {loadingWishlist ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse aspect-[3/4] bg-secondary w-full" />
                      ))}
                    </div>
                  ) : wishlistItems.length === 0 ? (
                    <EmptyState variant="wishlist" />
                  ) : (
                    <>
                      <div className="flex flex-col gap-2">
                        <h2 className="font-serif text-[36px]">My Wishlist</h2>
                        <span className="font-sans text-[11px] text-muted-foreground">
                          {wishlistItems.length} Saved {wishlistItems.length === 1 ? 'Piece' : 'Pieces'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlistItems.map((item: any) => (
                          <div key={item.id} className="relative group/wishlist">
                            <ProductCard product={item.product} />
                            <button
                              onClick={() => removeFromWishlistMutation.mutate({ productId: item.productId }, { onSuccess: () => refetchWishlist() })}
                              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover/wishlist:opacity-100 md:opacity-100"
                              aria-label="Remove from wishlist"
                              disabled={removeFromWishlistMutation.isPending}
                            >
                              <Trash2 size={13} strokeWidth={1} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

            </PageTransition>
          </div>
        </div>
      </div>
    </Layout>
  );
}
