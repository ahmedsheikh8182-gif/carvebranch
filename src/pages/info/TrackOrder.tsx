import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOMeta } from "@/components/SEOMeta";
import { PageTransition } from "@/components/PageTransition";
import { useTrackOrder } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  const { data: tracking, isLoading, refetch } = useTrackOrder(
    { orderNumber, email }, 
    { query: { enabled: false, retry: false, throwOnError: false } }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    refetch();
  };

  return (
    <Layout>
      <SEOMeta
        title="Track Your Order"
        description="Enter your order number to track the status of your Carve delivery."
        url="/track"
      />
      <div className="w-full max-w-[900px] mx-auto pt-32 pb-32 px-6 md:px-12">
        <PageTransition className="mb-24 text-center">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">Services</span>
          <h1 className="font-serif text-5xl md:text-7xl mb-8">Track Order</h1>
        </PageTransition>
        
        <PageTransition delay={100}>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-6 mb-16">
            <div className="relative group">
              <input type="text" required value={orderNumber} onChange={e => setOrderNumber(e.target.value)} className="w-full bg-transparent border-b border-border py-4 font-sans text-sm tracking-wide focus:outline-none focus:border-foreground transition-colors peer" placeholder=" " id="orderNumber" />
              <label htmlFor="orderNumber" className="absolute left-0 top-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-foreground peer-valid:-top-4 peer-valid:text-xs peer-valid:text-foreground">Order Number</label>
            </div>
            <div className="relative group">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border-b border-border py-4 font-sans text-sm tracking-wide focus:outline-none focus:border-foreground transition-colors peer" placeholder=" " id="email" />
              <label htmlFor="email" className="absolute left-0 top-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-foreground peer-valid:-top-4 peer-valid:text-xs peer-valid:text-foreground">Email Address</label>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.2em] px-12 py-4 luxury-button hover:bg-foreground/90 transition-colors mt-4 disabled:opacity-50">
              {isLoading ? "Tracking..." : "Track"}
            </button>
          </form>
          
          {hasSearched && !isLoading && tracking && (
            <div className="bg-secondary/50 p-8 md:p-12 max-w-2xl mx-auto border border-border">
              <div className="flex justify-between items-center mb-8 border-b border-border pb-6">
                <div>
                  <h3 className="font-serif text-2xl mb-1">Order {tracking.orderNumber}</h3>
                  <span className="font-sans text-xs text-muted-foreground tracking-wide uppercase">{tracking.status}</span>
                </div>
                {tracking.estimatedDelivery && (
                  <div className="text-right">
                    <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-1">Est. Delivery</span>
                    <span className="font-sans text-sm">{new Date(tracking.estimatedDelivery).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border">
                {tracking.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-6 relative z-10">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 mt-0.5",
                      event.completed ? "bg-foreground border-foreground" : "bg-background border-border"
                    )}>
                      {event.completed && <div className="w-2 h-2 rounded-full bg-background" />}
                    </div>
                    <div>
                      <h4 className={cn("font-sans text-sm uppercase tracking-wide mb-1", event.completed ? "text-foreground" : "text-muted-foreground")}>{event.label}</h4>
                      {event.description && <p className="font-sans text-xs text-muted-foreground leading-relaxed mb-1">{event.description}</p>}
                      {event.timestamp && <span className="font-sans text-[10px] text-muted-foreground tracking-wider">{new Date(event.timestamp).toLocaleString()}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {hasSearched && !isLoading && !tracking && (
            <div className="text-center py-8">
              <p className="font-sans text-sm text-muted-foreground">Order not found. Please check your details and try again.</p>
            </div>
          )}
        </PageTransition>
      </div>
    </Layout>
  );
}
