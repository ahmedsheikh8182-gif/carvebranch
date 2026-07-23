import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOMeta } from "@/components/SEOMeta";
import { PageTransition } from "@/components/PageTransition";
import { formatPrice } from "@/lib/i18n";
import { useGetCart, useCreateOrder, useGetMyAddresses, useGetMe } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronRight, Lock, Truck, CreditCard, Edit2, Gift, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: cart, isLoading: isCartLoading } = useGetCart({ query: { retry: false, throwOnError: false } });
  const { data: addresses } = useGetMyAddresses({ query: { retry: false, throwOnError: false } });
  const { data: user } = useGetMe({ query: { retry: false, throwOnError: false } });
  
  const createOrder = useCreateOrder();
  
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Payment, 3: Review
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod");
  const [guestEmail, setGuestEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Gift options state
  const [giftOpen, setGiftOpen] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  
  const [guestAddress, setGuestAddress] = useState({
    fullName: "",
    addressLine1: "",
    city: "",
    province: "",
    country: "Pakistan",
    phone: ""
  });

  const isAuthenticated = !!user;
  const isCartEmpty = !cart || cart.items.length === 0;

  useEffect(() => {
    if (!isCartLoading && isCartEmpty && !isSuccess) {
      setLocation("/cart");
    }
  }, [isCartLoading, isCartEmpty, isSuccess, setLocation]);

  if (isCartLoading) {
    return <Layout><div className="min-h-screen bg-background pt-28"><div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 animate-pulse h-96 bg-secondary" /></div></Layout>;
  }

  if (isCartEmpty && !isSuccess) {
    return null; // Will redirect via useEffect
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!isAuthenticated && (!guestEmail || !guestAddress.fullName || !guestAddress.addressLine1 || !guestAddress.city || !guestAddress.phone)) {
        toast({ title: "Required fields missing", variant: "destructive" });
        return;
      }
      if (isAuthenticated && !selectedAddressId) {
        if (addresses && addresses.length > 0) {
          setSelectedAddressId(addresses[0].id);
        } else {
          toast({ title: "Please add an address in your account first.", variant: "destructive" });
          return;
        }
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = () => {
    createOrder.mutate({
      data: {
        paymentMethod,
        shippingAddressId: selectedAddressId || 0,
        guestEmail: !isAuthenticated ? guestEmail : undefined,
        guestAddress: !isAuthenticated ? guestAddress : undefined,
        isGift: isGift || undefined,
        giftWrap: (isGift && giftWrap) || undefined,
        giftMessage: (isGift && giftMessage.trim()) ? giftMessage.trim() : undefined,
      }
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        setTimeout(() => {
          setLocation(`/account?tab=orders`);
        }, 2000);
      },
      onError: () => {
        toast({ title: "Error placing order", variant: "destructive" });
      }
    });
  };

  if (isSuccess) {
    return (
      <Layout transparentNav={false}>
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
          <PageTransition className="flex flex-col items-center text-center px-6">
            <div className="w-12 h-12 rounded-full border border-[#C9A96E] flex items-center justify-center mb-8">
              <Check size={24} className="text-[#C9A96E]" strokeWidth={1} />
            </div>
            <h1 className="font-serif italic text-[40px] mb-4">Your Order is Confirmed.</h1>
            <p className="font-sans text-[13px] text-muted-foreground max-w-xs leading-relaxed">
              We have received your order and will begin preparing it with care. Updates will arrive by email.
            </p>
          </PageTransition>
        </div>
      </Layout>
    );
  }

  const subtotal = cart?.subtotal || 0;
  const discount = cart?.discount || 0;
  const total = cart?.total || 0;
  const shippingFreeThreshold = 10000;
  const isShippingFree = subtotal > shippingFreeThreshold;

  return (
    <Layout transparentNav={false}>
      <SEOMeta title="Checkout" description="Complete your Carve order securely." url="/checkout" />
      <div className="w-full max-w-[1200px] mx-auto pt-28 pb-24 px-6 md:px-12">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">
          
          {/* Main Checkout Form Column */}
          <div className="w-full lg:w-[60%]">
            
            {/* Progress Indicator */}
            <div className="flex items-center gap-0 mb-12 w-full">
              {[1, 2, 3].map((s, i) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center relative z-10">
                    <div className={cn(
                      "w-8 h-8 flex items-center justify-center transition-colors duration-300",
                      step === s ? "bg-foreground text-background" : 
                      step > s ? "bg-foreground/20 text-foreground" : "border border-border text-muted-foreground"
                    )}>
                      {step > s ? <Check size={14} strokeWidth={1} /> : <span className="font-sans text-xs">{s}</span>}
                    </div>
                    <span className="absolute top-10 whitespace-nowrap font-sans text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                      {s === 1 ? "Delivery" : s === 2 ? "Payment" : "Review"}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className="h-px flex-1 mx-4 bg-border relative overflow-hidden">
                      <div className={cn("absolute inset-0 bg-foreground transition-transform duration-500 origin-left", step > s ? "scale-x-100" : "scale-x-0")} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-8">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <PageTransition>
                  <h1 className="font-serif text-[28px] mb-8">Delivery Details</h1>
                  
                  {isAuthenticated && addresses ? (
                    <div className="flex flex-col gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map(addr => (
                          <div 
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={cn(
                              "border p-6 cursor-pointer transition-all relative",
                              selectedAddressId === addr.id ? "border-foreground bg-secondary/20" : "border-border hover:border-foreground/40"
                            )}
                          >
                            {selectedAddressId === addr.id && (
                              <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-foreground flex items-center justify-center">
                                <Check size={12} strokeWidth={2} className="text-background" />
                              </div>
                            )}
                            <div className="font-sans text-[13px] text-foreground font-medium mb-2 pr-6">
                              {addr.fullName}
                            </div>
                            <div className="font-sans text-[13px] text-muted-foreground leading-relaxed">
                              {addr.addressLine1}<br />
                              {addr.city}{addr.province ? `, ${addr.province}` : ''}<br />
                              {addr.phone}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => setLocation('/account?tab=addresses')}
                        className="w-full border border-dashed border-border py-4 font-sans text-[11px] uppercase tracking-[0.1em] text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                      >
                        + Add a Delivery Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                      <div className="md:col-span-2">
                        <label className="block font-sans text-[9px] uppercase tracking-[0.2em] mb-2 text-muted-foreground">Full Name</label>
                        <input 
                          type="text" 
                          value={guestAddress.fullName}
                          onChange={e => setGuestAddress({...guestAddress, fullName: e.target.value})}
                          className="w-full border-b border-border bg-transparent py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block font-sans text-[9px] uppercase tracking-[0.2em] mb-2 text-muted-foreground">Email</label>
                        <input 
                          type="email" 
                          value={guestEmail}
                          onChange={e => setGuestEmail(e.target.value)}
                          className="w-full border-b border-border bg-transparent py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block font-sans text-[9px] uppercase tracking-[0.2em] mb-2 text-muted-foreground">Phone Number</label>
                        <input 
                          type="tel" 
                          value={guestAddress.phone}
                          onChange={e => setGuestAddress({...guestAddress, phone: e.target.value})}
                          className="w-full border-b border-border bg-transparent py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-sans text-[9px] uppercase tracking-[0.2em] mb-2 text-muted-foreground">Address Line 1</label>
                        <input 
                          type="text" 
                          value={guestAddress.addressLine1}
                          onChange={e => setGuestAddress({...guestAddress, addressLine1: e.target.value})}
                          className="w-full border-b border-border bg-transparent py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block font-sans text-[9px] uppercase tracking-[0.2em] mb-2 text-muted-foreground">City</label>
                        <input 
                          type="text" 
                          value={guestAddress.city}
                          onChange={e => setGuestAddress({...guestAddress, city: e.target.value})}
                          className="w-full border-b border-border bg-transparent py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block font-sans text-[9px] uppercase tracking-[0.2em] mb-2 text-muted-foreground">Province (Optional)</label>
                        <select 
                          value={guestAddress.province}
                          onChange={e => setGuestAddress({...guestAddress, province: e.target.value})}
                          className="w-full border-b border-border bg-transparent py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors text-foreground appearance-none rounded-none"
                        >
                          <option value="">Select Province</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Sindh">Sindh</option>
                          <option value="KPK">KPK</option>
                          <option value="Balochistan">Balochistan</option>
                          <option value="Islamabad">Islamabad</option>
                        </select>
                      </div>
                    </div>
                  )}
                  
                  {/* Gift Options */}
                  <div className="mt-10 border border-border">
                    <button
                      type="button"
                      onClick={() => setGiftOpen(o => !o)}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Gift size={16} strokeWidth={1} className="text-muted-foreground" />
                        <span className="font-sans text-[11px] uppercase tracking-[0.2em]">Gift Options</span>
                      </div>
                      <ChevronDown
                        size={16}
                        strokeWidth={1}
                        className={cn("text-muted-foreground transition-transform duration-300", giftOpen && "rotate-180")}
                      />
                    </button>

                    {giftOpen && (
                      <div className="px-6 pb-6 border-t border-border pt-5 flex flex-col gap-5">
                        {/* Is gift toggle */}
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div
                            onClick={() => { setIsGift(v => !v); if (isGift) { setGiftWrap(false); setGiftMessage(""); } }}
                            className={cn(
                              "w-10 h-5 relative transition-colors duration-200 cursor-pointer shrink-0",
                              isGift ? "bg-foreground" : "bg-border"
                            )}
                          >
                            <span
                              className={cn(
                                "absolute top-0.5 left-0.5 w-4 h-4 bg-white transition-transform duration-200",
                                isGift ? "translate-x-5" : "translate-x-0"
                              )}
                            />
                          </div>
                          <span className="font-sans text-[13px] text-foreground">This is a gift</span>
                        </label>

                        {isGift && (
                          <div className="flex flex-col gap-5 pl-13">
                            {/* Gift wrap */}
                            <label className="flex items-center justify-between cursor-pointer">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={giftWrap}
                                  onChange={e => setGiftWrap(e.target.checked)}
                                  className="w-4 h-4 accent-foreground"
                                />
                                <span className="font-sans text-[13px]">Gift wrapping</span>
                              </div>
                              <span className="font-sans text-[11px] text-[#C9A96E] shrink-0 ml-4">+ PKR 500</span>
                            </label>

                            {/* Gift message */}
                            <div>
                              <label className="block font-sans text-[9px] uppercase tracking-[0.2em] mb-2 text-muted-foreground">
                                Gift Message <span className="normal-case">(optional)</span>
                              </label>
                              <textarea
                                value={giftMessage}
                                onChange={e => setGiftMessage(e.target.value.slice(0, 200))}
                                placeholder="Write a message for the recipient…"
                                rows={3}
                                className="w-full border-b border-border bg-transparent py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors resize-none placeholder:text-muted-foreground/40"
                              />
                              <span className="font-sans text-[10px] text-muted-foreground/60 float-right mt-1">
                                {giftMessage.length}/200
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-12">
                    <button 
                      onClick={handleNextStep}
                      className="bg-foreground text-background font-sans text-[10px] uppercase tracking-[0.25em] px-10 py-4 hover:bg-foreground/90 transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </PageTransition>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <PageTransition>
                  <h1 className="font-serif text-[28px] mb-8">Payment Method</h1>
                  
                  <div className="flex flex-col gap-4">
                    <div 
                      onClick={() => setPaymentMethod("cod")}
                      className={cn(
                        "border p-6 cursor-pointer transition-all flex flex-col",
                        paymentMethod === "cod" ? "border-foreground bg-secondary/20" : "border-border hover:border-foreground/40"
                      )}
                    >
                      <div className="flex items-center gap-4 mb-2">
                        <Truck size={24} strokeWidth={1} className={paymentMethod === "cod" ? "text-foreground" : "text-muted-foreground"} />
                        <h3 className="font-serif text-[22px]">Cash on Delivery</h3>
                        {paymentMethod === "cod" && <div className="ml-auto w-5 h-5 rounded-full bg-foreground flex items-center justify-center"><Check size={12} strokeWidth={2} className="text-background" /></div>}
                      </div>
                      <p className="font-sans font-light text-[12px] text-muted-foreground ml-10">
                        Pay upon delivery. Available across Pakistan.
                      </p>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod("bank_transfer")}
                      className={cn(
                        "border p-6 cursor-pointer transition-all flex flex-col",
                        paymentMethod === "bank_transfer" ? "border-foreground bg-secondary/20" : "border-border hover:border-foreground/40"
                      )}
                    >
                      <div className="flex items-center gap-4 mb-2">
                        <CreditCard size={24} strokeWidth={1} className={paymentMethod === "bank_transfer" ? "text-foreground" : "text-muted-foreground"} />
                        <h3 className="font-serif text-[22px]">Bank Transfer</h3>
                        {paymentMethod === "bank_transfer" && <div className="ml-auto w-5 h-5 rounded-full bg-foreground flex items-center justify-center"><Check size={12} strokeWidth={2} className="text-background" /></div>}
                      </div>
                      <p className="font-sans font-light text-[12px] text-muted-foreground ml-10">
                        Advance transfer to our account. Your order will be prepared upon payment confirmation, within 1–2 business days.
                      </p>
                      
                      {paymentMethod === "bank_transfer" && (
                        <div className="mt-4 ml-10 bg-secondary p-4 font-sans text-[11px] text-muted-foreground leading-relaxed">
                          Bank: HBL<br/>
                          Account Name: CARVE Official<br/>
                          IBAN: PK00HABB0000000000000000
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-12 flex gap-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="border border-border text-foreground font-sans text-[10px] uppercase tracking-[0.25em] px-10 py-4 hover:bg-secondary transition-colors"
                    >
                      ← Back
                    </button>
                    <button 
                      onClick={handleNextStep}
                      className="bg-foreground text-background font-sans text-[10px] uppercase tracking-[0.25em] px-10 py-4 hover:bg-foreground/90 transition-colors"
                    >
                      Continue to Review
                    </button>
                  </div>
                </PageTransition>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <PageTransition>
                  <h1 className="font-serif text-[28px] mb-8">Your Final Review</h1>
                  
                  <div className="flex flex-col gap-4 mb-8">
                    <div className="border border-border p-6 flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Truck size={16} strokeWidth={1} className="mt-1" />
                        <div className="flex flex-col">
                          <span className="font-sans text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-1">Delivery To</span>
                          <span className="font-sans text-[13px] text-foreground">
                            {isAuthenticated && selectedAddressId 
                              ? addresses?.find(a => a.id === selectedAddressId)?.addressLine1 
                              : guestAddress.addressLine1}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground">
                        <Edit2 size={14} strokeWidth={1} />
                      </button>
                    </div>

                    <div className="border border-border p-6 flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <CreditCard size={16} strokeWidth={1} className="mt-1" />
                        <div className="flex flex-col">
                          <span className="font-sans text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-1">Payment</span>
                          <span className="font-sans text-[13px] text-foreground">
                            {paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => setStep(2)} className="text-muted-foreground hover:text-foreground">
                        <Edit2 size={14} strokeWidth={1} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-[#C9A96E] my-6" />
                  
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={createOrder.isPending}
                    className="w-full bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.3em] h-14 flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-50"
                  >
                    {createOrder.isPending ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      <>
                        <Lock size={14} strokeWidth={1} />
                        Confirm Your Order
                      </>
                    )}
                  </button>
                  
                  <div className="mt-6 text-center font-sans text-[9px] text-muted-foreground tracking-wider">
                    Gracious returns within 30 days · Encrypted & secure · COD available
                  </div>
                </PageTransition>
              )}
            </div>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[40%] sticky top-24">
            <div className="border border-border p-8 bg-secondary/50">
              <h3 className="font-serif text-[24px] mb-8">Your Order</h3>
              
              <div className="flex flex-col gap-4 mb-8 max-h-[280px] overflow-y-auto pr-2 border-b border-border pb-8">
                {cart?.items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-[60px] bg-background shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-[#F5F3EF] to-[#E8E4DE]" />
                    </div>
                    <div className="flex flex-col flex-grow justify-center">
                      <span className="font-serif text-[14px] leading-tight mb-1">{item.product.name}</span>
                      <span className="font-sans text-[10px] text-muted-foreground">
                        {item.size}{item.color ? ` · ${item.color}` : ''} · ×{item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center font-sans text-[12px]">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-3 font-sans text-[13px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>{step >= 2 ? (isShippingFree ? "Complimentary" : "PKR 500") : "—"}</span>
                </div>
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-border">
                  <span className="font-serif text-[22px]">Total</span>
                  <span className="font-sans text-[18px]">PKR {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </Layout>
  );
}
